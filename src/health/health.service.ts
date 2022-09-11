import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckError, HealthCheckResult, HealthCheckService, HealthIndicatorResult, HealthIndicatorStatus, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { DockerImgServiceHealthIndicator, DockerServiceHealthIndicator } from './health-indicator/docker.service.healthIndicator';
import { HealthCheckMailFormat } from './types/interfaces';
import { HealthCheckStatusType, ReturnHealthFormatType } from './types/type';
import { HttpService } from '@nestjs/axios'

@Injectable()
export class HealthService {
    constructor(
        private readonly configService: ConfigService,
        private healthCheckService: HealthCheckService,
        private typeOrmHealthIndicator: TypeOrmHealthIndicator,
        private dockerService: DockerServiceHealthIndicator,
        private dockerImg: DockerImgServiceHealthIndicator,
        private httpService: HttpService,
        private http: HttpHealthIndicator,
    ) {}

    public async check<T>(formatType: ReturnHealthFormatType):Promise<T>{
        try {
            const result = await this.healthCheckService.check([
              async () => this.typeOrmHealthIndicator.pingCheck('DatabaseService'),
              ...this.customCheck()
            ]);
            return new HealthFormatResult(result, formatType).format();
          }catch(e){
            return new HealthFormatResult(e.response, formatType).format();
          }
    }

    private customCheck(){
        return [
            () => this.httpService.get(`${this.configService.get('adUrl')}/ad`).toPromise().then(({ statusText, config: { url }, data }) => {
                const status: HealthIndicatorStatus = statusText === 'OK' ? 'up' : 'down'
                return { 'AdService': { status, url } }
            }).catch(({ code, config: { url } }) => { throw new HealthCheckError('Ad-service check failed', { 'Ad-service': { status: 'down', code, url }})}),
            async () => this.dockerService.isHealthy('DockerService'),
            async () => this.dockerImg.isHealthy(this.configService.get('selenium.selenoidDockerImg'),'DockerSelenoid'),
            async () => this.http.pingCheck('AsteriskService', this.configService.get('asterisk.ari.url'))

        ]
    }
}


export class HealthFormatResult {
    result: HealthCheckResult;
    formatType: ReturnHealthFormatType
  
    constructor(result: HealthCheckResult, formatType: ReturnHealthFormatType) {
      this.result = result;
      this.formatType = formatType;
    }
  
    public format(){
      return this[this.getMethodByFormatType()]();
    }
    
  
    private getMethodByFormatType(): any {
      switch (this.formatType) {
        case ReturnHealthFormatType.http:
            return 'httpFormat';
        case ReturnHealthFormatType.mail:
            return 'mailFormat';
      }
    }
  
    private httpFormat(): HealthCheckResult {
      return this.result;
    }
  
    private mailFormat(): HealthCheckMailFormat{
      const mailInfoFormat = [];
  
      function parseObj(obj: HealthIndicatorResult){
        Object.keys(obj).forEach((value: string) => {
          mailInfoFormat.push({ serviceName: value, status: obj[value].status, detail: (!!obj[value].message)? {details: obj[value].message} : {} }); 
        })
      }
  
      const resultInfo = (this.result.status === 'error')? {...this.result.info, ...this.result.error} : {...this.result.info};
      parseObj(resultInfo);
      return {
        status: this.result.status as HealthCheckStatusType,
        service: mailInfoFormat
      }
    }
  }
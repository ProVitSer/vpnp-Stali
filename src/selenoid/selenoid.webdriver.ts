import { DockerService } from '@app/docker/docker.service';
import { LoggerService } from '@app/logger/logger.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Builder } from 'selenium-webdriver';
import { Capabilities } from './interfaces/selenoid-interface';

@Injectable()
export class SelenoidWebdriver implements OnApplicationBootstrap {
  private capabilities: Capabilities;
  private readonly selenoidDockerImg: string;
  private serviceContext: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly docker: DockerService,
  ) {
    this.capabilities = this.configService.get('selenium.capabilities');
    this.selenoidDockerImg = this.configService.get('selenium.selenoidDockerImg');
    this.serviceContext = SelenoidWebdriver.name;
  }

  async onApplicationBootstrap() {
    try {
      await this.docker.checkImgUp(this.selenoidDockerImg);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  public async getWebDriver() {
    try {
      return await new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(this.capabilities).build();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw 'Проблемы c webDriver';
    }
  }
}

import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dn, Extension, Fwdprofile } from './entities';

@Injectable()
export class Pbx3cxForwardStatusService {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Dn)
    private dn: Repository<Dn>,
    @InjectRepository(Extension)
    private extension: Repository<Extension>,
    @InjectRepository(Fwdprofile)
    private fwdprofile: Repository<Fwdprofile>,
  ) {
    this.serviceContext = Pbx3cxForwardStatusService.name;
  }

  public async getExtenId(exten: string): Promise<Dn> {
    try {
      return await this.dn.createQueryBuilder('dn').select().where('dn.value = :value', { value: exten }).getOne();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  public async getExtensionInfo(extenId: number): Promise<Extension> {
    try {
      return await this.extension.createQueryBuilder('extension').select().where('extension.fkiddn = :id', { id: extenId }).getOne();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  public async getExtenProfiles(dnExtenId: number): Promise<Fwdprofile[]> {
    try {
      return await this.fwdprofile
        .createQueryBuilder('fwdprofile')
        .select()
        .where('fwdprofile.fkidextension = :id', { id: dnExtenId })
        .getMany();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  public async getExtenCurrentProfile(profileId: number): Promise<{ profilename: string }> {
    try {
      return await this.fwdprofile
        .createQueryBuilder('fwdprofile')
        .select('fwdprofile.profilename')
        .where('fwdprofile.idfwdprofile = :id', { id: profileId })
        .getOne();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}

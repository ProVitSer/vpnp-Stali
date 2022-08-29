
import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CallcentQueuecalls, ClCalls, ClParticipants, ClPartyInfo, ClSegments, Meetingsession } from './entities';
import {  Repository } from "typeorm";

@Injectable()
export class CallInfoService {
    constructor(
        private readonly logger: LoggerService,
        @InjectRepository(ClParticipants)
        private callParticipants: Repository<ClParticipants>,
        @InjectRepository(ClPartyInfo)
        private callPartyInfo: Repository<ClPartyInfo>,
        @InjectRepository(ClSegments)
        private callSegments: Repository<ClSegments>,
        @InjectRepository(ClCalls)
        private calls: Repository<ClCalls>,
        @InjectRepository(CallcentQueuecalls)
        private queue: Repository<CallcentQueuecalls>,
        @InjectRepository(Meetingsession)
        private meetings: Repository<Meetingsession>
      ) {}

    public async getAllMeetings(){
        try {
            return await this.meetings.createQueryBuilder('meetingsession').select('*').getMany();
        } catch(e){
            throw e;
        }
    }
    
    //Поиск первый ID вызова в базе 3сх
    public async searchFirstIncomingIdByNumber(incomingNumber: string): Promise<ClPartyInfo>{
        try {
          return await this.callPartyInfo
          .createQueryBuilder("cl_party_info")
          .select("cl_party_info.id")
          .where("cl_party_info.callerNumber like :number", {
            number: incomingNumber,
          })
          .orderBy("cl_party_info.id", "DESC")
          .getOne();
        } catch(e){
            throw e;
        }
    }  
    
    public async searchCallPartyInfo(id: number): Promise<ClPartyInfo>{
        try {
          return await this.callPartyInfo
          .createQueryBuilder("cl_party_info")
          .select("*")
          .where("cl_party_info.id = :id", { id: id })
          .getOne();
        } catch(e){
            throw e;
        }
    }    


    //Поиск уникальный ID вызова в базе 3сх
    public async searchCallInfo(infoId: number): Promise<ClParticipants>{
        try {
          return await this.callParticipants
          .createQueryBuilder("cl_participants")
          .select('*')
          .where("cl_participants.info_id = :id", { id: infoId })
          .getOne();
        } catch(e){
            throw e;
        }
    }

    public async searchAnswerByCallID(callId: number): Promise<Array<number>>{
        try {
          return await this.callParticipants
          .createQueryBuilder("cl_participants")
          .select("cl_participants.infoId")
          .where("cl_participants.call_id = :id", { id: callId })
          .andWhere('cl_participants.answer_time is not null')
          .getRawMany()
        } catch(e){
            throw e;
        }
    }

    public async searcInfoId(callId: number): Promise<ClParticipants>{
        try {
          return await this.callParticipants
          .createQueryBuilder("cl_participants")
          .select("cl_participants.infoId")
          .where("cl_participants.call_id = :id", { id: callId })
          .orderBy("cl_party_info.id", "DESC")
          .getOne();
        } catch(e){
            throw e;
        }
    }
    
    //Последнийответивший согласно 3сх
    public async searchLastUserRing(ids: Array<number>, extension: string): Promise<ClPartyInfo> {
        try {
          return await this.callPartyInfo
          .createQueryBuilder("cl_party_info")
          .select("cl_party_info.dn")
          .where("cl_party_info.id IN (:...ids)", { ids: ids })
          .andWhere("cl_party_info.dn like :extension", {
            extension: extension,
          })
          .getOne();
        } catch(e){
          throw e;
        }
    }

    public async getCallcenterInfo(incomingNumber: string): Promise<CallcentQueuecalls> {
        try{
            return await this.queue
            .createQueryBuilder("callcent_queuecalls")
            .select("*")
            .where("callcent_queuecalls.from_userpart like :incomingNumber", { incomingNumber: incomingNumber })
            .orderBy("callcent_queuecalls.idcallcent_queuecalls", "DESC")
            .getOne();
        }catch(e){
            throw e;
        }
    }
}
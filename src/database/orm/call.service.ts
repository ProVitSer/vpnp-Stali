import { LoggerService } from "@app/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { CallInfoService } from "./call-info.service";
import { ClParticipants } from "./entities";
import { CallInfoData, CallInfoEventData, KindCall } from "./types/interface";

@Injectable()
export class CallService {
    constructor(
        private readonly callInfoService: CallInfoService,
        private readonly logger: LoggerService
    ){}

    public async search3cxExtensionCall(data: CallInfoEventData): Promise<CallInfoData>{
        try {
            const { unicueid, incomingNumber, extension } = data;
            this.logger.info(`${unicueid} ${incomingNumber} ${extension}`);
            const callInfo =  await this.getCallInfo(incomingNumber);
            console.log(callInfo)
            const answerCalls = await this.callInfoService.searchAnswerByCallID(callInfo.callId);
            const mapAnswerCalls = answerCalls.map((answerCalls: any) => { return answerCalls.cl_participants_info_id});
            console.log('answerCalls',answerCalls)

            const callUserInfo = await this.callInfoService.searchLastUserRing(mapAnswerCalls, extension.trim());
            console.log('callUserInfo', callUserInfo)
            if(!!callUserInfo){

                return {
                    kind: KindCall.local,
                    moduleUnicueId: data.unicueid,
                    pbx3cxUnicueId: callInfo.callId,
                    destinationNumber: callUserInfo.dn,
                    startCallTime: callInfo.startTime,
                    endCallTime: callInfo.endTime
                }
            }else {
                console.log(unicueid, callInfo)

                return await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId);
            }
        } catch(e){
            this.logger.error(e);
        }
    }


    public async search3cxGroupCall(data: CallInfoEventData): Promise<CallInfoData>{
        try {
            const { unicueid, incomingNumber, extension } = data;
            this.logger.info(`${unicueid} ${incomingNumber} ${extension}`);
            console.log(incomingNumber)

            const modIncomingNumber = (incomingNumber.length == 12) ?  incomingNumber.substring(1): incomingNumber;
            console.log(modIncomingNumber)

            const callInfo =  await this.getCallInfo(modIncomingNumber);
            console.log('callInfo',callInfo)
            const callCenterCallInfo = await this.callInfoService.getCallcenterInfo(modIncomingNumber);
            console.log('callCenterCallInfo',callCenterCallInfo)

            if(!callCenterCallInfo.callHistoryId || callCenterCallInfo.toDialednum == ''){
                return await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId); 
            } else {
                return {
                    kind: KindCall.group,
                    moduleUnicueId: data.unicueid,
                    pbx3cxUnicueId: callInfo.callId,
                    destinationNumber: callCenterCallInfo.toDialednum,
                    startCallTime: callInfo.startTime,
                    endCallTime: callInfo.endTime
                }
            }
        }catch(e){
            this.logger.error(e);
        }
    }

    public async getAllMeetings(){
        try {
            return await this.callInfoService.getAllMeetings()
        } catch (e) {
            this.logger.error(e);
        }
    }

    private async search3cxInfoMobileRedirection(unicueid: string, callId: number): Promise<CallInfoData>{
        try {
            console.log('callId',callId)

            const infoId = await this.callInfoService.searcInfoId(callId);
            console.log('infoId',infoId)

            const callPartyInfo = await this.callInfoService.searchCallPartyInfo(infoId.infoId);
            console.log(callPartyInfo)

            const callParticipants = await this.callInfoService.searchCallInfo(infoId.infoId);
            console.log(callParticipants)

            return {
                kind: KindCall.mobile,
                moduleUnicueId: unicueid,
                pbx3cxUnicueId: callParticipants.callId,//infoId.callId,
                destinationNumber: callPartyInfo.dn,//callPartyInfo.displayName,
                startCallTime: callParticipants.startTime,
                endCallTime: callParticipants.endTime
            }
        }catch(e){
            this.logger.error(e);
        }
    }  


    private async getCallInfo(incomingNumber: string){
        try {  
            console.log(incomingNumber)
            const callPartyInfo = await this.callInfoService.searchFirstIncomingIdByNumber(incomingNumber.trim());
            console.log(callPartyInfo)

            return await this.callInfoService.searchCallInfo(callPartyInfo.id);
        }catch(e){
            this.logger.error(e);
        }
    }
}


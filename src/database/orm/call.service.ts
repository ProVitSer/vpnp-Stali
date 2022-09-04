import { LoggerService } from "@app/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { CallInfoService } from "./call-info.service";
import { ClParticipants } from "./entities";
import { CallInfoData, CallInfoEventData, KindCall } from "./types/interface";

@Injectable()
export class CallService {
    private serviceContext: string;
    constructor(
        private readonly callInfoService: CallInfoService,
        private readonly logger: LoggerService
    ){
        this.serviceContext = CallService.name;
    }

    public async search3cxExtensionCall(data: CallInfoEventData): Promise<CallInfoData>{
        try {
            const { unicueid, incomingNumber, extension } = data;
            this.logger.info(`${unicueid} ${incomingNumber} ${extension}`, this.serviceContext);
            const callInfo =  await this.getCallInfo(incomingNumber);
            const answerCalls = await this.callInfoService.searchAnswerByCallID(callInfo.callId);
            const mapAnswerCalls = answerCalls.map((answerCalls: any) => { return answerCalls.cl_participants_info_id});
            const callUserInfo = await this.callInfoService.searchLastUserRing(mapAnswerCalls, extension.trim());
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
                return await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId);
            }
        } catch(e){
            this.logger.error(e, this.serviceContext);
        }
    }


    public async search3cxGroupCall(data: CallInfoEventData): Promise<CallInfoData>{
        try {
            const { unicueid, incomingNumber, extension } = data;
            this.logger.info(`${unicueid} ${incomingNumber} ${extension}`);
            const modIncomingNumber = (incomingNumber.length == 12) ?  incomingNumber.substring(1): incomingNumber;
            const callInfo =  await this.getCallInfo(modIncomingNumber);
            const callCenterCallInfo = await this.callInfoService.getCallcenterInfo(modIncomingNumber);
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
            this.logger.error(e, this.serviceContext);
        }
    }

    public async getAllMeetings(){
        try {
            return await this.callInfoService.getAllMeetings()
        } catch (e) {
            this.logger.error(e, this.serviceContext);
        }
    }

    private async search3cxInfoMobileRedirection(unicueid: string, callId: number): Promise<CallInfoData>{
        try {
            const infoId = await this.callInfoService.searcInfoId(callId);
            const callPartyInfo = await this.callInfoService.searchCallPartyInfo(infoId.infoId);
            const callParticipants = await this.callInfoService.searchCallInfo(infoId.infoId);
            return {
                kind: KindCall.mobile,
                moduleUnicueId: unicueid,
                pbx3cxUnicueId: callParticipants.callId,//infoId.callId,
                destinationNumber: callPartyInfo.dn,//callPartyInfo.displayName,
                startCallTime: callParticipants.startTime,
                endCallTime: callParticipants.endTime
            }
        }catch(e){
            this.logger.error(e, this.serviceContext);
        }
    }  


    private async getCallInfo(incomingNumber: string){
        try {  
            const callPartyInfo = await this.callInfoService.searchFirstIncomingIdByNumber(incomingNumber.trim());
            return await this.callInfoService.searchCallInfo(callPartyInfo.id);
        }catch(e){
            this.logger.error(e, this.serviceContext);
        }
    }
}


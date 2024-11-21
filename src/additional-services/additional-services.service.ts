import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ExtensionForwardDto } from './dto/extension-forward.dto';
import { MailForwardDto } from './dto/mail-forward.dto';
import { QueueStatusDto } from './dto/queue-status.dto';
import { LoggerService } from '@app/logger/logger.service';
import { ExtensionForwardData, ExtensionForwardStatus, ExtensionsPbx, ServicesTypeToActionTypeMap } from './interfaces/additional-services.interface';
import { ForwardStatus, QueueStatus, ServicesType } from './interfaces/additional-services.enum';
import { UtilsService } from '@app/utils/utils.service';
import { Pbx3cxForwardStatusService } from '@app/pbx3cx/pbx3cx-forward-status.service';
import { EXTENSION_NOT_FOUND, FORWARD_TYPE_RULE_TO_FW_TYPE, FWPROFILE_NOT_FOUND } from './additional-services.constants';
import { Dn, Extension, Fwdprofile } from '@app/pbx3cx/entities';
import { ForwardType } from '@app/pbx3cx/types/pbx3cx.enum';
import { AdditionalModelService, ExtensionForwardService } from './services';
import { ActionType } from '@app/selenoid/interfaces/selenoid.enum';
import { MailCheckForwardResult } from '@app/selenoid/providers/mail/mail.interfaces';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AdditionalServicesService implements OnModuleInit {

    private serviceContext: string;
    private extensionsPbxService: ExtensionsPbx;

    constructor(
        private readonly additionalModelService: AdditionalModelService,
        private readonly selenoid: SelenoidProvider,
        private readonly logger: LoggerService,
        private readonly pbxForward: Pbx3cxForwardStatusService,
        private readonly extensionForward: ExtensionForwardService,
        @Inject('EXTENSION') private client: ClientGrpc
    ) {
        this.serviceContext = AdditionalServicesService.name;
    }

    onModuleInit() {

        this.extensionsPbxService = this.client.getService<ExtensionsPbx>('ExtensionsPbxService');
    }

    public async changeQueueStatus(data: QueueStatusDto): Promise<void> {

        await this.additionalModelService.create({ ...data, service: ServicesType.queue });

        const qStatus = (data.status) ? QueueStatus.LoggedIn : QueueStatus.LoggedOut;

        await firstValueFrom(
            this.extensionsPbxService.SetExtensionGlobalQueuesStatus( { extension: data.exten,  status: qStatus } ).pipe(
                catchError((error: any) => {
                    throw error;
                }),
            ),
        )
    }

    public async changeExtensionForward(data: ExtensionForwardDto): Promise<void> {
        
        await this.additionalModelService.create({ ...data, service: ServicesType.extension });

        const { exten, number, status, type } = data;

        if (UtilsService.isDateNow(data.dateFrom)){

            if(status){

                await this.setExtensionCallForwardStatus(data);

            } else {

                await this.setExtensionForwardAvailable(exten);

            }
        }
    }
    
    public async setExtensionCallForwardStatus(data: ExtensionForwardData){

        await firstValueFrom(
            this.extensionsPbxService.SetExtensionCallForwardStatus( { 
                extension: data.exten, 
                fwStatus: ForwardStatus.BusinessTrip,
                callType: "",
                fwType: FORWARD_TYPE_RULE_TO_FW_TYPE[data.type],
                number: data.number, 
            } ).pipe(
                catchError((error: any) => {
                    throw error;
                }),
            ),
        )

    }
    public async setExtensionForwardAvailable(exten: string){

        await firstValueFrom(
            this.extensionsPbxService.SetExtensionForwardStatus( { 
                extension: exten, 
                status: ForwardStatus.Available
            } ).pipe(
                catchError((error: any) => {
                    throw error;
                }),
            ),
        )   
    } 


    public async changeMailForward(data: MailForwardDto): Promise<void> {
        try {

            await this.additionalModelService.create({ ...data, service: ServicesType.mail });

        
            if (UtilsService.isDateNow(data.dateFrom)){
    
                await this.selenoid.action(ServicesTypeToActionTypeMap[ServicesType.mail], data);
    
            }

        }catch(e){

            this.logger.error(e, this.serviceContext);

            throw e;
        }
       
    }

    public async getExtenForwardStatus(exten: string): Promise<ExtensionForwardStatus> {
        try {

            const dn = await this.pbxForward.getExtenId(exten);

            if (dn == null) throw EXTENSION_NOT_FOUND;

            const extension = await this.pbxForward.getExtensionInfo(dn.iddn);

            const mobile = (await this.pbxForward.getCurrentExtenMobile(dn.iddn)).value;

            if (await this.isExtenStatusAvailable(extension)) return { isForwardEnable: false };

            return await this.getCurrentForwardInfo(await this.getForwardInfo(dn, extension), mobile);

        } catch (e) {

            throw e;

        }
    }

    public async getCurrentMailForward(email: string): Promise<MailCheckForwardResult> {
        try {

            return (await this.selenoid.action(ActionType.mailCheckForward, { email })) as MailCheckForwardResult;

        } catch (e) {

            throw e;

        }
    }

    private async getCurrentForwardInfo(currentForwardInfo: Fwdprofile, mobile: string): Promise<ExtensionForwardStatus> {
        return {
            isForwardEnable: true,
            ...(await this.extensionForward.getLocalExtensionForward(currentForwardInfo, mobile)),
        };
    }

    private async getForwardInfo(dn: Dn, extension: Extension): Promise<Fwdprofile> {

        const currentProfiles = await this.pbxForward.getExtenProfiles(dn.iddn);

        if (!currentProfiles.some((fwdprofile: Fwdprofile) => {
                return fwdprofile.idfwdprofile === extension.currentprofile;
            })
        ) throw FWPROFILE_NOT_FOUND;

        return currentProfiles.filter((fwdprofile: Fwdprofile) => {
            return fwdprofile.idfwdprofile === extension.currentprofile;
        })[0];

    }

    private async isExtenStatusAvailable(extension: Extension): Promise<boolean> {

        const currentProf = await this.pbxForward.getExtenCurrentProfile(extension.currentprofile);

        return currentProf.profilename == ForwardType.available;

    }

}

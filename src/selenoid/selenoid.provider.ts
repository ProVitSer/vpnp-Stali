import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ExtensionForward } from './providers/extensionForward';
import { MailForward } from './providers/mailForward';
import { QueueStatus } from './providers/queueStatus';
import { SelenoidDataTypes, SelenoidProviderInterface } from './types/interfaces';
import { ActionType } from './types/types';


@Injectable()
export class SeleniumProvider {
    private serviceContext: string;
    constructor(
        private readonly logger: LoggerService,
        private readonly queueStatus: QueueStatus,
        private readonly extensionForward: ExtensionForward,
        private readonly mailForward: MailForward
    ) {
        this.serviceContext = SeleniumProvider.name;
    }


    get providers(): any {
        return {
            [ActionType.mailForward]: this.mailForward,
            [ActionType.extensionForward]: this.extensionForward,
            [ActionType.queueStatus]: this.queueStatus,            
        };
    }


    public async change(action: ActionType , data: SelenoidDataTypes){
        try {
            const provider = this.getProvider(action);
            return await provider.selenoidChange(data);
        }catch(e){
            this.logger.error(e, this.serviceContext);
            throw e;
        }
    }

    private getProvider(action: ActionType): SelenoidProviderInterface {
        return this.providers[action];
    }

}

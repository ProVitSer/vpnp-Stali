import { MailForwardData } from '@app/selenoid/interfaces/interface';
import { ActionType } from '@app/selenoid/interfaces/types';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { MailForwardDto } from './dto/mailForward.dto';

@Injectable()
export class AdvancedService {
  constructor(private readonly selenoid: SelenoidProvider) {}

  public async changeMailForward(data: MailForwardDto) {
    await this.selenoid.change(ActionType.mailForward, data as MailForwardData);
  }
}

// import { Forward, Mail } from '@app/database/mongo/schemas';
// import { Change } from '@app/database/mongo/services/change';
// import { ChangeBackData } from '@app/database/mongo/types/interfaces';
// import { CollectionType } from '@app/database/mongo/types/type';
// import { LoggerService } from '@app/logger/logger.service';
// import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
// import { SelenoidDataTypes } from '@app/selenoid/interfaces/interfaces';
// import { ActionType } from '@app/selenoid/interfaces/types';
// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';

// const CollectionTypeActionTypeMap: { [coll in CollectionType]?: ActionType } = {
//   [CollectionType.forward]: ActionType.extensionForward,
//   [CollectionType.mail]: ActionType.mailForward,
// };

// @Injectable()
// export class ChangeForwardScheduleService {
//   private serviceContext: string;

//   constructor(
//     private readonly logger: LoggerService,
//     private readonly changeInfoData: Change,
//     private readonly selenoid: SelenoidProvider,
//   ) {
//     this.serviceContext = ChangeForwardScheduleService.name;
//   }

//   @Cron(CronExpression.EVERY_DAY_AT_1AM)
//   async startChange() {
//     try {
//       const changeData = await this.changeInfoData.getSetForwardData();
//       console.log(changeData);
//       await Promise.all(
//         changeData.map(async (changeData: ChangeBackData) => {
//           await this.change(changeData.type, changeData.data, 'true');
//         }),
//       );
//     } catch (e) {
//       this.logger.error(e, this.serviceContext);
//     }
//   }

//   @Cron(CronExpression.EVERY_DAY_AT_2AM)
//   async startSet() {
//     try {
//       const changeData = await this.changeInfoData.getChangeBackData();
//       await Promise.all(
//         changeData.map(async (changeData: ChangeBackData) => {
//           await this.change(changeData.type, changeData.data, 'false');
//         }),
//       );
//     } catch (e) {
//       this.logger.error(e, this.serviceContext);
//     }
//   }

//   private async change(type: CollectionType, changeData: Array<Mail | Forward>, status: string) {
//     try {
//       return await Promise.all(
//         changeData.map(async (data: Mail | Forward) => {
//           this.logger.info(data, this.serviceContext);
//           data.status = status;
//           await this.selenoid.change(CollectionTypeActionTypeMap[type], data as SelenoidDataTypes);
//           await this.changeInfoData.setUpdate({ type, id: data._id, field: { change: true } });
//         }),
//       );
//     } catch (e) {
//       throw e;
//     }
//   }
// }

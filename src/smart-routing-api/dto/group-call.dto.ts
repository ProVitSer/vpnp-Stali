import { IsNotEmpty, IsString } from 'class-validator';

export class GroupCallDto {
  @IsString()
  @IsNotEmpty()
  incomingNumber: string;

  @IsString()
  @IsNotEmpty()
  unicueid: string;
}

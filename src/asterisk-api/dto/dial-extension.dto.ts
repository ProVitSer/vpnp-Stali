import { IsNotEmpty, IsString } from 'class-validator';

export class DialExtensionDto {
  @IsString()
  @IsNotEmpty()
  incomingNumber: string;

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsString()
  @IsNotEmpty()
  extension: string;

  @IsString()
  @IsNotEmpty()
  unicueid: string;
}

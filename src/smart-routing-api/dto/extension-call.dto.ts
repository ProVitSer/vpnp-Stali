import { IsNotEmpty, IsString } from 'class-validator';

export class ExtensionCallDto {
  @IsString()
  @IsNotEmpty()
  incomingNumber: string;

  @IsString()
  @IsNotEmpty()
  extension: string;

  @IsString()
  @IsNotEmpty()
  unicueid: string;
}

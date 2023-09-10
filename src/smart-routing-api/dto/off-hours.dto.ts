import { IsNotEmpty, IsString } from 'class-validator';

export class OffHoursDto {
  @IsString()
  @IsNotEmpty()
  incomingNumber: string;

  @IsString()
  @IsNotEmpty()
  dialExtension: string;
}

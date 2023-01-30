import { IsOptional, IsString } from 'class-validator';

export class RemoteDeleteDto {
  @IsString()
  @IsOptional()
  remoteId?: string;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;
}

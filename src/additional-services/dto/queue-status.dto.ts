import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueueStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле exten не может быть пустым' })
  exten: string;

  @IsOptional()
  dateFrom?: string;

  @IsNotEmpty({ message: 'Поле status не может быть пустым' })
  @Transform(({ value }) => Boolean(JSON.parse(value)))
  status: boolean;
}

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueueDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле exten не может быть пустым' })
  exten: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле status не может быть пустым' })
  @Transform(({ value }) => (value === 'true' ? true : false))
  status: boolean;
}

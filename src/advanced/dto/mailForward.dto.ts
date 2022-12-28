import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class MailForwardDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле from не может быть пустым' })
  from: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле to не может быть пустым' })
  to: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateFrom не может быть пустым' })
  dateFrom: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateTo не может быть пустым' })
  dateTo: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле status не может быть пустым' })
  @Transform(({ value }) => (value === 'true' ? true : false))
  status: boolean;
}

import { UtilsService } from '@app/utils/utils.service';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RemoteActivateDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле user не может быть пустым' })
  user: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле mobile не может быть пустым' })
  @Transform(({ value }) => UtilsService.formatNumberToE164(value))
  mobile: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateFrom не может быть пустым' })
  dateFrom: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateTo не может быть пустым' })
  dateTo: string;
}

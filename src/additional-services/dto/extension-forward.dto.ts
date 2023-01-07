import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ExtensionForwardRuleType } from '../interfaces/additional-services.enum';

export class ExtensionForwardDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле exten не может быть пустым' })
  exten: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле type не может быть пустым' })
  @IsEnum(ExtensionForwardRuleType, { message: 'Поле type должно быть одним из значений mobile/external/extension ' })
  type: ExtensionForwardRuleType;

  @IsString()
  @IsNotEmpty({ message: 'Поле number не может быть пустым' })
  number: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateFrom не может быть пустым' })
  dateFrom: string;

  @IsString()
  @IsNotEmpty({ message: 'Поле dateTo не может быть пустым' })
  dateTo: string;

  @IsNotEmpty({ message: 'Поле status не может быть пустым' })
  @Transform(({ value }) => Boolean(JSON.parse(value)))
  status: boolean;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class RemoteDeactivateDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле user не может быть пустым' })
  user: string;
}

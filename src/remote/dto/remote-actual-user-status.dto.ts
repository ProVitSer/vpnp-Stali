import { IsNotEmpty, IsString } from 'class-validator';

export class RemoteActualUserStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Поле user не может быть пустым' })
  user: string;
}

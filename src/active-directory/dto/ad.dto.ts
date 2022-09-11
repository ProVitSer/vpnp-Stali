import { IsNotEmpty, IsString } from 'class-validator';

export class ADDto  {
    @IsString()
    @IsNotEmpty({message: "Поле user не может быть пустым"})
    user: string;
    
    @IsString()
    @IsNotEmpty({message: "Поле group не может быть пустым"})
    group: string;

    @IsString()
    @IsNotEmpty({message: "Поле dateTo не может быть пустым"})
    dateTo: string;
}
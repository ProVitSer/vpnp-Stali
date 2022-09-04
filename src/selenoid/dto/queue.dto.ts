import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { QueueStatus } from "../types/types";

export class Queue  {
    @IsString()
    @IsNotEmpty({message: "Поле exten не может быть пустым"})
    exten: string;

    @IsString()
    @IsNotEmpty({message: "Поле status не может быть пустым"})
    @IsEnum(QueueStatus, {message: "Поле status должно быть одним из значений true/false "} )
    status: QueueStatus;
}
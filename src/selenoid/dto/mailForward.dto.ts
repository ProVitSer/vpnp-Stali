import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ChangeExtensionForward, ChangeMailForwardForward, ExtensionForwardRuleType, QueueStatus } from "../types/types";

export class MailForward  {
    @IsString()
    @IsNotEmpty({message: "Поле from не может быть пустым"})
    from: string;

    @IsString()
    @IsNotEmpty({message: "Поле to не может быть пустым"})
    to: string;
    
    @IsString()
    @IsNotEmpty({message: "Поле dateFrom не может быть пустым"})
    dateFrom: string;

    @IsString()
    @IsNotEmpty({message: "Поле dateTo не может быть пустым"})
    dateTo: string;

    @IsString()
    @IsNotEmpty({message: "Поле status не может быть пустым"})
    @IsEnum(ChangeMailForwardForward, {message: "Поле status должно быть одним из значений true/false "} )
    status: ChangeMailForwardForward;
}


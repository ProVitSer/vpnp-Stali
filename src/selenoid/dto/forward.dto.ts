import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ChangeExtensionForward, ExtensionForwardRuleType, QueueStatus } from "../types/types";

export class Forward  {
    @IsString()
    @IsNotEmpty({message: "Поле exten не может быть пустым"})
    exten: string;

    @IsString()
    @IsNotEmpty({message: "Поле type не может быть пустым"})
    @IsEnum(ExtensionForwardRuleType, {message: "Поле type должно быть одним из значений mobile/external/extension "} )
    type: ExtensionForwardRuleType;

    @IsString()
    @IsNotEmpty({message: "Поле number не может быть пустым"})
    number: string;
    
    @IsString()
    @IsNotEmpty({message: "Поле dateFrom не может быть пустым"})
    dateFrom: string;

    @IsString()
    @IsNotEmpty({message: "Поле dateTo не может быть пустым"})
    dateTo: string;

    @IsString()
    @IsNotEmpty({message: "Поле status не может быть пустым"})
    @IsEnum(ChangeExtensionForward, {message: "Поле status должно быть одним из значений true/false "} )
    status: ChangeExtensionForward;
}


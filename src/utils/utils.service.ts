import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {

    static formatNumber(number: string): string{
        return (number.length == 10) ? `8${number}` : number.replace("7", "8").replace(/\D+/g, "");
    }
}
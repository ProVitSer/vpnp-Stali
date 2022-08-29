import { Injectable } from "@nestjs/common";
import { Soap1cProviderInterface } from "../types/interface";

@Injectable()
export class SetId implements Soap1cProviderInterface {
    async getRequestData(requestData: any): Promise<any> {

    }
}
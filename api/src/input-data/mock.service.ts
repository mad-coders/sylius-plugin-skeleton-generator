import { Injectable} from "@nestjs/common";
import {InputData} from "./interface";

@Injectable()
export class InputDataMockService implements InputData
{
    namespace(): string {
        return 'Madcoders';
    }

    pluginNameCamel(): string {
        return 'SyliusMyPlugin';
    }

}

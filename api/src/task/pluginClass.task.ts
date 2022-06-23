import { Injectable, Inject } from '@nestjs/common';
import {Task} from "./task.interface";
import {InputData} from "../input-data/interface";
import {TaskContext} from "./task.context";

@Injectable()
export class PluginClassTask implements Task
{
    constructor(@Inject('input.data.service') private readonly inputData: InputData) {}

    run(context: TaskContext): void {
        if (!context.entryName.match(/AcmeSyliusExamplePlugin\.php$/)) {
            return;
        }

        const replacement = `${this.inputData.namespace()}${this.inputData.pluginNameCamel()}`;

        context.contents = context.contents.replace(/class AcmeSyliusExamplePlugin/, `class ${replacement}`);
        context.entryName = context.entryName.replace('AcmeSyliusExamplePlugin.php', `${replacement}.php`)
    }
}

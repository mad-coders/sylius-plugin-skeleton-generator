import { Injectable, Inject } from '@nestjs/common';
import {Task} from "./task.interface";
import {InputData} from "../input-data/interface";
import {TaskContext} from "./task.context";

@Injectable()
export class UpdateNamespacesTask implements Task
{
    constructor(@Inject('input.data.service') private readonly inputData: InputData) {}

    run(context: TaskContext): void {
        if (!context.entryName.match(/\.(?:php|yaml|yml|xml|md|twig)$/)) {
            return;
        }

        const updatedNamespace = `${this.inputData.namespace()}\\${this.inputData.pluginNameCamel()}`;

        context.contents = context.contents.replace(/namespace Acme\\SyliusExamplePlugin/, `namespace ${updatedNamespace}`);
        context.contents = context.contents.replace(/use Acme\\SyliusExamplePlugin/, `use ${updatedNamespace}`);
        context.contents = context.contents.replace(/namespace Test\\Acme\\SyliusExamplePlugin/, `namespace Test\\${updatedNamespace}`);
        context.contents = context.contents.replace(/use Test\\Acme\\SyliusExamplePlugin/, `use Test\\${updatedNamespace}`);
    }
}

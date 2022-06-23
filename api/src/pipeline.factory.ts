import {Injectable} from '@nestjs/common';
import {Task} from "./task/task.interface";
import {UpdateNamespacesTask} from "./task/updateNamespaces.task";
import {PluginClassTask} from "./task/pluginClass.task";

@Injectable()
export class PipelineFactory {
    constructor(
        private readonly updateNamespacesTask: UpdateNamespacesTask,
        private readonly pluginClassTask: PluginClassTask
    ) {}

    create(): Task[] {
        return [
            this.updateNamespacesTask,
            this.pluginClassTask,
        ]
    }
}

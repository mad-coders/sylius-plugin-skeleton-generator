import { Injectable } from '@nestjs/common';
import {PipelineFactory} from "./pipeline.factory";
import {TaskContext} from "./task/task.context";
import {JobContext} from "./job.context";

@Injectable()
export class ProcessorsPipeline
{
    constructor(private readonly pipelineFactory: PipelineFactory) {}

    process(entryName: string, contents: string): TaskContext {
        const pipelineRunnables = this.pipelineFactory.create();
        const taskContext = new TaskContext(contents, entryName, new JobContext());
        pipelineRunnables.forEach((runnable) => {
            runnable.run(taskContext);
        });

        return taskContext;
    }
}

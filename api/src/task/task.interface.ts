import {TaskContext} from "./task.context";

export interface Task
{
    run(context: TaskContext): void
}

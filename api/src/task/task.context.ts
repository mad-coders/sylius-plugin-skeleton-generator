import {JobContext} from "../job.context";

export class TaskContext {
    constructor(
        private _contents: string,
        private _entryName: string,
        private _jobContext: JobContext
    ) {}

    public get contents(): string
    {
        return this._contents;
    }

    public set contents(contents: string)
    {
        this._contents = contents;
    }

    public get entryName(): string
    {
        return this._entryName;
    }

    public set entryName(entryName: string)
    {
        this._entryName = entryName;
    }

    public get jobContext(): JobContext
    {
        return this._jobContext;
    }
}

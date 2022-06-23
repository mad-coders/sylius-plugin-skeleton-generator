import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProcessorService} from "./processor.service";
import {ProcessorsPipeline} from "./processorsPipeline.service";
import {PipelineFactory} from "./pipeline.factory";
import {InputDataServiceProvider} from "./input-data/provider";
import {UpdateNamespacesTask} from "./task/updateNamespaces.task";
import {PluginClassTask} from "./task/pluginClass.task";


@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        ProcessorService,
        ProcessorsPipeline,
        PipelineFactory,
        InputDataServiceProvider,
        UpdateNamespacesTask,
        PluginClassTask,
    ],
})
export class AppModule {
}

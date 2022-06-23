import {Test, TestingModule} from '@nestjs/testing';
import {MockInputDataServiceProvider} from "../input-data/mock.provider";
import {TaskContext} from "./task.context";
import {JobContext} from "../job.context";
import {PluginClassTask} from "./pluginClass.task";

describe('PluginClassTask', () => {
    let pluginClassTask: PluginClassTask;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [MockInputDataServiceProvider, PluginClassTask],
        }).compile();

        pluginClassTask = app.get<PluginClassTask>(PluginClassTask);
    });

    describe('Update plugin class', () => {
        it('it renames AcmeSyliusExamplePlugin class MadcodersSyliusMyPlugin', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/AcmeSyliusExamplePlugin.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Acme\\SyliusExamplePlugin;',
                '',
                'class AcmeSyliusExamplePlugin extends Bundle',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            pluginClassTask.run(taskContext);

            expect(taskContext.contents).toMatch(/class MadcodersSyliusMyPlugin/);
        });

        it('it renames AcmeSyliusExamplePlugin.php file MadcodersSyliusMyPlugin.php', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/AcmeSyliusExamplePlugin.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Acme\\SyliusExamplePlugin;',
                '',
                'class AcmeSyliusExamplePlugin extends Bundle',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            pluginClassTask.run(taskContext);

            expect(taskContext.entryName).toBe('PluginSkeleton-1.11.0/src/MadcodersSyliusMyPlugin.php');
        });
    });
});

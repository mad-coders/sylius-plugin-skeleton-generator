import {Test, TestingModule} from '@nestjs/testing';
import {UpdateNamespacesTask} from "./updateNamespaces.task";
import {MockInputDataServiceProvider} from "../input-data/mock.provider";
import {TaskContext} from "./task.context";
import {JobContext} from "../job.context";

describe('UpdateNamespacesTask', () => {
    let updateNamespacesTask: UpdateNamespacesTask;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [MockInputDataServiceProvider, UpdateNamespacesTask],
        }).compile();

        updateNamespacesTask = app.get<UpdateNamespacesTask>(UpdateNamespacesTask);
    });

    describe('update plugin namespace', () => {
        it('it replaces "Acme\\SyliusExamplePlugin" namespace with "Madcoders\\SyliusMyPlugin" in .php files', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/Controller/GreetingController.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Acme\\SyliusExamplePlugin\\Controller;',
                '',
                'use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;',
                'use Symfony\\Component\\HttpFoundation\\Response;',
                'use Acme\\SyliusExamplePlugin\\ServiceName;',
                '',
                'final class GreetingController extends AbstractController',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            updateNamespacesTask.run(taskContext);

            expect(taskContext.contents).toMatch(/namespace Madcoders\\SyliusMyPlugin\\Controller;/);
        });

        it('it does not touch uknown file types', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/Controller/GreetingController.unknown';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Acme\\SyliusExamplePlugin\\Controller;',
                '',
                'use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;',
                'use Symfony\\Component\\HttpFoundation\\Response;',
                'use Acme\\SyliusExamplePlugin\\ServiceName;',
                '',
                'final class GreetingController extends AbstractController',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            updateNamespacesTask.run(taskContext);

            expect(taskContext.contents).toBe(testContent);
        });
    });

    describe('update plugin use statement', () => {
        it('it replaces "Acme\\SyliusExamplePlugin" use statement with "Madcoders\\SyliusMyPlugin" in .php files', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/Controller/GreetingController.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Acme\\SyliusExamplePlugin\\Controller;',
                '',
                'use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;',
                'use Symfony\\Component\\HttpFoundation\\Response;',
                'use Acme\\SyliusExamplePlugin\\ServiceName;',
                '',
                'final class GreetingController extends AbstractController',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            updateNamespacesTask.run(taskContext);

            expect(taskContext.contents).toMatch(/use Madcoders\\SyliusMyPlugin\\ServiceName;/);
        });
    });

    describe('update plugin test namespace', () => {
        it('it replaces "Test\\Acme\\SyliusExamplePlugin" namespace with "Test\\Madcoders\\SyliusMyPlugin" in .php files', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/Controller/GreetingController.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Test\\Acme\\SyliusExamplePlugin\\Controller;',
                '',
                'use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;',
                'use Symfony\\Component\\HttpFoundation\\Response;',
                'use Test\\Acme\\SyliusExamplePlugin\\ServiceName;',
                '',
                'final class GreetingController extends AbstractController',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            updateNamespacesTask.run(taskContext);

            expect(taskContext.contents).toMatch(/namespace Test\\Madcoders\\SyliusMyPlugin\\Controller;/);
        });
    });

    describe('update plugin test use statements', () => {
        it('it replaces "Test\\Acme\\SyliusExamplePlugin" in use statements with "Test\\Madcoders\\SyliusMyPlugin" in .php files', () => {
            const testPath = 'PluginSkeleton-1.11.0/src/Controller/GreetingController.php';
            const testContent = [
                '<?php',
                '',
                'declare(strict_types=1);',
                '',
                'namespace Test\\Acme\\SyliusExamplePlugin\\Controller;',
                '',
                'use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;',
                'use Symfony\\Component\\HttpFoundation\\Response;',
                'use Test\\Acme\\SyliusExamplePlugin\\ServiceName;',
                '',
                'final class GreetingController extends AbstractController',
                '{',
                '}',
            ].join("\n");

            const taskContext = new TaskContext(testContent, testPath, new JobContext());
            updateNamespacesTask.run(taskContext);

            expect(taskContext.contents).toMatch(/use Test\\Madcoders\\SyliusMyPlugin\\ServiceName;/);
        });
    });
});

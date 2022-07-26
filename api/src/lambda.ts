import * as express from 'express';
import * as serverless from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Context, Handler } from 'aws-lambda';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import {INestApplication, Logger} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {GlobalExceptionFilter} from "./global-exception-filter";

let cachedServer;

function bootstrapServer(): Promise<Server> {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    // create nest application
    const app = NestFactory.create(AppModule, adapter);

    // add event context
    app.then((app: INestApplication) => app.use(eventContext()));

    // error handling
    app.then(app => {
        app.useGlobalFilters(new GlobalExceptionFilter());
        app.use(bodyParser.json({
            verify: (req: any, res, buf) => { req.rawBody = buf; },
        }));

        return app;
    });

    // configure CORS policy
    app.then(app => app.enableCors({
        origin: '*', // TODO: #27 Define CORS policy https://github.com/mad-coders/sylius-plugin-skeleton-generator/issues/27
    }));

    // initialize application
    app.then((app: INestApplication) => app.init());

    return app.then(() => serverless.createServer(expressApp));
}

export const handler: Handler = (event: any, context: Context) => {
    try {
        if (!cachedServer) {
            bootstrapServer()
                .then(server => {
                    cachedServer = server;
                    return serverless.proxy(server, event, context);
                });
        } else {
            return serverless.proxy(cachedServer, event, context);
        }
    } catch (err) {
        Logger.log(err);
        throw new Error(err);
    }
};

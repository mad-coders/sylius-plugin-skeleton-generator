import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Inject } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor() {}

    public catch(exception: Error, host: ArgumentsHost) {
        if (exception instanceof HttpException) {
            this.handleHttpException(exception, host);
        } else {
            this.handleOtherException(exception, host);
        }
    }

    private handleHttpException(exception: HttpException, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const error = {
            statusCode: status,
            message: exception.message,
            error: exception.name,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        console.error(`Code: ${error.statusCode}; Path: ${error.path}; Error: ${error.error}; Message: ${error.message}; Timestamp: ${error.timestamp}`); //tslint:disable

        response
            .status(status)
            .json(error);
    }

    private handleOtherException(exception: Error, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const error = {
            statusCode: 500,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: exception.name,
            stack: exception.stack,
        }

        console.error(`Code: ${error.statusCode}; Path: ${error.path}; Error: ${error.error}; Message: ${error.message}; Timestamp: ${error.timestamp}; Stack: ${error.stack}`)

        response
            .status(error.statusCode)
            .json(error);
    }
}

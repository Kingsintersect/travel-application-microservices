// app.controller.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ApplicationException } from '../custom.exception';

@Catch(ApplicationException)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: ApplicationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });
    }
}

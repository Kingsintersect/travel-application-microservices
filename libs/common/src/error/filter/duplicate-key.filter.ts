import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class DuplicateKeyFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = 400; // Bad Request

        if (exception.code === 11000 && exception.keyPattern.email) {
            response.status(status).json({
                statusCode: status,
                message: 'Email address is already in use.',
            });
        } else {
            // If the error is not related to duplicate key, rethrow it
            throw exception;
        }
    }
}

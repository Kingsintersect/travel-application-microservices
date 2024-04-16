import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private configService: ConfigService) { }

    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();

        if (exception.status === HttpStatus.INTERNAL_SERVER_ERROR && exception.message.includes('Config validation error')) {
            // Handle configuration validation error
            const errorMessage = 'Configuration error. Please check your environment variables.';
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: errorMessage,
            });
        } else {
            // Handle other errors
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            });
        }
    }
}

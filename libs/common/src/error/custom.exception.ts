// user-exists.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
    constructor(message: string = 'Error From your code or from Your fetch data') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

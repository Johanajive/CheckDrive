import { ArgumentsHost, ExceptionFilter,Catch, HttpException, HttpStatus } from "@nestjs/common";
import path from "path";

// Generamos exepciones personalizadas
@Catch() 
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        // Respuesta del error
        const request = ctx.getRequest();
        // Estado del error
        const status = exception instanceof HttpException 
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
        ? exception.getResponse()
        : exception;

        response.status(status).json({
            success: false,
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            message
        })
    }

}
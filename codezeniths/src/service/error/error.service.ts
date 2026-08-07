import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { logger } from '@codezeniths/service/logging';
import { AppError, AppErrorBuilder } from './error';
import { ErrorCode } from './error.types';

export class ErrorHandlerService {
    /**
     * Normalize any error to a standard AppError instance.
     */
    public static normalize(error: unknown): AppError {
        if (error instanceof AppError) {
            return error;
        }

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return new AppErrorBuilder('Validation failed')
                .setCode(ErrorCode.VALIDATION_ERROR)
                .setMetadata({ issues: error.issues })
                .setOperational(true)
                .build();
        }

        // Handle Prisma DB errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return this.handlePrismaClientKnownRequestError(error);
        }
        if (error instanceof Prisma.PrismaClientValidationError) {
            return new AppErrorBuilder('Database validation failed')
                .setCode(ErrorCode.BAD_REQUEST)
                .setCause(error)
                .setOperational(true)
                .build();
        }

        // Handle tRPC Server errors
        if (error instanceof TRPCError) {
            const mappedCode = this.mapTRPCCodeToErrorCode(error.code);
            return new AppErrorBuilder(error.message)
                .setCode(mappedCode)
                .setStatus(this.getHTTPStatusCodeForTRPC(error.code))
                .setOperational(true)
                .build();
        }

        // Handle generic javascript Error
        if (error instanceof Error) {
            return new AppErrorBuilder(error.message)
                .setCode(ErrorCode.INTERNAL_SERVER_ERROR)
                .setCause(error)
                .setOperational(false) // Generic uncaught errors are usually bugs
                .build();
        }

        // Handle unknown primitives
        return new AppErrorBuilder(String(error || 'An unexpected error occurred'))
            .setCode(ErrorCode.INTERNAL_SERVER_ERROR)
            .setOperational(false)
            .build();
    }

    /**
     * Log and handle the normalized error.
     */
    public static handle(error: unknown, context?: Record<string, unknown>): AppError {
        const appError = this.normalize(error);
        const logContext = {
            code: appError.code,
            statusCode: appError.statusCode,
            isOperational: appError.isOperational,
            ...appError.metadata,
            ...context,
        };

        if (appError.isOperational) {
            logger.warn(appError.message, logContext);
        } else {
            logger.error(appError.message, appError, logContext);
        }

        return appError;
    }

    private static handlePrismaClientKnownRequestError(
        error: Prisma.PrismaClientKnownRequestError
    ): AppError {
        const builder = new AppErrorBuilder('Database operation failed')
            .setCode(ErrorCode.DB_ERROR)
            .setCause(error)
            .setSingleMeta('prismaCode', error.code);

        // Map Prisma common error codes
        switch (error.code) {
            case 'P2002': // Unique constraint violation
                builder
                    .setMessage(`Record already exists. Unique constraint failed on fields: ${String(error.meta?.target || '')}`)
                    .setCode(ErrorCode.CONFLICT)
                    .setOperational(true);
                break;
            case 'P2025': // Record not found
                builder
                    .setMessage('The requested record could not be found.')
                    .setCode(ErrorCode.NOT_FOUND)
                    .setOperational(true);
                break;
            case 'P2003': // Foreign key constraint violation
                builder
                    .setMessage('Foreign key constraint failed.')
                    .setCode(ErrorCode.BAD_REQUEST)
                    .setOperational(true);
                break;
            default:
                builder.setOperational(false); // Unknown DB issues are system faults
                break;
        }

        return builder.build();
    }

    private static mapTRPCCodeToErrorCode(code: TRPCError['code']): ErrorCode {
        switch (code) {
            case 'BAD_REQUEST':
                return ErrorCode.BAD_REQUEST;
            case 'UNAUTHORIZED':
                return ErrorCode.UNAUTHORIZED;
            case 'FORBIDDEN':
                return ErrorCode.FORBIDDEN;
            case 'NOT_FOUND':
                return ErrorCode.NOT_FOUND;
            case 'CONFLICT':
                return ErrorCode.CONFLICT;
            case 'TIMEOUT':
                return ErrorCode.TIMEOUT;
            default:
                return ErrorCode.INTERNAL_SERVER_ERROR;
        }
    }

    private static getHTTPStatusCodeForTRPC(code: TRPCError['code']): number {
        switch (code) {
            case 'BAD_REQUEST': return 400;
            case 'UNAUTHORIZED': return 401;
            case 'FORBIDDEN': return 403;
            case 'NOT_FOUND': return 404;
            case 'CONFLICT': return 409;
            case 'TIMEOUT': return 504;
            default: return 500;
        }
    }
}

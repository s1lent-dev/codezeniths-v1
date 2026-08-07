import pino from 'pino';
import type { Logger, LoggerOptions } from 'pino';
import type { ILoggerService, LogContext } from './logging.types.js';

export class LoggingService implements ILoggerService {
    private readonly logger: Logger;

    constructor(customLogger?: Logger) {
        if (customLogger) {
            this.logger = customLogger;
            return;
        }

        const isDevelopment = process.env.NODE_ENV !== 'production';
        const defaultLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

        const options: LoggerOptions = {
            level: defaultLevel,
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'password',
                    'token',
                    'secret',
                    'confirmPassword',
                ],
                censor: '[REDACTED]',
            },
            serializers: {
                err: pino.stdSerializers.err,
                error: pino.stdSerializers.err,
            },
        };

        if (isDevelopment) {
            options.transport = {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            };
        }

        this.logger = pino(options);
    }

    trace(message: string, context?: LogContext): void {
        if (context) {
            this.logger.trace(context, message);
        } else {
            this.logger.trace(message);
        }
    }

    debug(message: string, context?: LogContext): void {
        if (context) {
            this.logger.debug(context, message);
        } else {
            this.logger.debug(message);
        }
    }

    info(message: string, context?: LogContext): void {
        if (context) {
            this.logger.info(context, message);
        } else {
            this.logger.info(message);
        }
    }

    warn(message: string, context?: LogContext): void {
        if (context) {
            this.logger.warn(context, message);
        } else {
            this.logger.warn(message);
        }
    }

    error(message: string, error?: Error | unknown, context?: LogContext): void {
        if (error === undefined) {
            if (context) {
                this.logger.error(context, message);
            } else {
                this.logger.error(message);
            }
            return;
        }

        const errObj = error instanceof Error ? error : new Error(String(error));
        this.logger.error({ err: errObj, ...context }, message);
    }

    fatal(message: string, error?: Error | unknown, context?: LogContext): void {
        if (error === undefined) {
            if (context) {
                this.logger.fatal(context, message);
            } else {
                this.logger.fatal(message);
            }
            return;
        }

        const errObj = error instanceof Error ? error : new Error(String(error));
        this.logger.fatal({ err: errObj, ...context }, message);
    }

    child(context: LogContext): ILoggerService {
        return new LoggingService(this.logger.child(context));
    }
}

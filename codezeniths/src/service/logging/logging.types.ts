export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext extends Record<string, unknown> {
    service?: string;
    module?: string;
    userId?: string;
    requestId?: string;
}

export interface ILoggerService {
    trace(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | unknown, context?: LogContext): void;
    fatal(message: string, error?: Error | unknown, context?: LogContext): void;
    child(context: LogContext): ILoggerService;
}

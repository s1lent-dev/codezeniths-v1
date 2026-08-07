import type {
    MessageContext,
    BackoffStrategy,
    ConsumerMiddleware
} from '../shared/mq.types';
import { logger } from '@/service/logging';
import { messageRegistry } from '../shared/mq.registry';
import type { MessageRegistry, PayloadOf } from '../shared/mq.registry';

/**
 * Middleware composition helper (standard Koa-style compose function).
 */
export function composeMiddlewares<T>(
    middlewares: Array<ConsumerMiddleware<T>>,
    handler: (payload: T, context: MessageContext) => Promise<void> | void
): (payload: T, context: MessageContext) => Promise<void> {
    return (payload: T, context: MessageContext) => {
        let index = -1;
        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) throw new Error('next() called multiple times');
            index = i;
            if (i === middlewares.length) {
                await handler(payload, context);
                return;
            }
            const middleware = middlewares[i];
            await middleware(payload, context, () => dispatch(i + 1));
        };
        return dispatch(0);
    };
}

/**
 * Default Logging middleware.
 */
export function withLogging<T>(queueName: string): ConsumerMiddleware<T> {
    return async (payload, context, next) => {
        logger.info(`[mq:consumer:${queueName}] Processing message`, { messageId: context.properties.messageId });
        try {
            await next();
            logger.info(`[mq:consumer:${queueName}] Message processed successfully`, { messageId: context.properties.messageId });
        } catch (err) {
            logger.error(`[mq:consumer:${queueName}] Message processing failed`, err, { messageId: context.properties.messageId });
            throw err;
        }
    };
}

/**
 * Default Validation middleware using Zod message schemas.
 */
export function withValidation<K extends keyof MessageRegistry>(
    messageKey: K
): ConsumerMiddleware<PayloadOf<K>> {
    return async (payload, context, next) => {
        const schema = messageRegistry[messageKey];
        const result = schema.safeParse(payload);
        if (!result.success) {
            logger.error(
                `[mq:validation] Schema validation failed for message key "${String(messageKey)}"`,
                result.error
            );
            context.reject(false);
            return;
        }
        await next();
    };
}

/**
 * Default Retry & backoff middleware.
 */
export function withRetry<T>(
    queueName: string,
    backoffStrategy: BackoffStrategy,
    maxRetries: number
): ConsumerMiddleware<T> {
    return async (payload, context, next) => {
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                await next();
                return;
            } catch (err) {
                attempt++;
                if (attempt > maxRetries) {
                    logger.error(
                        `[mq:retry:${queueName}] Message handler failed after ${maxRetries} attempts. Escalating.`,
                        err
                    );
                    throw err;
                }
                const delay = backoffStrategy.getDelay(attempt);
                logger.warn(
                    `[mq:retry:${queueName}] Handler failed. Retrying attempt ${attempt} in ${delay}ms...`,
                    { error: err }
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    };
}

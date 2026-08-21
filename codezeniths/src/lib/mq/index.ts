/**
 * @file index.ts
 * @description Central export surface for CodeZeniths Message Queue infrastructure.
 */

export { mqConnectionManager } from './core/mq.connection';
export type { IRestartableConsumer } from './core/mq.connection';
export { bootstrapTopology, assertTopology } from './core/mq.topology';
export { Producer, createProducer } from './core/mq.producer';
export { Consumer, createConsumer } from './core/mq.consumer';
export type { ConsumerOptions } from './core/mq.consumer';
export { JsonSerializer, defaultMqSerializer, MqError, MqConnectionError, MqValidationError, MqPublishError, FixedBackoffStrategy, ExponentialBackoffStrategy } from './shared/mq.utils';
export type { PublishOptions, MessageContext, Serializer, BackoffStrategy, ConsumerMiddleware, MiddlewareNext, Message, ConsumeMessage, Channel, ConfirmChannel, ExchangeType } from './shared/mq.types';
export { composeMiddlewares, withLogging, withValidation, withRetry } from './core/mq.middleware';
export { MqExchange, MqQueue, MqRoutingKey } from './shared/mq.types';
export { messageRegistry } from './shared/mq.registry';
export type { MessageRegistry, PayloadOf } from './shared/mq.registry';
export { initMq } from './core/mq.bootstrap';

// ── 6 Domain Event Producers ──
export { authProducer, AuthProducer } from './producers/auth.producer';
export { paymentProducer, PaymentProducer } from './producers/payment.producer';
export { progressProducer, ProgressProducer } from './producers/progress.producer';
export { socialProducer, SocialProducer } from './producers/social.producer';
export { notificationProducer, NotificationProducer } from './producers/notification.producer';
export { searchProducer, SearchProducer } from './producers/search.producer';

// ── 6 Domain Consumer Starters ──
export { startAuthConsumers } from './consumers/auth.consumer';
export { startPaymentConsumers } from './consumers/payment.consumer';
export { startProgressConsumers } from './consumers/progress.consumer';
export { startSocialConsumers } from './consumers/social.consumer';
export { startNotificationConsumers } from './consumers/notification.consumer';
export { startSearchConsumers } from './consumers/search.consumer';

/**
 * @file notification.producer.ts
 * @description Producer for system broadcasts, direct in-app alerts, and push notifications.
 */

import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class NotificationProducer {
    private readonly inAppProducer = createProducer('notification.inapp', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIFICATION_INAPP,
    });

    private readonly pushProducer = createProducer('notification.push', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIFICATION_PUSH,
    });

    private readonly adminBroadcastProducer = createProducer('notification.admin_broadcast', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIFICATION_ADMIN_BROADCAST,
    });

    private readonly loginProducer = createProducer('notification.user_login', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIFICATION_USER_LOGIN,
    });

    private readonly newDeviceProducer = createProducer('notification.new_device', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIFICATION_NEW_DEVICE,
    });

    /**
     * Publishes a direct or global in-app notification.
     */
    async publishInApp(payload: PayloadOf<'notification.inapp'>): Promise<void> {
        await this.inAppProducer.publish(payload);
    }

    /**
     * Publishes a push notification.
     */
    async publishPush(payload: PayloadOf<'notification.push'>): Promise<void> {
        await this.pushProducer.publish(payload);
    }

    /**
     * Publishes an admin announcement across in-app, push, and email.
     */
    async broadcastAdmin(payload: PayloadOf<'notification.admin_broadcast'>): Promise<void> {
        await this.adminBroadcastProducer.publish(payload);
    }

    /**
     * Publishes a user login notification event.
     */
    async notifyLogin(payload: PayloadOf<'notification.user_login'>): Promise<void> {
        await this.loginProducer.publish(payload);
    }

    /**
     * Publishes a new device login notification event.
     */
    async notifyNewDevice(payload: PayloadOf<'notification.new_device'>): Promise<void> {
        await this.newDeviceProducer.publish(payload);
    }
}

export const notificationProducer = new NotificationProducer();

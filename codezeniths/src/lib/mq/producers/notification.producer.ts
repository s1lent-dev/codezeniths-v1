import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class NotificationProducer {
    private readonly loginProducer = createProducer('notification.user_login', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIF_USER_LOGIN,
    });

    private readonly newDeviceProducer = createProducer('notification.new_device', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIF_NEW_DEVICE,
    });

    private readonly adminBroadcastProducer = createProducer('notification.admin_broadcast', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIF_ADMIN_BROADCAST,
    });

    private readonly paymentFailedProducer = createProducer('payment.failed', {
        exchange: MqExchange.NOTIFICATION,
        routingKey: MqRoutingKey.NOTIF_PAYMENT_FAILED,
    });

    /** JSDoc: Triggered on user login. Targets exchange notification.fanout via routing key user.login. */
    async notifyLogin(payload: PayloadOf<'notification.user_login'>): Promise<void> {
        await this.loginProducer.publish(payload);
    }

    /** JSDoc: Triggered when user logs in from a new device/IP. Targets exchange notification.fanout via routing key user.new_device_login. */
    async notifyNewDevice(payload: PayloadOf<'notification.new_device'>): Promise<void> {
        await this.newDeviceProducer.publish(payload);
    }

    /** JSDoc: Triggered when an admin broadcasts an announcement. Targets exchange notification.fanout via routing key admin.broadcast. */
    async broadcastAdmin(payload: PayloadOf<'notification.admin_broadcast'>): Promise<void> {
        await this.adminBroadcastProducer.publish(payload);
    }

    /** JSDoc: Triggered when a payment attempt fails. Targets exchange notification.fanout via routing key payment.failed. */
    async notifyPaymentFailed(payload: PayloadOf<'payment.failed'>): Promise<void> {
        await this.paymentFailedProducer.publish(payload);
    }
}

export const notificationProducer = new NotificationProducer();

import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class AuthProducer {
    private readonly welcomeEmailProducer = createProducer('auth.email.welcome', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_WELCOME,
    });

    private readonly verifyEmailProducer = createProducer('auth.email.verify', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_VERIFY,
    });

    private readonly otpEmailProducer = createProducer('auth.email.otp', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_OTP,
    });

    private readonly magicLinkEmailProducer = createProducer('auth.email.magic_link', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_MAGIC_LINK,
    });

    private readonly resetPasswordEmailProducer = createProducer('auth.email.reset_password', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_RESET_PASSWORD,
    });

    private readonly newDeviceEmailProducer = createProducer('auth.email.new_device', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_NEW_DEVICE,
    });

    private readonly oauthLoginEmailProducer = createProducer('auth.email.oauth_login', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_OAUTH_LOGIN,
    });

    private readonly passwordChangedEmailProducer = createProducer('auth.email.password_changed', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_PASSWORD_CHANGED,
    });

    private readonly sessionRevokedEmailProducer = createProducer('auth.email.session_revoked', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_SESSION_REVOKED,
    });

    private readonly accountDeactivatedEmailProducer = createProducer('auth.email.account_deactivated', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_ACCOUNT_DEACTIVATED,
    });

    private readonly accountReactivatedEmailProducer = createProducer('auth.email.account_reactivated', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_ACCOUNT_REACTIVATED,
    });

    private readonly otpSmsProducer = createProducer('auth.sms.otp', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_SMS_OTP,
    });

    private readonly magicLinkSmsProducer = createProducer('auth.sms.magic_link', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_SMS_MAGIC_LINK,
    });

    private readonly newDeviceSmsProducer = createProducer('auth.sms.new_device', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_SMS_NEW_DEVICE,
    });

    private readonly accountLockedSmsProducer = createProducer('auth.sms.account_locked', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_SMS_ACCOUNT_LOCKED,
    });

    private readonly passwordlessCredentialsEmailProducer = createProducer('auth.email.passwordless_credentials', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_EMAIL_PASSWORDLESS_CREDENTIALS,
    });

    private readonly passwordlessCredentialsSmsProducer = createProducer('auth.sms.passwordless_credentials', {
        exchange: MqExchange.AUTH,
        routingKey: MqRoutingKey.AUTH_SMS_PASSWORDLESS_CREDENTIALS,
    });


    /** JSDoc: Triggered when a new user signs up. Targets exchange auth.direct via routing key auth.email.welcome. */
    async sendWelcomeEmail(payload: PayloadOf<'auth.email.welcome'>): Promise<void> {
        // TODO: Prepare welcome email template data and publish to RabbitMQ welcome email queue.
        await this.welcomeEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when an email verification link is requested. Targets exchange auth.direct via routing key auth.email.verify. */
    async sendVerifyEmail(payload: PayloadOf<'auth.email.verify'>): Promise<void> {
        // TODO: Publish email verification link task payload to RabbitMQ verification email queue.
        await this.verifyEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when email OTP login code is requested. Targets exchange auth.direct via routing key auth.email.otp. */
    async sendOtpEmail(payload: PayloadOf<'auth.email.otp'>): Promise<void> {
        // TODO: Publish email OTP task payload to RabbitMQ OTP email queue.
        await this.otpEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when email magic link is requested. Targets exchange auth.direct via routing key auth.email.magic_link. */
    async sendMagicLinkEmail(payload: PayloadOf<'auth.email.magic_link'>): Promise<void> {
        // TODO: Publish magic link task payload to RabbitMQ magic link email queue.
        await this.magicLinkEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when password reset link is requested. Targets exchange auth.direct via routing key auth.email.reset_password. */
    async sendResetPasswordEmail(payload: PayloadOf<'auth.email.reset_password'>): Promise<void> {
        // TODO: Publish password reset token/link payload to RabbitMQ password reset email queue.
        await this.resetPasswordEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when user logs in from a new device/IP. Targets exchange auth.direct via routing key auth.email.new_device. */
    async sendNewDeviceEmail(payload: PayloadOf<'auth.email.new_device'>): Promise<void> {
        // TODO: Publish security notification of new login device email to RabbitMQ new device email queue.
        await this.newDeviceEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when a user links/logs in via OAuth. Targets exchange auth.direct via routing key auth.email.oauth_login. */
    async sendOauthLoginEmail(payload: PayloadOf<'auth.email.oauth_login'>): Promise<void> {
        // TODO: Publish OAuth login confirmation event payload to RabbitMQ OAuth email queue.
        await this.oauthLoginEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when a user updates their password. Targets exchange auth.direct via routing key auth.email.password_changed. */
    async sendPasswordChangedEmail(payload: PayloadOf<'auth.email.password_changed'>): Promise<void> {
        // TODO: Publish password update warning email event to RabbitMQ password changed email queue.
        await this.passwordChangedEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when a user session is revoked. Targets exchange auth.direct via routing key auth.email.session_revoked. */
    async sendSessionRevokedEmail(payload: PayloadOf<'auth.email.session_revoked'>): Promise<void> {
        // TODO: Publish session termination event notification email to RabbitMQ session revoked email queue.
        await this.sessionRevokedEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when an account is deactivated. Targets exchange auth.direct via routing key auth.email.account_deactivated. */
    async sendAccountDeactivatedEmail(payload: PayloadOf<'auth.email.account_deactivated'>): Promise<void> {
        // TODO: Publish account deactivation notification email payload to RabbitMQ deactivated queue.
        await this.accountDeactivatedEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when a deactivated account is reactivated. Targets exchange auth.direct via routing key auth.email.account_reactivated. */
    async sendAccountReactivatedEmail(payload: PayloadOf<'auth.email.account_reactivated'>): Promise<void> {
        // TODO: Publish account reactivation notification email payload to RabbitMQ reactivated queue.
        await this.accountReactivatedEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered when SMS OTP is requested. Targets exchange auth.direct via routing key auth.sms.otp. */
    async sendOtpSms(payload: PayloadOf<'auth.sms.otp'>): Promise<void> {
        // TODO: Publish SMS OTP code event payload to RabbitMQ SMS OTP queue.
        await this.otpSmsProducer.publish(payload);
    }

    /** JSDoc: Triggered when SMS magic link is requested. Targets exchange auth.direct via routing key auth.sms.magic_link. */
    async sendMagicLinkSms(payload: PayloadOf<'auth.sms.magic_link'>): Promise<void> {
        // TODO: Publish SMS magic link link event payload to RabbitMQ SMS magic link queue.
        await this.magicLinkSmsProducer.publish(payload);
    }

    /** JSDoc: Triggered when new device alert is sent via SMS. Targets exchange auth.direct via routing key auth.sms.new_device. */
    async sendNewDeviceSms(payload: PayloadOf<'auth.sms.new_device'>): Promise<void> {
        // TODO: Publish SMS device warning event payload to RabbitMQ SMS new device queue.
        await this.newDeviceSmsProducer.publish(payload);
    }

    /** JSDoc: Triggered when an account is locked due to security thresholds. Targets exchange auth.direct via routing key auth.sms.account_locked. */
    async sendAccountLockedSms(payload: PayloadOf<'auth.sms.account_locked'>): Promise<void> {
        // TODO: Publish SMS lockout security warning event payload to RabbitMQ SMS locked queue.
        await this.accountLockedSmsProducer.publish(payload);
    }

    /** JSDoc: Triggered to send passwordless credentials via email. Targets exchange auth.direct via routing key auth.email.passwordless_credentials. */
    async sendPasswordlessCredentialsEmail(payload: PayloadOf<'auth.email.passwordless_credentials'>): Promise<void> {
        await this.passwordlessCredentialsEmailProducer.publish(payload);
    }

    /** JSDoc: Triggered to send passwordless credentials via SMS. Targets exchange auth.direct via routing key auth.sms.passwordless_credentials. */
    async sendPasswordlessCredentialsSms(payload: PayloadOf<'auth.sms.passwordless_credentials'>): Promise<void> {
        await this.passwordlessCredentialsSmsProducer.publish(payload);
    }
}

export const authProducer = new AuthProducer();

import * as React from 'react';
import * as templates from './index';
import { MailTemplate } from '../mail.types';

/**
 * Factory class to instantiate React Email components using the MailTemplate enum.
 */
export class EmailComponentFactory {
  /**
   * Resolves the template component mapping and instantiates it with typed props.
   */
  public static create(template: MailTemplate, props: Record<string, any>): React.ReactElement {
    switch (template) {
      case MailTemplate.WELCOME:
        return <templates.WelcomeEmail name={props.name} />;
      
      case MailTemplate.VERIFY:
        return <templates.VerifyEmail name={props.name} verifyUrl={props.verifyUrl} token={props.token} />;
      
      case MailTemplate.OTP:
        return <templates.OtpEmail name={props.name} code={props.code} expiryMinutes={props.expiryMinutes} />;
      
      case MailTemplate.MAGIC_LINK:
        return <templates.MagicLinkEmail name={props.name} loginUrl={props.loginUrl} />;
      
      case MailTemplate.RESET_PASSWORD:
        return <templates.ResetPasswordEmail name={props.name} resetUrl={props.resetUrl} expiryMinutes={props.expiryMinutes} />;
      
      case MailTemplate.NEW_DEVICE:
        return <templates.NewDeviceEmail name={props.name} deviceName={props.deviceName} location={props.location} time={props.time} />;
      
      case MailTemplate.OAUTH_LOGIN:
        return <templates.OauthLoginEmail name={props.name} provider={props.provider} />;
      
      case MailTemplate.PASSWORD_CHANGED:
        return <templates.PasswordChangedEmail name={props.name} />;
      
      case MailTemplate.SESSION_REVOKED:
        return <templates.SessionRevokedEmail name={props.name} deviceName={props.deviceName} location={props.location} />;
      
      case MailTemplate.ACCOUNT_DEACTIVATED:
        return <templates.AccountDeactivatedEmail name={props.name} />;
      
      case MailTemplate.ACCOUNT_REACTIVATED:
        return <templates.AccountReactivatedEmail name={props.name} />;
      
      case MailTemplate.WEEKLY_DIGEST:
        return <templates.WeeklyDigestEmail name={props.name} summaryUrl={props.summaryUrl} />;
      
      case MailTemplate.STREAK_MILESTONE:
        return <templates.StreakMilestoneEmail name={props.name} streakCount={props.streakCount} />;
      
      case MailTemplate.SUBSCRIPTION_CONFIRMED:
        return <templates.SubscriptionConfirmedEmail name={props.name} planName={props.planName} price={props.price} nextBillingDate={props.nextBillingDate} />;
      
      case MailTemplate.SUBSCRIPTION_CANCELLED:
        return <templates.SubscriptionCancelledEmail name={props.name} planName={props.planName} expiryDate={props.expiryDate} />;
      
      case MailTemplate.PAYMENT_FAILED:
        return <templates.PaymentFailedEmail name={props.name} planName={props.planName} amount={props.amount} retryLink={props.retryLink} />;
      
      case MailTemplate.PAYMENT_RECEIPT:
        return <templates.PaymentReceiptEmail name={props.name} receiptId={props.receiptId} amount={props.amount} date={props.date} />;
      
      case MailTemplate.ADMIN_BROADCAST:
        return <templates.AdminBroadcastEmail title={props.title} message={props.message} />;

      case MailTemplate.PASSWORDLESS_CREDENTIALS:
        return <templates.PasswordlessCredentialsEmail name={props.name} password={props.password} />;
      
      default:
        throw new Error(`Unsupported email template: ${template}`);
    }
  }
}

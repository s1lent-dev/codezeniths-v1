/**
 * @file factory.tsx
 * @description Factory class to instantiate React Email components using the MailTemplate enum.
 */

import * as React from 'react';
import * as templates from './index';
import { MailTemplate } from '../mail.types';

export class EmailComponentFactory {
  /**
   * Resolves the template component mapping and instantiates it with typed props.
   */
  public static create(template: MailTemplate, props: Record<string, any>): React.ReactElement {
    switch (template) {
      // ── Auth Templates ──
      case MailTemplate.WELCOME:
        return <templates.WelcomeEmail name={props.name} theme={props.theme} />;
      
      case MailTemplate.VERIFY:
        return (
          <templates.VerifyEmail
            name={props.name}
            verifyUrl={props.verifyUrl}
            token={props.token}
            theme={props.theme}
          />
        );
      
      case MailTemplate.OTP:
        return (
          <templates.OtpEmail
            name={props.name}
            code={props.code}
            expiryMinutes={props.expiryMinutes}
            theme={props.theme}
          />
        );
      
      case MailTemplate.MAGIC_LINK:
        return (
          <templates.MagicLinkEmail
            name={props.name}
            loginUrl={props.loginUrl}
            theme={props.theme}
          />
        );
      
      case MailTemplate.RESET_PASSWORD:
        return (
          <templates.ResetPasswordEmail
            name={props.name}
            code={props.code}
            resetUrl={props.resetUrl}
            expiryMinutes={props.expiryMinutes}
            theme={props.theme}
          />
        );
      
      case MailTemplate.NEW_DEVICE:
        return (
          <templates.NewDeviceEmail
            name={props.name}
            deviceName={props.deviceName}
            location={props.location}
            time={props.time}
            theme={props.theme}
          />
        );
      
      case MailTemplate.OAUTH_LOGIN:
        return (
          <templates.OauthLoginEmail
            name={props.name}
            provider={props.provider}
            theme={props.theme}
          />
        );
      
      case MailTemplate.PASSWORD_CHANGED:
        return <templates.PasswordChangedEmail name={props.name} theme={props.theme} />;
      
      case MailTemplate.SESSION_REVOKED:
        return (
          <templates.SessionRevokedEmail
            name={props.name}
            deviceName={props.deviceName}
            location={props.location}
            theme={props.theme}
          />
        );
      
      case MailTemplate.ACCOUNT_DEACTIVATED:
        return <templates.AccountDeactivatedEmail name={props.name} theme={props.theme} />;
      
      case MailTemplate.ACCOUNT_REACTIVATED:
        return <templates.AccountReactivatedEmail name={props.name} theme={props.theme} />;
      
      case MailTemplate.PASSWORDLESS_CREDENTIALS:
        return (
          <templates.PasswordlessCredentialsEmail
            name={props.name}
            password={props.password}
            username={props.username}
            theme={props.theme}
          />
        );

      // ── Progress Templates ──
      case MailTemplate.STREAK_MILESTONE:
        return (
          <templates.StreakMilestoneEmail
            name={props.name}
            streakCount={props.streakCount}
            theme={props.theme}
          />
        );

      case MailTemplate.WEEKLY_DIGEST:
        return (
          <templates.WeeklyDigestEmail
            name={props.name}
            summaryUrl={props.summaryUrl}
            theme={props.theme}
          />
        );

      // ── Payment Templates ──
      case MailTemplate.SUBSCRIPTION_CONFIRMED:
        return (
          <templates.SubscriptionConfirmedEmail
            name={props.name}
            planName={props.planName}
            price={props.price}
            nextBillingDate={props.nextBillingDate}
            theme={props.theme}
          />
        );

      case MailTemplate.SUBSCRIPTION_RENEWED:
        return (
          <templates.SubscriptionRenewedEmail
            name={props.name}
            planName={props.planName}
            amount={props.amount}
            nextBillingDate={props.nextBillingDate}
            theme={props.theme}
          />
        );

      case MailTemplate.SUBSCRIPTION_CANCELLED:
        return (
          <templates.SubscriptionCancelledEmail
            name={props.name}
            planName={props.planName}
            expiryDate={props.expiryDate}
            theme={props.theme}
          />
        );

      case MailTemplate.SUBSCRIPTION_EXPIRED:
        return (
          <templates.SubscriptionExpiredEmail
            name={props.name}
            planName={props.planName}
            theme={props.theme}
          />
        );

      case MailTemplate.PAYMENT_RECEIPT:
        return (
          <templates.PaymentReceiptEmail
            name={props.name}
            receiptId={props.receiptId}
            amount={props.amount}
            date={props.date}
            theme={props.theme}
          />
        );

      case MailTemplate.PAYMENT_FAILED:
        return (
          <templates.PaymentFailedEmail
            name={props.name}
            planName={props.planName}
            amount={props.amount}
            retryLink={props.retryLink}
            theme={props.theme}
          />
        );

      case MailTemplate.PAYMENT_REFUND:
        return (
          <templates.PaymentRefundEmail
            name={props.name}
            amount={props.amount}
            paymentIntentId={props.paymentIntentId}
            theme={props.theme}
          />
        );

      // ── Notification Templates ──
      case MailTemplate.ADMIN_BROADCAST:
        return (
          <templates.AdminBroadcastEmail
            title={props.title}
            message={props.message}
            name={props.name}
            actionUrl={props.actionUrl}
            actionText={props.actionText}
            theme={props.theme}
          />
        );

      case MailTemplate.CONTACT_INQUIRY:
        return (
          <templates.ContactInquiryEmail
            name={props.name}
            email={props.email}
            subject={props.subject}
            phone={props.phone}
            message={props.message}
            submittedAt={props.submittedAt}
            isRegisteredUser={props.isRegisteredUser}
            theme={props.theme}
          />
        );

      case MailTemplate.CONTACT_CONFIRMATION:
        return (
          <templates.ContactConfirmationEmail
            name={props.name}
            subject={props.subject}
            message={props.message}
            submittedAt={props.submittedAt}
            theme={props.theme}
          />
        );

      default:
        throw new Error(`Unsupported email template: ${template}`);
    }
  }
}

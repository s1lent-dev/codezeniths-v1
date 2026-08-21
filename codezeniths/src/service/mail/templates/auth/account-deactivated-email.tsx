/**
 * @file account-deactivated-email.tsx
 * @description Account deactivation confirmation email template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailCallout, EmailButton } from '../../components';

export interface AccountDeactivatedEmailProps {
  name?: string;
  theme?: 'dark' | 'light';
}

export const AccountDeactivatedEmail: React.FC<AccountDeactivatedEmailProps> = ({
  name = 'Alex Rivera',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title="Your Account Has Been Deactivated"
      previewText="CodeZeniths account deactivation notice."
      categoryBadge="Account Notice"
      badgeVariant="danger"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Your CodeZeniths account has been successfully deactivated as requested. Your public profile and active learning streaks are now paused.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info">
        Want to come back? You can reactivate your account at any time simply by signing in with your existing credentials.
      </EmailCallout>

      <EmailButton href={`${appUrl}/sign-in`} isDark={isDark} variant="primary">
        Reactivate My Account
      </EmailButton>
    </EmailLayout>
  );
};

export default AccountDeactivatedEmail;

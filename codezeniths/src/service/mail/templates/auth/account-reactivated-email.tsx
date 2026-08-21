/**
 * @file account-reactivated-email.tsx
 * @description Account reactivation welcome-back email template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailCallout, EmailButton } from '../../components';

export interface AccountReactivatedEmailProps {
  name?: string;
  theme?: 'dark' | 'light';
}

export const AccountReactivatedEmail: React.FC<AccountReactivatedEmailProps> = ({
  name = 'Alex Rivera',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title="Welcome Back! Account Reactivated 🎉"
      previewText="Your CodeZeniths account has been successfully reactivated."
      categoryBadge="Account Restored"
      badgeVariant="success"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Welcome back to CodeZeniths! Your account has been reactivated and all your problem-solving statistics, roadmaps, and custom playlists have been restored.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="success">
        Ready to resume your streak? Dive back into today's featured challenges and community leaderboards.
      </EmailCallout>

      <EmailButton href={`${appUrl}/problemset`} isDark={isDark} variant="primary">
        Go to Problemset
      </EmailButton>
    </EmailLayout>
  );
};

export default AccountReactivatedEmail;

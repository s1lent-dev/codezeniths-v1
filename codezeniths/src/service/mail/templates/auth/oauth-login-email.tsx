/**
 * @file oauth-login-email.tsx
 * @description Notification when user signs in via an OAuth provider.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailCallout, EmailButton } from '../../components';

export interface OauthLoginEmailProps {
  name?: string;
  provider?: string;
  theme?: 'dark' | 'light';
}

export const OauthLoginEmail: React.FC<OauthLoginEmailProps> = ({
  name = 'Alex Rivera',
  provider = 'GitHub',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title={`OAuth Login via ${provider}`}
      previewText={`Your CodeZeniths account was logged into via ${provider}.`}
      categoryBadge="Authentication"
      badgeVariant="primary"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        We noticed a successful login to your CodeZeniths account using <strong>{provider}</strong> authentication.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info">
        If you initiated this login, you're all set! If you suspect unauthorized access, please review your linked accounts and active sessions.
      </EmailCallout>

      <EmailButton href={`${appUrl}/settings`} isDark={isDark} variant="secondary">
        Manage Linked Accounts
      </EmailButton>
    </EmailLayout>
  );
};

export default OauthLoginEmail;

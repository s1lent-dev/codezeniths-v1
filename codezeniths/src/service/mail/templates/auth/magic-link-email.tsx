/**
 * @file magic-link-email.tsx
 * @description Passwordless Magic Link login email template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface MagicLinkEmailProps {
  name?: string;
  loginUrl?: string;
  theme?: 'dark' | 'light';
}

export const MagicLinkEmail: React.FC<MagicLinkEmailProps> = ({
  name = 'Alex Rivera',
  loginUrl = 'https://codezeniths.com/magic-login?token=mag_776104bc',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  return (
    <EmailLayout
      title="Your Magic Sign-In Link"
      previewText="Click to log in instantly to your CodeZeniths account."
      categoryBadge="Passwordless Login"
      badgeVariant="purple"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Click the button below to sign in directly to your CodeZeniths account without entering a password:
      </EmailParagraph>

      <EmailButton href={loginUrl} isDark={isDark} variant="primary">
        Sign In to CodeZeniths
      </EmailButton>

      <EmailCallout isDark={isDark} variant="warning" title="Security & Validity:">
        This link is single-use and will expire in <strong className={isDark ? 'text-white' : 'text-heading-light'}>15 minutes</strong>. If you did not request this login link, you can safely ignore this message.
      </EmailCallout>
    </EmailLayout>
  );
};

export default MagicLinkEmail;

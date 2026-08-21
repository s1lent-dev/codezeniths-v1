/**
 * @file otp-email.tsx
 * @description One-Time Password (OTP) verification template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailCodeBox, EmailCallout } from '../../components';

export interface OtpEmailProps {
  name?: string;
  code?: string;
  expiryMinutes?: number;
  theme?: 'dark' | 'light';
}

export const OtpEmail: React.FC<OtpEmailProps> = ({
  name = 'Alex Rivera',
  code = '849201',
  expiryMinutes = 10,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  return (
    <EmailLayout
      title="Your One-Time Password (OTP)"
      previewText={`Your CodeZeniths verification code is ${code}`}
      categoryBadge="Authentication"
      badgeVariant="primary"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Use the following one-time verification code to proceed with your authentication request:
      </EmailParagraph>

      <EmailCodeBox
        code={code}
        isDark={isDark}
        subtext={`Valid for ${expiryMinutes} minutes • Never share this code with anyone`}
      />

      <EmailCallout isDark={isDark} variant="danger" title="Security Warning:">
        CodeZeniths representatives will <strong className={isDark ? 'text-white' : 'text-heading-light'}>never</strong> ask for your verification code. If you did not request this OTP, please secure your account immediately.
      </EmailCallout>
    </EmailLayout>
  );
};

export default OtpEmail;

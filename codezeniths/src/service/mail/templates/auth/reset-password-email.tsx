/**
 * @file reset-password-email.tsx
 * @description Password reset OTP code and direct link delivery template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCodeBox, EmailCallout } from '../../components';

export interface ResetPasswordEmailProps {
  name?: string;
  code?: string;
  resetUrl?: string;
  expiryMinutes?: number;
  theme?: 'dark' | 'light';
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  name = 'Alex Rivera',
  code = '849201',
  resetUrl = 'http://localhost:3000/reset-password',
  expiryMinutes = 10,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  return (
    <EmailLayout
      title="Reset Your Password"
      previewText={code ? `Your password reset code is ${code}` : 'Instructions to reset your CodeZeniths password.'}
      categoryBadge="Account Security"
      badgeVariant="danger"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        We received a request to reset your password. You can complete the reset using the 6-digit verification code below, or by clicking the direct reset link:
      </EmailParagraph>

      {code && (
        <EmailCodeBox
          code={code}
          isDark={isDark}
          subtext={`Valid for ${expiryMinutes} minutes • Enter this code on the verification screen`}
        />
      )}

      {resetUrl && (
        <EmailButton href={resetUrl} isDark={isDark} variant="primary">
          Reset Password via Link
        </EmailButton>
      )}

      <EmailCallout isDark={isDark} variant="danger" title="Security Notice:">
        This verification code and reset link are valid for <strong className={isDark ? 'text-white' : 'text-heading-light'}>{expiryMinutes} minutes</strong>. If you did not request a password reset, please ignore this email or review your account activity.
      </EmailCallout>
    </EmailLayout>
  );
};

export default ResetPasswordEmail;

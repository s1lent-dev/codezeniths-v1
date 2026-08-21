import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  WelcomeEmail,
  VerifyEmail,
  OtpEmail,
  MagicLinkEmail,
  ResetPasswordEmail,
  NewDeviceEmail,
  OauthLoginEmail,
  PasswordChangedEmail,
  SessionRevokedEmail,
  AccountDeactivatedEmail,
  AccountReactivatedEmail,
  PasswordlessCredentialsEmail,
} from './index';

const meta: Meta = {
  title: 'Emails/Auth & Security',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// 1. Welcome Email
export const WelcomeDark: StoryObj = {
  render: () => <WelcomeEmail name="Alex Rivera" theme="dark" />,
};

export const WelcomeLight: StoryObj = {
  render: () => <WelcomeEmail name="Alex Rivera" theme="light" />,
};

// 2. Verify Email
export const VerifyDark: StoryObj = {
  render: () => (
    <VerifyEmail
      name="Alex Rivera"
      verifyUrl="https://codezeniths.com/verify-email?token=xyz123"
      theme="dark"
    />
  ),
};

export const VerifyLight: StoryObj = {
  render: () => (
    <VerifyEmail
      name="Alex Rivera"
      verifyUrl="https://codezeniths.com/verify-email?token=xyz123"
      theme="light"
    />
  ),
};

// 3. OTP Email
export const OtpDark: StoryObj = {
  render: () => <OtpEmail name="Alex Rivera" code="849201" expiryMinutes={10} theme="dark" />,
};

export const OtpLight: StoryObj = {
  render: () => <OtpEmail name="Alex Rivera" code="849201" expiryMinutes={10} theme="light" />,
};

// 4. Magic Link
export const MagicLinkDark: StoryObj = {
  render: () => (
    <MagicLinkEmail
      name="Alex Rivera"
      loginUrl="https://codezeniths.com/magic-login?token=mag_776104bc"
      theme="dark"
    />
  ),
};

export const MagicLinkLight: StoryObj = {
  render: () => (
    <MagicLinkEmail
      name="Alex Rivera"
      loginUrl="https://codezeniths.com/magic-login?token=mag_776104bc"
      theme="light"
    />
  ),
};

// 5. Reset Password
export const ResetPasswordDark: StoryObj = {
  render: () => (
    <ResetPasswordEmail
      name="Alex Rivera"
      code="849201"
      resetUrl="http://localhost:3000/reset-password?token=rst_552199ac"
      expiryMinutes={60}
      theme="dark"
    />
  ),
};

export const ResetPasswordLight: StoryObj = {
  render: () => (
    <ResetPasswordEmail
      name="Alex Rivera"
      code="849201"
      resetUrl="http://localhost:3000/reset-password?token=rst_552199ac"
      expiryMinutes={60}
      theme="light"
    />
  ),
};

// 6. New Device Login
export const NewDeviceDark: StoryObj = {
  render: () => (
    <NewDeviceEmail
      name="Alex Rivera"
      deviceName='MacBook Pro 16" (macOS 15.2, Chrome 124)'
      location="San Francisco, CA, USA (IP: 192.0.2.1)"
      time="Aug 19, 2026, 01:05 AM"
      theme="dark"
    />
  ),
};

export const NewDeviceLight: StoryObj = {
  render: () => (
    <NewDeviceEmail
      name="Alex Rivera"
      deviceName='MacBook Pro 16" (macOS 15.2, Chrome 124)'
      location="San Francisco, CA, USA (IP: 192.0.2.1)"
      time="Aug 19, 2026, 01:05 AM"
      theme="light"
    />
  ),
};

// 7. OAuth Login
export const OauthLoginDark: StoryObj = {
  render: () => <OauthLoginEmail name="Alex Rivera" provider="GitHub" theme="dark" />,
};

export const OauthLoginLight: StoryObj = {
  render: () => <OauthLoginEmail name="Alex Rivera" provider="GitHub" theme="light" />,
};

// 8. Password Changed
export const PasswordChangedDark: StoryObj = {
  render: () => <PasswordChangedEmail name="Alex Rivera" theme="dark" />,
};

export const PasswordChangedLight: StoryObj = {
  render: () => <PasswordChangedEmail name="Alex Rivera" theme="light" />,
};

// 9. Session Revoked
export const SessionRevokedDark: StoryObj = {
  render: () => (
    <SessionRevokedEmail
      name="Alex Rivera"
      deviceName="iPhone 15 Pro (Safari Mobile)"
      location="New York, NY, USA"
      theme="dark"
    />
  ),
};

export const SessionRevokedLight: StoryObj = {
  render: () => (
    <SessionRevokedEmail
      name="Alex Rivera"
      deviceName="iPhone 15 Pro (Safari Mobile)"
      location="New York, NY, USA"
      theme="light"
    />
  ),
};

// 10. Account Deactivated
export const AccountDeactivatedDark: StoryObj = {
  render: () => <AccountDeactivatedEmail name="Alex Rivera" theme="dark" />,
};

export const AccountDeactivatedLight: StoryObj = {
  render: () => <AccountDeactivatedEmail name="Alex Rivera" theme="light" />,
};

// 11. Account Reactivated
export const AccountReactivatedDark: StoryObj = {
  render: () => <AccountReactivatedEmail name="Alex Rivera" theme="dark" />,
};

export const AccountReactivatedLight: StoryObj = {
  render: () => <AccountReactivatedEmail name="Alex Rivera" theme="light" />,
};

// 12. Passwordless Credentials
export const PasswordlessCredentialsDark: StoryObj = {
  render: () => (
    <PasswordlessCredentialsEmail
      name="Alex Rivera"
      username="alex_zenith"
      password="cz_sec_9938!@#"
      theme="dark"
    />
  ),
};

export const PasswordlessCredentialsLight: StoryObj = {
  render: () => (
    <PasswordlessCredentialsEmail
      name="Alex Rivera"
      username="alex_zenith"
      password="cz_sec_9938!@#"
      theme="light"
    />
  ),
};

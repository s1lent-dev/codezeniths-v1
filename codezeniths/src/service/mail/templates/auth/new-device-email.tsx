/**
 * @file new-device-email.tsx
 * @description Security alert template for new device/location login.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface NewDeviceEmailProps {
  name?: string;
  deviceName?: string;
  location?: string;
  time?: string;
  theme?: 'dark' | 'light';
}

export const NewDeviceEmail: React.FC<NewDeviceEmailProps> = ({
  name = 'Alex Rivera',
  deviceName = 'MacBook Pro 16" (macOS 15.2, Chrome 124)',
  location = 'San Francisco, CA, USA (IP: 192.0.2.1)',
  time = 'Aug 19, 2026, 01:05 AM',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Device / Browser', value: deviceName, isEmphasized: true },
    { label: 'Estimated Location', value: location },
    { label: 'Timestamp', value: time },
  ];

  return (
    <EmailLayout
      title="New Sign-In Detected"
      previewText={`New sign-in to your CodeZeniths account from ${deviceName}`}
      categoryBadge="Security Alert"
      badgeVariant="warning"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Your CodeZeniths account was recently accessed from a new device or unfamiliar browser:
      </EmailParagraph>

      <EmailInfoTable title="Session Details" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="warning" title="Action Required:">
        If this was you, no action is needed. If you do not recognize this activity, please revoke active sessions and secure your account immediately.
      </EmailCallout>

      <EmailButton href={`${appUrl}/settings`} isDark={isDark} variant="danger">
        Review Active Sessions
      </EmailButton>
    </EmailLayout>
  );
};

export default NewDeviceEmail;

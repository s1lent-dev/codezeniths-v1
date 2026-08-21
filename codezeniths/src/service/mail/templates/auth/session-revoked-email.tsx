/**
 * @file session-revoked-email.tsx
 * @description Security notification when a session is revoked remotely.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailCallout } from '../../components';

export interface SessionRevokedEmailProps {
  name?: string;
  deviceName?: string;
  location?: string;
  theme?: 'dark' | 'light';
}

export const SessionRevokedEmail: React.FC<SessionRevokedEmailProps> = ({
  name = 'Alex Rivera',
  deviceName = 'iPhone 15 Pro (Safari Mobile)',
  location = 'New York, NY, USA',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  const rows = [
    { label: 'Revoked Device', value: deviceName, isEmphasized: true },
    { label: 'Location', value: location },
    { label: 'Timestamp', value: new Date().toLocaleString() },
  ];

  return (
    <EmailLayout
      title="Session Terminated"
      previewText="An active session on your CodeZeniths account was revoked."
      categoryBadge="Session Management"
      badgeVariant="warning"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        An active session was terminated from your CodeZeniths account. Here are the session details:
      </EmailParagraph>

      <EmailInfoTable title="Terminated Session" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="info">
        If you initiated this logout or session revocation from your account settings, no further action is required.
      </EmailCallout>
    </EmailLayout>
  );
};

export default SessionRevokedEmail;

/**
 * @file admin-broadcast-email.tsx
 * @description Platform announcement / administrative broadcast email template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton } from '../../components';

export interface AdminBroadcastEmailProps {
  title?: string;
  message?: string;
  name?: string;
  actionUrl?: string;
  actionText?: string;
  theme?: 'dark' | 'light';
}

export const AdminBroadcastEmail: React.FC<AdminBroadcastEmailProps> = ({
  title = 'System Design Track & Cloud Compiler 2.0 Released 🚀',
  message = 'We are thrilled to announce that our new Distributed Systems Track is now live! Explore 40+ new interactive architecture scenarios and test your concurrent services with live load simulation.',
  name = 'Alex Rivera',
  actionUrl,
  actionText = 'Explore System Design Track',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
  const targetUrl = actionUrl || appUrl;

  return (
    <EmailLayout
      title={title}
      previewText={title}
      categoryBadge="Announcement"
      badgeVariant="purple"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>

      <EmailParagraph isDark={isDark}>
        {message}
      </EmailParagraph>

      <EmailButton href={targetUrl} isDark={isDark} variant="primary">
        {actionText}
      </EmailButton>
    </EmailLayout>
  );
};

export default AdminBroadcastEmail;

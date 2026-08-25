/**
 * @file contact-confirmation-email.tsx
 * @description Outbound confirmation email sent to the user acknowledging receipt of their contact form message.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
  message: string;
  submittedAt: string;
  theme?: 'dark' | 'light';
}

export const ContactConfirmationEmail: React.FC<ContactConfirmationEmailProps> = ({
  name = 'Alex Rivera',
  subject = 'Inquiry regarding Enterprise ZenLab Workspaces',
  message = 'I am interested in setting up custom ZenLab sandbox environments...',
  submittedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }),
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.in';

  return (
    <EmailLayout
      title={`We've Received Your Message! 📬`}
      previewText={`Thank you for reaching out to CodeZeniths regarding "${subject}".`}
      categoryBadge="Message Received"
      badgeVariant="teal"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>

      <EmailParagraph isDark={isDark}>
        Thank you for contacting CodeZeniths. We have successfully received your inquiry regarding <strong className={isDark ? 'text-white' : 'text-heading-light'}>&quot;{subject}&quot;</strong> submitted on {submittedAt}.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info" title="What happens next:">
        <p className={`text-sm leading-relaxed m-0 ${isDark ? 'text-white' : 'text-body-light'}`}>
          Our developer support engineering team reviews incoming inquiries continuously. You can expect a direct response to this email within <strong>24–48 hours</strong>.
        </p>
      </EmailCallout>

      <EmailCallout isDark={isDark} variant="info" title="Copy of your submitted message:">
        <p className={`text-xs leading-relaxed whitespace-pre-wrap m-0 ${isDark ? 'text-muted-dark' : 'text-muted-light'}`}>
          {message}
        </p>
      </EmailCallout>

      <EmailButton href={`${appUrl}/problemset`} isDark={isDark} variant="primary">
        Explore CodeZeniths Platform
      </EmailButton>

      <EmailParagraph isDark={isDark} className="text-xs text-muted-dark mt-4">
        Need urgent assistance? You can also connect with our developer community on Discord or review our documentation.
      </EmailParagraph>
    </EmailLayout>
  );
};

export default ContactConfirmationEmail;

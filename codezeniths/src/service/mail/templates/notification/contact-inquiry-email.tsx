/**
 * @file contact-inquiry-email.tsx
 * @description Inbound email template sent to CodeZeniths support team when a visitor submits the contact form.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout, EmailInfoTable } from '../../components';

export interface ContactInquiryEmailProps {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  message: string;
  submittedAt: string;
  isRegisteredUser?: boolean;
  theme?: 'dark' | 'light';
}

export const ContactInquiryEmail: React.FC<ContactInquiryEmailProps> = ({
  name = 'Alex Rivera',
  email = 'alex.rivera@example.com',
  subject = 'Inquiry regarding Enterprise ZenLab Workspaces',
  phone,
  message = 'Hello CodeZeniths team,\n\nI am interested in setting up custom ZenLab sandbox environments for our university cohort. Could you provide details on team licensing and custom compute quotas?\n\nBest regards,\nAlex',
  submittedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }),
  isRegisteredUser = false,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  const rows = [
    { label: 'Sender Name', value: <strong className={isDark ? 'text-white' : 'text-heading-light'}>{name}</strong> },
    { label: 'Sender Email', value: <span className="text-primary font-medium">{email}</span> },
    ...(phone ? [{ label: 'Phone Number', value: <span className={isDark ? 'text-white' : 'text-heading-light'}>{phone}</span> }] : []),
    { label: 'Subject', value: <span className={isDark ? 'text-white' : 'text-heading-light'}>{subject}</span> },
    { label: 'Submitted At', value: <span className={isDark ? 'text-muted-dark' : 'text-muted-light'}>{submittedAt}</span> },
    {
      label: 'Account Status',
      value: (
        <span className={isRegisteredUser ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
          {isRegisteredUser ? '● Registered Member' : '○ Guest Visitor'}
        </span>
      ),
    },
  ];

  return (
    <EmailLayout
      title={`📬 New Contact Inquiry: ${subject}`}
      previewText={`New inquiry from ${name} (${email}): "${subject}"`}
      categoryBadge="Inbound Inquiry"
      badgeVariant="primary"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        A new message was submitted via the CodeZeniths landing page contact form.
      </EmailParagraph>

      <EmailInfoTable
        title="Inquiry Metadata"
        rows={rows}
        isDark={isDark}
      />

      <EmailCallout isDark={isDark} variant="info" title="Message Content">
        <p className={`text-sm leading-relaxed whitespace-pre-wrap m-0 ${isDark ? 'text-white' : 'text-body-light'}`}>
          {message}
        </p>
      </EmailCallout>

      <EmailButton
        href={`mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}`}
        isDark={isDark}
        variant="primary"
      >
        Reply Directly to {name}
      </EmailButton>

      <EmailParagraph isDark={isDark} className="text-xs text-muted-dark mt-4">
        Tip: You can also hit &quot;Reply&quot; directly in your email client to respond to {email}.
      </EmailParagraph>
    </EmailLayout>
  );
};

export default ContactInquiryEmail;

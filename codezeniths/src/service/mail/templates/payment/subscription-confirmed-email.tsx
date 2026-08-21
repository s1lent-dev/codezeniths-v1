/**
 * @file subscription-confirmed-email.tsx
 * @description Confirmation email when user subscribes to CodeZeniths Pro or Premium.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface SubscriptionConfirmedEmailProps {
  name?: string;
  planName?: string;
  price?: string;
  nextBillingDate?: string;
  theme?: 'dark' | 'light';
}

export const SubscriptionConfirmedEmail: React.FC<SubscriptionConfirmedEmailProps> = ({
  name = 'Alex Rivera',
  planName = 'Premium Plan (Annual)',
  price = '$199.99 / year',
  nextBillingDate = 'Aug 19, 2027',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Plan', value: planName, isEmphasized: true },
    { label: 'Amount', value: price },
    ...(nextBillingDate ? [{ label: 'Next Billing Date', value: nextBillingDate }] : []),
    { label: 'Status', value: 'Active' },
  ];

  return (
    <EmailLayout
      title={`Welcome to CodeZeniths ${planName}! ⭐`}
      previewText={`Your subscription to CodeZeniths ${planName} is confirmed.`}
      categoryBadge="Subscription"
      badgeVariant="success"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Thank you for subscribing to CodeZeniths! Your upgrade is now active, giving you unrestricted access to premium system design roadmaps, advanced test cases, and cloud IDEs.
      </EmailParagraph>

      <EmailInfoTable title="Subscription Overview" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="success" title="🚀 Included Benefits:">
        <table role="presentation" cellPadding="0" cellSpacing="0" className="w-full">
          <tbody>
            <tr>
              <td className="py-1 align-top text-success font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Unlimited cloud runtime executions
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-success font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Comprehensive editorial solutions & video explanations
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-success font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Priority technical support & contest rank analytics
              </td>
            </tr>
          </tbody>
        </table>
      </EmailCallout>

      <EmailButton href={`${appUrl}/problemset`} isDark={isDark} variant="primary">
        Explore Premium Content
      </EmailButton>
    </EmailLayout>
  );
};

export default SubscriptionConfirmedEmail;

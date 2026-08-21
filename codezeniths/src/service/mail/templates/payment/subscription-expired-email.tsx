/**
 * @file subscription-expired-email.tsx
 * @description Notification when a cancelled subscription period ends and reverts to Free tier.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface SubscriptionExpiredEmailProps {
  name?: string;
  planName?: string;
  theme?: 'dark' | 'light';
}

export const SubscriptionExpiredEmail: React.FC<SubscriptionExpiredEmailProps> = ({
  name = 'Alex Rivera',
  planName = 'Premium Plan',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title="Your Premium Access Has Concluded"
      previewText="Your CodeZeniths subscription has ended."
      categoryBadge="Subscription Ended"
      badgeVariant="warning"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Your subscription to <strong>{planName}</strong> has ended and your account is now on the Free tier.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info">
        You can continue to practice with standard problems, solve daily challenges, and track your streaks. To regain access to advanced system design modules and cloud runtimes, you can re-subscribe at any time.
      </EmailCallout>

      <EmailButton href={`${appUrl}/pricing`} isDark={isDark} variant="primary">
        View Subscription Plans
      </EmailButton>
    </EmailLayout>
  );
};

export default SubscriptionExpiredEmail;

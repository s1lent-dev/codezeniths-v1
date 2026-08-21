/**
 * @file streak-milestone-email.tsx
 * @description Notification when user achieves a consecutive problem-solving streak milestone.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface StreakMilestoneEmailProps {
  name?: string;
  streakCount?: number;
  theme?: 'dark' | 'light';
}

export const StreakMilestoneEmail: React.FC<StreakMilestoneEmailProps> = ({
  name = 'Alex Rivera',
  streakCount = 50,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title={`Unstoppable! ${streakCount}-Day Streak Hit 🔥`}
      previewText={`Congratulations on hitting a ${streakCount}-day coding streak on CodeZeniths!`}
      categoryBadge="Milestone Reached"
      badgeVariant="warning"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Incredible dedication! You have successfully reached a continuous streak of{' '}
        <strong className="text-warning text-[17px]">{streakCount} consecutive days</strong> of solving algorithmic problems on CodeZeniths.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="warning" title="🔥 Streak Level Unlocked:">
        Consistency is what separates great software engineers from the rest. You're building unbeatable problem-solving muscle memory!
      </EmailCallout>

      <EmailButton href={`${appUrl}/problemset`} isDark={isDark} variant="primary">
        Solve Today's Problem
      </EmailButton>

      <EmailParagraph isDark={isDark}>
        Keep the flame alive and aim for the next milestone!
      </EmailParagraph>
    </EmailLayout>
  );
};

export default StreakMilestoneEmail;

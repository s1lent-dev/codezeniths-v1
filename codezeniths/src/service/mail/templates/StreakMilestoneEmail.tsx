import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface StreakMilestoneEmailProps {
  name: string;
  streakCount: number;
}

export const StreakMilestoneEmail: React.FC<StreakMilestoneEmailProps> = ({ name, streakCount }) => {
  return (
    <EmailLayout title="New Streak Milestone Hit! 🔥" previewText="Congratulations on your progress">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Incredible coding discipline! You've successfully hit a coding streak of <strong>{streakCount} days</strong>!
      </Text>
      <Text style={paragraph}>
        Keep up the momentum and reach the next milestone!
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

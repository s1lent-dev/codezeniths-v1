import type { Meta, StoryObj } from '@storybook/nextjs';
import { StreakMilestoneEmail, WeeklyDigestEmail } from './index';

const meta: Meta = {
  title: 'Emails/Progress & Milestones',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// 1. Streak Milestone
export const StreakMilestoneDark: StoryObj = {
  render: () => <StreakMilestoneEmail name="Alex Rivera" streakCount={50} theme="dark" />,
};

export const StreakMilestoneLight: StoryObj = {
  render: () => <StreakMilestoneEmail name="Alex Rivera" streakCount={50} theme="light" />,
};

// 2. Weekly Digest
export const WeeklyDigestDark: StoryObj = {
  render: () => (
    <WeeklyDigestEmail
      name="Alex Rivera"
      summaryUrl="https://codezeniths.com/profile/alex_zenith"
      theme="dark"
    />
  ),
};

export const WeeklyDigestLight: StoryObj = {
  render: () => (
    <WeeklyDigestEmail
      name="Alex Rivera"
      summaryUrl="https://codezeniths.com/profile/alex_zenith"
      theme="light"
    />
  ),
};

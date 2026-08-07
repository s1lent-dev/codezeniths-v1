import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProgressLoader } from './progress-loader';

const meta = {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    totalBlocks: { control: { type: 'number', min: 10, max: 100 } },
    progressPercentage: { control: { type: 'range', min: 0, max: 100 } },
    blockWidth: { control: { type: 'number', min: 2, max: 10 } },
    blockHeight: { control: { type: 'number', min: 10, max: 50 } },
    gap: { control: { type: 'number', min: 1, max: 10 } },
    animationDuration: { control: { type: 'number', min: 500, max: 5000 } },
  },
} satisfies Meta<typeof ProgressLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalBlocks: 50,
    progressPercentage: 40,
    blockWidth: 4,
    blockHeight: 30,
    gap: 4,
    animationDuration: 2000,
  },
};

export const FullProgress: Story = {
  args: {
    totalBlocks: 50,
    progressPercentage: 100,
    blockWidth: 4,
    blockHeight: 30,
    gap: 4,
  },
};

export const ZeroProgress: Story = {
  args: {
    totalBlocks: 50,
    progressPercentage: 0,
    blockWidth: 4,
    blockHeight: 30,
    gap: 4,
  },
};

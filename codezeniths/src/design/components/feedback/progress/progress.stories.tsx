import type { Meta, StoryObj } from '@storybook/nextjs';
import { Progress } from './progress';

const meta = {
    title: 'Components/Feedback/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100 } },
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 60,
        className: 'w-80',
    },
};

export const Complete: Story = {
    args: {
        value: 100,
        className: 'w-80',
    },
};

export const Zero: Story = {
    args: {
        value: 0,
        className: 'w-80',
    },
};

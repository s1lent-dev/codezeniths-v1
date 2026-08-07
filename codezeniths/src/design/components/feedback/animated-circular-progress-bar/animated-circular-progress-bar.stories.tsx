import type { Meta, StoryObj } from '@storybook/nextjs';
import { AnimatedCircularProgressBar } from './animated-circular-progress-bar';

const meta = {
    title: 'Components/Feedback/AnimatedCircularProgressBar',
    component: AnimatedCircularProgressBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100 } },
        gaugePrimaryColor: { control: 'color' },
        gaugeSecondaryColor: { control: 'color' },
    },
} satisfies Meta<typeof AnimatedCircularProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 75,
        gaugePrimaryColor: '#6a7cff',
        gaugeSecondaryColor: 'rgba(106, 124, 255, 0.15)',
    },
};

export const LowProgress: Story = {
    args: {
        value: 30,
        gaugePrimaryColor: '#7aa2f7',
        gaugeSecondaryColor: 'rgba(122, 162, 247, 0.15)',
    },
};

export const Complete: Story = {
    args: {
        value: 100,
        gaugePrimaryColor: '#00ffb2',
        gaugeSecondaryColor: 'rgba(0, 255, 178, 0.15)',
    },
};

'use client';
import { ThemeToggler } from './theme-toggler';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Others/ThemeToggler',
    component: ThemeToggler,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            options: {
                dark: { name: 'Dark', value: '#181C31' },
                light: { name: 'Light', value: '#edeef7' },
            },
        },
    },
} satisfies Meta<typeof ThemeToggler>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        duration: 400,
    },
};

// ───────────────────────────────────────────────

export const SlowTransition: Story = {
    args: {
        duration: 1200,
    },
    name: 'Slow Transition',
};

// ───────────────────────────────────────────────

export const FastTransition: Story = {
    args: {
        duration: 150,
    },
    name: 'Fast Transition',
};
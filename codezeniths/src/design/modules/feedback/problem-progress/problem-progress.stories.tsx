import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProblemProgress } from './problem-progress';

const meta = {
    title: 'Modules/Feedback/ProblemProgress',
    component: ProblemProgress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        totalProblems: { control: { type: 'number', min: 1, max: 5000 } },
        solved: { control: { type: 'number', min: 0, max: 5000 } },
        unsolved: { control: { type: 'number', min: 0, max: 5000 } },
        completionPercentage: { control: { type: 'range', min: 0, max: 100, step: 0.01 } },
        revisitCount: { control: { type: 'number', min: 0, max: 1000 } },
        interactive: { control: 'boolean' },
        defaultMode: { control: { type: 'radio', options: ['difficulty', 'status'] } },
    },
} satisfies Meta<typeof ProblemProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        easy: { solved: 8, total: 15 },
        medium: { solved: 4, total: 15 },
        hard: { solved: 1, total: 7 },
        totalProblems: 37,
        solved: 13,
        unsolved: 21,
        completionPercentage: 68.06,
        revisitCount: 3,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const RealWorldLargeDataset: Story = {
    args: {
        easy: { solved: 750, total: 1000 },
        medium: {
            "solved": 50,
            "total": 1500
        },
        hard: { solved: 150, total: 500 },
        totalProblems: 3000,
        solved: 1500,
        unsolved: 1250,
        completionPercentage: 50.0,
        revisitCount: 250,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const HighCompletion: Story = {
    args: {
        easy: { solved: 20, total: 20 },
        medium: { solved: 15, total: 15 },
        hard: { solved: 5, total: 10 },
        totalProblems: 45,
        solved: 40,
        unsolved: 3,
        completionPercentage: 88.89,
        revisitCount: 2,
        interactive: true,
    },
};

export const LowProgress: Story = {
    args: {
        easy: { solved: 2, total: 20 },
        medium: { solved: 1, total: 20 },
        hard: { solved: 0, total: 10 },
        totalProblems: 50,
        solved: 3,
        unsolved: 42,
        completionPercentage: 6.0,
        revisitCount: 5,
        interactive: true,
    },
};

export const StatusModeOnly: Story = {
    args: {
        easy: { solved: 750, total: 1000 },
        medium: { solved: 600, total: 1500 },
        hard: { solved: 150, total: 500 },
        totalProblems: 3000,
        solved: 1500,
        unsolved: 1250,
        completionPercentage: 50.0,
        revisitCount: 250,
        interactive: false,
        defaultMode: 'status',
    },
};

export const DifficultyModeOnly: Story = {
    args: {
        easy: { solved: 750, total: 1000 },
        medium: { solved: 600, total: 1500 },
        hard: { solved: 150, total: 500 },
        totalProblems: 3000,
        solved: 1500,
        unsolved: 1250,
        completionPercentage: 50.0,
        revisitCount: 250,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

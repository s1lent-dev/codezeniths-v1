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

// =============================================================================
// 1. ORIGINAL PREVIOUS STORIES
// =============================================================================

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
        medium: { solved: 50, total: 1500 },
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

// =============================================================================
// 2. STATIC STATUS DISTRIBUTION MODE COMBINATIONS (S1 - S7)
// =============================================================================

export const Static_Status_S1_NewUserAllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 15 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 15 },
        totalProblems: 50,
        solved: 0,
        unsolved: 50,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 15 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 15 },
        totalProblems: 50,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 50,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S3_100PercentSolvedNoRevisit: Story = {
    args: {
        easy: { solved: 15, total: 15 },
        medium: { solved: 20, total: 20 },
        hard: { solved: 15, total: 15 },
        totalProblems: 50,
        solved: 50,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S4_RevisitAndUnsolvedOnly: Story = {
    args: {
        easy: { solved: 0, total: 15 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 15 },
        totalProblems: 50,
        solved: 0,
        unsolved: 40,
        completionPercentage: 0,
        revisitCount: 10,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S5_SolvedAndUnsolvedNoRevisit: Story = {
    args: {
        easy: { solved: 10, total: 15 },
        medium: { solved: 5, total: 20 },
        hard: { solved: 0, total: 15 },
        totalProblems: 50,
        solved: 15,
        unsolved: 35,
        completionPercentage: 30,
        revisitCount: 0,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S6_SolvedAndRevisit100Percent: Story = {
    args: {
        easy: { solved: 15, total: 15 },
        medium: { solved: 15, total: 20 },
        hard: { solved: 10, total: 15 },
        totalProblems: 50,
        solved: 40,
        unsolved: 0,
        completionPercentage: 80,
        revisitCount: 10,
        interactive: false,
        defaultMode: 'status',
    },
};

export const Static_Status_S7_AllThreeActive: Story = {
    args: {
        easy: { solved: 10, total: 15 },
        medium: { solved: 8, total: 20 },
        hard: { solved: 2, total: 15 },
        totalProblems: 50,
        solved: 20,
        unsolved: 25,
        completionPercentage: 40,
        revisitCount: 5,
        interactive: false,
        defaultMode: 'status',
    },
};

// =============================================================================
// 3. STATIC DIFFICULTY MODE COMBINATIONS (D1 - D7)
// =============================================================================

export const Static_Difficulty_D1_OnlyEasy: Story = {
    args: {
        easy: { solved: 15, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 15,
        unsolved: 15,
        completionPercentage: 50,
        revisitCount: 2,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D2_OnlyMedium: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 20, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 4,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D3_OnlyHard: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 10, total: 25 },
        totalProblems: 25,
        solved: 10,
        unsolved: 15,
        completionPercentage: 40,
        revisitCount: 1,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D4_EasyAndMediumOnly: Story = {
    args: {
        easy: { solved: 12, total: 20 },
        medium: { solved: 8, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 3,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D5_EasyAndHardOnly: Story = {
    args: {
        easy: { solved: 15, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 5, total: 15 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 2,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D6_MediumAndHardOnly: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 20 },
        totalProblems: 50,
        solved: 20,
        unsolved: 30,
        completionPercentage: 40,
        revisitCount: 5,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

export const Static_Difficulty_D7_AllThreeActive: Story = {
    args: {
        easy: { solved: 10, total: 20 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 10 },
        totalProblems: 60,
        solved: 30,
        unsolved: 30,
        completionPercentage: 50,
        revisitCount: 4,
        interactive: false,
        defaultMode: 'difficulty',
    },
};

// =============================================================================
// 4. INTERACTIVE 7x7 (49) COMBINATIONS (Hover to toggle between Difficulty & Status)
// =============================================================================

// --- D1: ONLY EASY (Total: 30) ---
export const Interactive_D1_OnlyEasy_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 0,
        unsolved: 30,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 30,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 30, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 30,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 0,
        unsolved: 25,
        completionPercentage: 0,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 15, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 15,
        unsolved: 15,
        completionPercentage: 50,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 25, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 25,
        unsolved: 0,
        completionPercentage: 83.33,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D1_OnlyEasy_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 15, total: 30 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
        totalProblems: 30,
        solved: 15,
        unsolved: 10,
        completionPercentage: 50,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D2: ONLY MEDIUM (Total: 40) ---
export const Interactive_D2_OnlyMedium_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 40,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 40,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 40, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 40,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 30,
        completionPercentage: 0,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 20, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 30, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 30,
        unsolved: 0,
        completionPercentage: 75,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D2_OnlyMedium_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 20, total: 40 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 15,
        completionPercentage: 50,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D3: ONLY HARD (Total: 25) ---
export const Interactive_D3_OnlyHard_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 25 },
        totalProblems: 25,
        solved: 0,
        unsolved: 25,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 25 },
        totalProblems: 25,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 25,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 25, total: 25 },
        totalProblems: 25,
        solved: 25,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 25 },
        totalProblems: 25,
        solved: 0,
        unsolved: 20,
        completionPercentage: 0,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 10, total: 25 },
        totalProblems: 25,
        solved: 10,
        unsolved: 15,
        completionPercentage: 40,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 20, total: 25 },
        totalProblems: 25,
        solved: 20,
        unsolved: 0,
        completionPercentage: 80,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D3_OnlyHard_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 10, total: 25 },
        totalProblems: 25,
        solved: 10,
        unsolved: 10,
        completionPercentage: 40,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D4: EASY & MEDIUM ONLY (Total: 40) ---
export const Interactive_D4_EasyAndMedium_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 40,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 40,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 20, total: 20 },
        medium: { solved: 20, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 40,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 0,
        unsolved: 30,
        completionPercentage: 0,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 12, total: 20 },
        medium: { solved: 8, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 18, total: 20 },
        medium: { solved: 12, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 30,
        unsolved: 0,
        completionPercentage: 75,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D4_EasyAndMedium_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 12, total: 20 },
        medium: { solved: 8, total: 20 },
        hard: { solved: 0, total: 0 },
        totalProblems: 40,
        solved: 20,
        unsolved: 15,
        completionPercentage: 50,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D5: EASY & HARD ONLY (Total: 40) ---
export const Interactive_D5_EasyAndHard_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 15 },
        totalProblems: 40,
        solved: 0,
        unsolved: 40,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 15 },
        totalProblems: 40,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 40,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 25, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 15, total: 15 },
        totalProblems: 40,
        solved: 40,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 15 },
        totalProblems: 40,
        solved: 0,
        unsolved: 30,
        completionPercentage: 0,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 15, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 5, total: 15 },
        totalProblems: 40,
        solved: 20,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 20, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 10, total: 15 },
        totalProblems: 40,
        solved: 30,
        unsolved: 0,
        completionPercentage: 75,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D5_EasyAndHard_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 15, total: 25 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 5, total: 15 },
        totalProblems: 40,
        solved: 20,
        unsolved: 15,
        completionPercentage: 50,
        revisitCount: 5,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D6: MEDIUM & HARD ONLY (Total: 50) ---
export const Interactive_D6_MediumAndHard_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 20 },
        totalProblems: 50,
        solved: 0,
        unsolved: 50,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 20 },
        totalProblems: 50,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 50,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 30, total: 30 },
        hard: { solved: 20, total: 20 },
        totalProblems: 50,
        solved: 50,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 20 },
        totalProblems: 50,
        solved: 0,
        unsolved: 40,
        completionPercentage: 0,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 20 },
        totalProblems: 50,
        solved: 20,
        unsolved: 30,
        completionPercentage: 40,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 25, total: 30 },
        hard: { solved: 15, total: 20 },
        totalProblems: 50,
        solved: 40,
        unsolved: 0,
        completionPercentage: 80,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D6_MediumAndHard_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 20 },
        totalProblems: 50,
        solved: 20,
        unsolved: 20,
        completionPercentage: 40,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

// --- D7: ALL THREE DIFFICULTY TIERS ACTIVE (Total: 60) ---
export const Interactive_D7_AllThreeDiff_S1_AllUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 10 },
        totalProblems: 60,
        solved: 0,
        unsolved: 60,
        completionPercentage: 0,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S2_AllRevisit: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 10 },
        totalProblems: 60,
        solved: 0,
        unsolved: 0,
        completionPercentage: 0,
        revisitCount: 60,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S3_100PercentSolved: Story = {
    args: {
        easy: { solved: 20, total: 20 },
        medium: { solved: 30, total: 30 },
        hard: { solved: 10, total: 10 },
        totalProblems: 60,
        solved: 60,
        unsolved: 0,
        completionPercentage: 100,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S4_RevisitAndUnsolved: Story = {
    args: {
        easy: { solved: 0, total: 20 },
        medium: { solved: 0, total: 30 },
        hard: { solved: 0, total: 10 },
        totalProblems: 60,
        solved: 0,
        unsolved: 45,
        completionPercentage: 0,
        revisitCount: 15,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S5_SolvedAndUnsolved: Story = {
    args: {
        easy: { solved: 10, total: 20 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 10 },
        totalProblems: 60,
        solved: 30,
        unsolved: 30,
        completionPercentage: 50,
        revisitCount: 0,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S6_SolvedAndRevisit: Story = {
    args: {
        easy: { solved: 15, total: 20 },
        medium: { solved: 25, total: 30 },
        hard: { solved: 8, total: 10 },
        totalProblems: 60,
        solved: 48,
        unsolved: 0,
        completionPercentage: 80,
        revisitCount: 12,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

export const Interactive_D7_AllThreeDiff_S7_AllThreeStatuses: Story = {
    args: {
        easy: { solved: 10, total: 20 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 5, total: 10 },
        totalProblems: 60,
        solved: 30,
        unsolved: 20,
        completionPercentage: 50,
        revisitCount: 10,
        interactive: true,
        defaultMode: 'difficulty',
    },
};

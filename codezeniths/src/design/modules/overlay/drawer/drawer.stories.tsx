'use client';
// Drawer.stories.tsx
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';
import {
    Button,
    ButtonSize,
    ButtonVariant,
} from '@codezeniths/components';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from './drawer';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Overlay/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the bar chart
const chartData = [
    { goal: 400 },
    { goal: 300 },
    { goal: 200 },
    { goal: 300 },
    { goal: 200 },
    { goal: 278 },
    { goal: 189 },
    { goal: 239 },
    { goal: 300 },
    { goal: 200 },
    { goal: 278 },
    { goal: 189 },
    { goal: 349 },
];

export const Default: Story = {
    name: 'Default',
    render: function Default() {
        const [goal, setGoal] = useState(350);

        const adjustGoal = (adjustment: number) => {
            setGoal((prev) => Math.max(200, Math.min(400, prev + adjustment)));
        };

        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Open Drawer</Button>
                </DrawerTrigger>

                <DrawerContent className='border-muted-light-shade3 dark:border-muted-dark-shade3'>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Move Goal</DrawerTitle>
                            <DrawerDescription>
                                Set your daily activity goal.
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 pb-0">
                            {/* Goal counter with +/- buttons */}
                            <div className="flex items-center justify-center space-x-2">
                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.ICON}
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={() => adjustGoal(-10)}
                                    disabled={goal <= 200}
                                >
                                    <Minus className="h-4 w-4" />
                                    <span className="sr-only">Decrease goal</span>
                                </Button>

                                <div className="flex-1 text-center">
                                    <div className="text-7xl font-bold tracking-tighter text-body-light dark:text-body-dark">
                                        {goal}
                                    </div>
                                    <div className="text-muted-light-shade3 dark:text-muted-dark-shade3 text-[0.70rem] uppercase tracking-wide">
                                        Calories/day
                                    </div>
                                </div>

                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.ICON}
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={() => adjustGoal(10)}
                                    disabled={goal >= 400}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Increase goal</span>
                                </Button>
                            </div>

                            {/* Small bar chart */}
                            <div className="mt-3 h-[120px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <Bar
                                            dataKey="goal"
                                            fill="var(--chart-1, #3b82f6)" // fallback color if --chart-1 not defined
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose asChild>
                                <Button variant={ButtonVariant.OUTLINE}>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    },
};
'use client';
import * as React from 'react';
import type { StepDefinition, StepStatus } from './stepper.types';

// ---------------------------------------------------------------------------
// StepperMethods — the public API returned by useStepper
// ---------------------------------------------------------------------------

export interface StepperMethods<TSteps extends Array<StepDefinition>> {
    /** All step definitions passed to defineStepper */
    steps: TSteps;
    /** The currently active step */
    current: TSteps[number];
    /** Zero-based index of the active step */
    currentIndex: number;
    /** True when on the first step */
    isFirst: boolean;
    /** True when on the last step */
    isLast: boolean;
    /** Advance to the next step (noop at the end) */
    next: () => void;
    /** Go back to the previous step (noop at the start) */
    prev: () => void;
    /** Jump directly to a step by its id */
    goTo: (id: TSteps[number]['id']) => void;
    /** Return to the first step */
    reset: () => void;
    /** Derive the status of any step by id */
    statusOf: (id: TSteps[number]['id']) => StepStatus;
}

/**
 * @factory createUseStepper
 * Returns a bound useStepper hook for a specific set of step definitions.
 * Kept as a factory so defineStepper can close over its stepDefs array.
*/

export function createUseStepper<const TSteps extends Array<StepDefinition>>(
    stepDefs: TSteps,
) {
    return function useStepper(
        initialId?: TSteps[number]['id'],
    ): StepperMethods<TSteps> {
        const [currentIndex, setCurrentIndex] = React.useState<number>(() => {
            if (!initialId) {return 0;}
            const idx = stepDefs.findIndex((s) => s.id === initialId);
            return idx >= 0 ? idx : 0;
        });

        const current = stepDefs[currentIndex] as TSteps[number];

        const next = React.useCallback(
            () => setCurrentIndex((i) => Math.min(i + 1, stepDefs.length - 1)),
            [],
        );

        const prev = React.useCallback(
            () => setCurrentIndex((i) => Math.max(i - 1, 0)),
            [],
        );

        const reset = React.useCallback(() => setCurrentIndex(0), []);

        const goTo = React.useCallback((id: TSteps[number]['id']) => {
            const idx = stepDefs.findIndex((s) => s.id === id);
            if (idx >= 0) {setCurrentIndex(idx);}
        }, []);

        const statusOf = React.useCallback(
            (id: TSteps[number]['id']): StepStatus => {
                const idx = stepDefs.findIndex((s) => s.id === id);
                if (idx < currentIndex) {return 'completed';}
                if (idx === currentIndex) {return 'active';}
                return 'upcoming';
            },
            [currentIndex],
        );

        return {
            steps: stepDefs as unknown as TSteps,
            current,
            currentIndex,
            isFirst: currentIndex === 0,
            isLast:  currentIndex === stepDefs.length - 1,
            next,
            prev,
            goTo,
            reset,
            statusOf,
        };
    };
}

// ---------------------------------------------------------------------------
// Pure utility helpers
// ---------------------------------------------------------------------------

/**
 * Returns the zero-based index of a step by id.
 * Returns -1 when not found.
 */
export function findStepIndex(
    steps: Array<StepDefinition>,
    id: string,
): number {
    return steps.findIndex((s) => s.id === id);
}

/**
 * Computes a 0–100 progress percentage based on current step index.
 * Returns 0 for single-step flows to avoid division by zero.
 */
export function computeProgress(
    currentIndex: number,
    totalSteps: number,
): number {
    if (totalSteps <= 1) {return 0;}
    return Math.round((currentIndex / (totalSteps - 1)) * 100);
}

/**
 * Derives the icon size class for the Check icon inside a completed indicator.
 */
export function resolveCheckIconSize(size: 'sm' | 'md' | 'lg' | null | undefined): string {
    if (size === 'sm') {return 'h-3 w-3';}
    if (size === 'lg') {return 'h-5 w-5';}
    return 'h-4 w-4'; // md (default)
}
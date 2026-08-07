'use client';
import * as React from 'react';
import type { StepDefinition, StepperContextValue } from './stepper.types';

/**
 * @context StepperContext
 * A single shared context that carries both stepper methods and display config.
 * The generic is erased at runtime; components cast back to their concrete type.
 */

export const StepperContext = React.createContext<StepperContextValue<Array<StepDefinition>> | null>(
    null,
);

StepperContext.displayName = 'StepperContext';

/** 
    * @hook useStepperContext
    * Typed hook that throws a descriptive error when used outside a Provider.
    * Components that know their concrete Steps type cast the return value.
*/

export function useStepperContext<
    TSteps extends Array<StepDefinition>,
>(): StepperContextValue<TSteps> {
    const ctx = React.useContext(StepperContext);

    if (!ctx) {
        throw new Error(
            '[Stepper] useStepperContext must be called inside <Stepper.Provider>. ' +
        'Ensure all Stepper sub-components are rendered within a Provider created ' +
        'by the same defineStepper() call.',
        );
    }

    return ctx as StepperContextValue<TSteps>;
}
'use client';

/**
 * Stepper — In-house, shadcn-style
 *
 * Usage:
 *   import { defineStepper } from "@/components/ui/stepper"
 *
 *   const { Stepper, useStepper } = defineStepper(
 *     { id: "shipping", title: "Shipping", description: "Enter your address" },
 *     { id: "payment",  title: "Payment",  description: "Payment details"   },
 *     { id: "review",   title: "Review",   description: "Confirm order"     },
 *   );
 *
 *   export function CheckoutFlow() {
 *     return (
 *       <Stepper.Provider>
 *         <Stepper.Progress />
 *         <Stepper.Navigation />
 *         <Stepper.Panel>
 *           {({ step }) => <div>{step.title}</div>}
 *         </Stepper.Panel>
 *         <Stepper.Controls onFinish={() => console.log("done!")} />
 *       </Stepper.Provider>
 *     );
 *   }
 */

import { Controls, createProvider, Description, Navigation, Panel, Progress, Step, StepConnector, Title } from './stepper.provider';
import { createUseStepper } from './stepper.utils';
import type { StepDefinition } from './stepper.types';

/**
 * @factory defineStepper
 * Factory that closes over a typed set of step definitions and returns:
 *   • Stepper  — namespace of all compound components
 *   • useStepper — standalone hook for headless / custom usage
 * @returns {Stepper, useStepper}
 */

export function defineStepper<const TSteps extends Array<StepDefinition>>(
    ...stepDefs: TSteps
) {
    const useStepper = createUseStepper(stepDefs);
    const Provider   = createProvider(useStepper);

    /**
   * Stepper namespace — compound components scoped to these step definitions.
   *
   * Stepper.Provider     — wraps the entire stepper; manages state + config
   * Stepper.Navigation   — renders step indicators + connectors
   * Stepper.Connector    — animated step connector line
   * Stepper.Step         — stamps data-status on any wrapper element
   * Stepper.Panel        — conditionally renders per-step content
   * Stepper.Controls     — default prev / next / finish buttons
   * Stepper.Title        — current step's title
   * Stepper.Description  — current step's description
   * Stepper.Progress     — animated progress bar
   */
    const Stepper = {
        Provider,
        Navigation,
        Connector: StepConnector,
        Step,
        Panel,
        Controls,
        Title,
        Description,
        Progress,
    } as const;

    return { Stepper, useStepper };
}

// ---------------------------------------------------------------------------
// Public re-exports
// ---------------------------------------------------------------------------

// Types
export type {
    StepDefinition,
    StepStatus,
    ProviderProps,
    NavigationProps,
    StepConnectorProps,
    StepProps,
    PanelProps,
    ControlsProps,
    TitleProps,
    DescriptionProps,
    ProgressProps,
} from './stepper.types';
export type { StepperMethods } from './stepper.utils';

// Variant helpers (useful for extending / overriding styles)
export { stepIndicatorVariants, stepConnectorVariants, stepLabelVariants } from './stepper.variants';
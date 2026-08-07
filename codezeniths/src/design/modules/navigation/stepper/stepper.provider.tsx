'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Container, Nav, Typography, TypographyVariant, Button, ButtonVariant, Separator } from '@codezeniths/components';
import { StepperContext, useStepperContext } from './stepper.context';
import {
    stepConnectorVariants,
    stepIndicatorVariants,
    stepLabelVariants,
} from './stepper.variants';
import { computeProgress, resolveCheckIconSize } from './stepper.utils';
import type {
    ControlsProps,
    DescriptionProps,
    NavigationProps,
    PanelProps,
    ProgressProps,
    ProviderProps,
    StepDefinition,
    StepIndicatorProps,
    StepConnectorProps,
    StepperContextValue,
    StepProps,
    TitleProps,
} from './stepper.types';
import type { StepperMethods } from './stepper.utils';

// ---------------------------------------------------------------------------
// StepConnector
// Animated step connector line between indicators.
// Uses motion/react for smooth scale animations when moving between steps.
// ---------------------------------------------------------------------------

/**
 * @component StepConnector
 * Animated step connector line between step indicators.
 * Uses motion/react for smooth scale animations when moving between steps.
 */
export function StepConnector({
    orientation = 'horizontal',
    filled = false,
    className,
    size = 'md',
}: StepConnectorProps) {
    const resolveConnectorTopOffset = (s: 'sm' | 'md' | 'lg') => {
        switch (s) {
            case 'sm': return 'mt-[12px] -translate-y-1/2';
            case 'lg': return 'mt-[20px] -translate-y-1/2';
            case 'md':
            default:   return 'mt-[20px] -translate-y-1/2';
        }
    };

    if (orientation === 'vertical') {
        return (
            <div
                className={cn(
                    'relative w-1 flex-1 my-2 mx-auto min-h-8 rounded-full overflow-hidden bg-foreground-light-shade3 dark:bg-foreground-dark-shade3',
                    className,
                )}
            >
                <motion.div
                    className="absolute inset-0 w-full bg-primary rounded-full origin-top shadow-sm"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: filled ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative h-0.75 min-w-[2rem] flex-1 self-start rounded-full overflow-hidden bg-foreground-light-shade3 dark:bg-foreground-dark-shade1',
                resolveConnectorTopOffset(size),
                className,
            )}
        >
            <motion.div
                className="absolute inset-0 h-full bg-primary rounded-full origin-left shadow-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: filled ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Provider
// Owns display config (orientation / variant / size) and injects context.
// ---------------------------------------------------------------------------

/**
 * @provider createProvider
 * Factory that creates a Stepper.Provider component from a custom useStepper hook.
 * The useStepper hook encapsulates all step state management logic, while the
 * Provider handles display config and context injection. This separation allows
 * for maximum flexibility in how steps are defined and managed.
 * @param useStepper - A custom hook that implements stepper logic and returns stepper methods.
 * @returns A Stepper.Provider component that accepts display config and provides context to sub-components.
 */

export function createProvider<const TSteps extends Array<StepDefinition>>(
    useStepper: (initialId?: TSteps[number]['id']) => StepperMethods<TSteps>,
) {
    return function Provider({
        initialStep,
        orientation = 'horizontal',
        variant     = 'default',
        size        = 'md',
        className,
        containerProps,
        children,
    }: ProviderProps<TSteps>) {
        const methods = useStepper(initialStep);

        const ctx: StepperContextValue<TSteps> = {
            ...methods,
            orientation,
            variant,
            size,
        };

        return (
            <StepperContext.Provider
                value={ctx as unknown as StepperContextValue<Array<StepDefinition>>}
            >
                <Container
                    direction="col"
                    className={cn(
                        orientation === 'vertical' ? 'gap-0' : 'gap-xl-2',
                        className,
                    )}
                    {...containerProps}
                >
                    {typeof children === 'function' ? children({ methods }) : children}
                </Container>
            </StepperContext.Provider>
        );
    };
}

// ---------------------------------------------------------------------------
// Navigation
// Renders horizontal or vertical step list with indicators + connectors.
// ---------------------------------------------------------------------------

/**
 * @component Navigation
 * Renders the step navigation UI, either as a horizontal or vertical list.
 * Displays step indicators (number or check) and connectors that visually represent progress.
 * Clicking on a step indicator calls `goTo` to navigate to that step, and also triggers an optional `onStepClick` callback with the step data.
 * The component is responsive and adjusts its layout and typography based on the `orientation` and `size` from context.
*/

export function Navigation<TSteps extends Array<StepDefinition>>({
    className,
    showConnectors = true,
    onStepClick,
    titleProps,
    descriptionProps,
    indicatorProps,
    containerProps,
}: NavigationProps<TSteps>) {
    const { steps, statusOf, orientation, variant, size, goTo } =
        useStepperContext<TSteps>();

    const handleClick = async (step: TSteps[number]) => {
        if (onStepClick) {
            const allowed = await onStepClick(step);
            if (allowed === false) {
                return;
            }
        }
        goTo(step.id as TSteps[number]['id']);
    };

    const { size: _indSize, variant: _indVariant, ...restIndicatorProps } = indicatorProps || {};

    if (orientation === 'vertical') {
        return (
            <Nav aria-label="Step navigation" className={cn('flex flex-col', className)} {...containerProps}>
                {steps.map((step, i) => {
                    const status = statusOf(step.id as TSteps[number]['id']);
                    const isLast = i === steps.length - 1;

                    return (
                        <Container key={step.id} direction="row" className="gap-lg-2">
                            {/* Left col: indicator + vertical connector */}
                            <Container direction="col" align="center">
                                <StepIndicator
                                    status={status}
                                    index={i}
                                    size={size}
                                    variant={variant}
                                    onClick={() => handleClick(step as TSteps[number])}
                                    aria-label={`Step ${i + 1}: ${step.title ?? step.id}`}
                                    {...restIndicatorProps}
                                />
                                {!isLast && showConnectors && (
                                    <StepConnector
                                        orientation="vertical"
                                        filled={status === 'completed'}
                                        size={size}
                                    />
                                )}
                            </Container>

                            {/* Right col: label */}
                            <Container className={cn('pb-xl-2', isLast && 'pb-0')}>
                                {step.title && (
                                    <Typography
                                        variant={TypographyVariant.P}
                                        {...(titleProps as any)}
                                        className={cn(
                                            stepLabelVariants({ status, size }),
                                            titleProps?.className,
                                        )}
                                    >
                                        {step.title}
                                    </Typography>
                                )}
                                {step.description && (
                                    <Typography
                                        variant={TypographyVariant.SPAN}
                                        {...(descriptionProps as any)}
                                        className={cn(
                                            'mt-xs-1 text-muted-dark block',
                                            descriptionProps?.className,
                                        )}
                                    >
                                        {step.description}
                                    </Typography>
                                )}
                            </Container>
                        </Container>
                    );
                })}
            </Nav>
        );
    }

    // Horizontal
    return (
        <Nav
            aria-label="Step navigation"
            className={cn('flex w-full items-start', className)}
            {...containerProps}
        >
            {steps.map((step, i) => {
                const status = statusOf(step.id as TSteps[number]['id']);
                const isLast = i === steps.length - 1;

                return (
                    <React.Fragment key={step.id}>
                        {/* Step item */}
                        <Container direction="col" align="center" className="gap-sm-2 flex-1">
                            <StepIndicator
                                status={status}
                                index={i}
                                size={size}
                                variant={variant}
                                onClick={() => handleClick(step as TSteps[number])}
                                aria-label={`Step ${i + 1}: ${step.title ?? step.id}`}
                                {...restIndicatorProps}
                            />
                            <Container direction="col" align="center" className="text-center max-w-25 w-full">
                                {step.title && (
                                    <Typography
                                        variant={TypographyVariant.SPAN}
                                        {...(titleProps as any)}
                                        className={cn(
                                            stepLabelVariants({ status, size }),
                                            'block text-center w-full',
                                            titleProps?.className,
                                        )}
                                    >
                                        {step.title}
                                    </Typography>
                                )}
                                {step.description && (
                                    <Typography
                                        variant={TypographyVariant.SPAN}
                                        {...(descriptionProps as any)}
                                        className={cn(
                                            'mt-xs-1 hidden text-[10px] text-muted-light dark:text-muted-dark md:block text-center w-full',
                                            descriptionProps?.className,
                                        )}
                                    >
                                        {step.description}
                                    </Typography>
                                )}
                            </Container>
                        </Container>

                        {/* Horizontal connector — in between steps with left and right spacing */}
                        {!isLast && showConnectors && (
                            <StepConnector
                                orientation="horizontal"
                                filled={status === 'completed'}
                                size={size}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </Nav>
    );
}

// ---------------------------------------------------------------------------
// Step
// Wrapper that stamps `data-status` onto any element.
// Use `asChild` to forward to your own element / component.
// ---------------------------------------------------------------------------

/**
 * @component Step
 * Wrapper that stamps `data-status` onto any element.
 * Use `asChild` to forward to your own element / component.
*/

export function Step<TSteps extends Array<StepDefinition>>({
    stepId,
    asChild,
    className,
    children,
    ...props
}: StepProps) {
    const { statusOf } = useStepperContext<TSteps>();
    const status       = statusOf(stepId as TSteps[number]['id']);

    if (asChild) {
        return (
            <Slot
                data-status={status}
                className={cn('group', className)}
                {...props}
            >
                {children}
            </Slot>
        );
    }

    return (
        <Container
            data-status={status}
            className={cn('group', className)}
            {...props}
        >
            {children}
        </Container>
    );
}

/**
 * @component Panel
 * Renders only when its step is active.
 * Accepts a render-prop for access to current step + methods.
*/

export function Panel<TSteps extends Array<StepDefinition>>({
    className,
    children,
    forStep,
    ...props
}: PanelProps<TSteps>) {
    const ctx       = useStepperContext<TSteps>();
    const { current } = ctx;

    if (forStep !== undefined && forStep !== current.id) {return null;}

    return (
        <Container role="tabpanel" aria-live="polite" className={cn('w-full', className)} {...props}>
            {typeof children === 'function'
                ? children({
                    step:    current,
                    methods: ctx as unknown as StepperMethods<TSteps>,
                })
                : children}
        </Container>
    );
}

/**
 * @component Controls
 * Default prev / next / finish buttons, or a custom render-prop.
*/

export function Controls<TSteps extends Array<StepDefinition>>({
    className,
    prevLabel         = 'Back',
    nextLabel         = 'Continue',
    finishLabel       = 'Finish',
    skipLabel         = 'Skip',
    prevButtonProps,
    nextButtonProps,
    finishButtonProps,
    skipButtonProps,
    containerProps,
    onFinish,
    onNext,
    onSkip,
    children,
}: ControlsProps<TSteps>) {
    const ctx                             = useStepperContext<TSteps>();
    const { current, isFirst, isLast, next, prev } = ctx;

    if (children) {
        return (
            <Container direction="row" align="center" className={cn('gap-sm-2', className)} {...containerProps}>
                {children(ctx as unknown as StepperMethods<TSteps>)}
            </Container>
        );
    }

    const isSkippable = Boolean(current.skippable ?? current.skip);
    const activeNextProps = isLast ? (finishButtonProps || nextButtonProps) : nextButtonProps;

    const handleNextClick = async () => {
        if (onNext) {
            await onNext(ctx as unknown as StepperMethods<TSteps>);
        } else {
            next();
        }
    };

    const handleSkip = () => {
        onSkip?.(current);
        next();
    };

    const prevButton = (
        <Button
            type="button"
            variant={prevButtonProps?.variant ?? ButtonVariant.OUTLINE}
            disabled={isFirst}
            onClick={prev}
            className={cn(
                'px-md-2 py-sm-2 text-p font-medium shadow-sm transition-colors',
                prevButtonProps?.className,
            )}
            {...prevButtonProps}
        >
            {prevLabel}
        </Button>
    );

    const nextButton = (
        <Button
            type="button"
            variant={activeNextProps?.variant ?? ButtonVariant.DEFAULT}
            onClick={isLast ? onFinish : handleNextClick}
            className={cn(
                'px-md-2 py-sm-2 text-p font-medium shadow transition-colors',
                activeNextProps?.className,
            )}
            {...activeNextProps}
        >
            {isLast ? finishLabel : nextLabel}
        </Button>
    );

    if (isSkippable) {
        return (
            <Container direction="row" align="center" justify="between" className={cn('gap-sm-2 w-full', className)} {...containerProps}>
                <Button
                    type="button"
                    variant={skipButtonProps?.variant ?? ButtonVariant.GHOST}
                    onClick={handleSkip}
                    className={cn(
                        'px-md-2 py-sm-2 text-p font-medium transition-colors text-muted-dark hover:text-foreground',
                        skipButtonProps?.className,
                    )}
                    {...skipButtonProps}
                >
                    {skipLabel}
                </Button>

                <Container direction="row" align="center" className="gap-sm-2">
                    {prevButton}
                    {nextButton}
                </Container>
            </Container>
        );
    }

    return (
        <Container direction="row" align="center" justify="between" className={cn('gap-sm-2 w-full', className)} {...containerProps}>
            {prevButton}
            {nextButton}
        </Container>
    );
}

/**
 * @component Title
 * Renders the current step's title.
*/

export function Title({
    className,
    variant = TypographyVariant.P,
    ...props
}: TitleProps) {
    const { current } = useStepperContext();
    return (
        <Typography
            variant={variant}
            {...(props as any)}
            className={cn('font-semibold text-foreground-light-shade3 dark:text-foreground-dark-shade3', className)}
        >
            {current.title}
        </Typography>
    );
}

/**
 * @component Description
 * Renders the current step's description.
 */

export function Description({
    className,
    variant = TypographyVariant.P,
    ...props
}: DescriptionProps) {
    const { current } = useStepperContext();
    return (
        <Typography
            variant={variant}
            {...(props as any)}
            className={cn('text-muted-dark', className)}
        >
            {current.description}
        </Typography>
    );
}

// ---------------------------------------------------------------------------
// Progress
// Animated progress bar derived from current step position.
// ---------------------------------------------------------------------------

/**
 * @component Progress
 * Animated progress bar derived from current step position.
 */

export function Progress({ className, containerProps }: ProgressProps) {
    const { currentIndex, steps } = useStepperContext();
    const pct = computeProgress(currentIndex, steps.length);

    return (
        <Container
            title='progressbar'
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
                'h-xs-1 w-full overflow-hidden rounded-full bg-muted-dark',
                className,
            )}
            {...containerProps}
        >
            <Container
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
            />
        </Container>
    );
}

/**
 * @component StepIndicator
 * The numbered / check circle button rendered inside Navigation.
 * Not exported from the public index — use Navigation instead.
 */

export function StepIndicator({
    status,
    size,
    variant,
    index,
    className,
    ...props
}: StepIndicatorProps) {
    return (
        <Button
            type="button"
            className={cn(
                stepIndicatorVariants({ status, size, variant }),
                'cursor-pointer p-0 min-w-0 border-0',
                className,
            )}
            {...props}
        >
            {status === 'completed' ? (
                <Check className={resolveCheckIconSize(size)} />
            ) : (
                <Typography variant={TypographyVariant.SPAN} className={`text-foreground-dark-shade3 dark:text-foreground-light-shade3 `}>{index + 1}</Typography>
            )}
        </Button>
    );
}
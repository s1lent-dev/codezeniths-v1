'use client';
import type * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { ContainerProps } from '@codezeniths/components';
import type { TypographyProps } from '@codezeniths/components';
import type { ButtonProps } from '@codezeniths/components';
import type { stepIndicatorVariants } from './stepper.variants';
import type { StepperMethods } from './stepper.utils';

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export interface StepDefinition {
    id: string;
    title?: string;
    description?: string;
    skippable?: boolean;
    skip?: boolean;
    [key: string]: unknown;
}

export type StepStatus = 'upcoming' | 'active' | 'completed';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperVariant    = 'default' | 'outline' | 'ghost';
export type StepperSize       = 'sm' | 'md' | 'lg';

// Re-export StepperMethods so consumers only need to import from one types file
export type { StepperMethods };

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------

export type StepperContextValue<TSteps extends Array<StepDefinition>> =
  StepperMethods<TSteps> & {
      orientation: StepperOrientation;
      variant:     StepperVariant;
      size:        StepperSize;
  };

// ---------------------------------------------------------------------------
// Component prop types
// ---------------------------------------------------------------------------

export interface ProviderProps<TSteps extends Array<StepDefinition>> {
    initialStep?: TSteps[number]['id'];
    orientation?: StepperOrientation;
    variant?:     StepperVariant;
    size?:        StepperSize;
    className?:   string;
    containerProps?: Partial<ContainerProps>;
    children:
    | React.ReactNode
    | ((props: { methods: StepperMethods<TSteps> }) => React.ReactNode);
}

export type TitleProps = Partial<TypographyProps> & Record<string, any>;

export type DescriptionProps = Partial<TypographyProps> & Record<string, any>;

export interface StepConnectorProps {
    orientation?: 'horizontal' | 'vertical';
    filled?:      boolean;
    className?:   string;
    size?:        'sm' | 'md' | 'lg';
}

export interface NavigationProps<TSteps extends Array<StepDefinition>> {
    className?:        string;
    showConnectors?:   boolean;
    onStepClick?:      (step: TSteps[number]) => void | boolean | Promise<void | boolean>;
    titleProps?:       TitleProps;
    descriptionProps?: DescriptionProps;
    indicatorProps?:   Partial<ButtonProps>;
    containerProps?:   Partial<ContainerProps>;
}

export type StepProps = Omit<ContainerProps, 'asChild'> & React.HTMLAttributes<HTMLDivElement> & {
    stepId:   string;
    asChild?: boolean;
};

export type PanelProps<TSteps extends Array<StepDefinition>> = Omit<ContainerProps, 'children'> & {
    className?: string;
    forStep?:   TSteps[number]['id'];
    children:
    | React.ReactNode
    | ((props: {
        step:    TSteps[number];
        methods: StepperMethods<TSteps>;
    }) => React.ReactNode);
};

export interface ControlsProps<TSteps extends Array<StepDefinition>> {
    className?:         string;
    prevLabel?:         React.ReactNode;
    nextLabel?:         React.ReactNode;
    finishLabel?:       React.ReactNode;
    skipLabel?:         React.ReactNode;
    prevButtonProps?:   Partial<ButtonProps>;
    nextButtonProps?:   Partial<ButtonProps>;
    finishButtonProps?: Partial<ButtonProps>;
    skipButtonProps?:   Partial<ButtonProps>;
    containerProps?:    Partial<ContainerProps>;
    onFinish?:          () => void;
    onNext?:            (methods: StepperMethods<TSteps>) => void | Promise<void>;
    onSkip?:            (step: TSteps[number]) => void;
    children?:          (methods: StepperMethods<TSteps>) => React.ReactNode;
}

export interface ProgressProps {
    className?: string;
    containerProps?: Partial<ContainerProps>;
}

// ---------------------------------------------------------------------------
// StepIndicator internal props
// ---------------------------------------------------------------------------

export type StepIndicatorProps = Omit<ButtonProps, 'variant' | 'size'> & VariantProps<typeof stepIndicatorVariants> & {
    index: number;
    status: StepStatus;
    variant?: StepperVariant;
    size?: StepperSize;
};
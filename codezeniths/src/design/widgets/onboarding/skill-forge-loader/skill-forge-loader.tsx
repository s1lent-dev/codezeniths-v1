'use client';
import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {  Container, Typography, TypographyVariant, TypographyWeight, Spinner, SpinnerVariant, ProgressLoader } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import * as Collapsible from '@radix-ui/react-collapsible';
import { CircleDashed, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkillForgeStepStatus = 'pending' | 'active' | 'done' | 'error';

export interface SkillForgeStep {
  id: string;
  label: string;
  detail?: string;
}

export type SkillForgeLoaderStatus = 'loading' | 'success' | 'error';
export type SkillForgeLoaderVariant = 'list' | 'focus' | 'stack';

export interface SkillForgeLoaderProps {
  steps: SkillForgeStep[];
  currentStepIndex: number;
  status?: SkillForgeLoaderStatus;
  errorMessage?: string;
  overlay?: boolean;
  totalBlocks?: number;
  variant?: SkillForgeLoaderVariant;
  className?: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const PendingIcon = ({ className }: { className?: string }) => (
  <CircleDashed className={cn('w-5 h-5 stroke-[1.75]', className)} />
);

const ActiveIcon = ({ className }: { className?: string }) => (
  <span className={cn('relative flex w-5 h-5 items-center justify-center', className)}>
    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-5 h-5 text-primary!" />
  </span>
);

const DoneIcon = ({ className }: { className?: string }) => (
  <CheckCircle2 className={cn('w-5 h-5 stroke-[1.75]', className)} />
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <XCircle className={cn('w-5 h-5 stroke-[1.75]', className)} />
);

// ---------------------------------------------------------------------------
// Step status derivation
// ---------------------------------------------------------------------------

function getStepStatus(
  index: number,
  currentStepIndex: number,
  status: SkillForgeLoaderStatus
): SkillForgeStepStatus {
  if (status === 'success') return 'done';
  if (status === 'error' && index === currentStepIndex) return 'error';
  if (index < currentStepIndex) return 'done';
  if (index === currentStepIndex) return 'active';
  return 'pending';
}

function getProgressPercentage(
  stepCount: number,
  currentStepIndex: number,
  status: SkillForgeLoaderStatus
): number {
  if (stepCount === 0) return 0;
  if (status === 'success') return 100;
  const raw =
    status === 'error'
      ? currentStepIndex / stepCount
      : (currentStepIndex + 0.5) / stepCount;
  return Math.min(100, Math.max(0, Math.round(raw * 100)));
}

// ---------------------------------------------------------------------------
// Step row
// ---------------------------------------------------------------------------

const StepRow = ({
  step,
  stepStatus,
}: {
  step: SkillForgeStep;
  stepStatus: SkillForgeStepStatus;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{
        opacity: stepStatus === 'pending' ? 0.45 : 1,
        x: 0,
      }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-row justify-center items-start gap-3 py-2 w-full"
    >
      <div className="shrink-0">
        {stepStatus === 'pending' && (
          <PendingIcon className="text-muted-light dark:text-muted-dark" />
        )}
        {stepStatus === 'active' && <ActiveIcon />}
        {stepStatus === 'done' && <DoneIcon className="text-primary dark:text-primary" />}
        {stepStatus === 'error' && <ErrorIcon className="text-destructive" />}
      </div>
      <div className="flex flex-col flex-1">
        <Typography
          variant={TypographyVariant.SPAN}
          className={cn(
            'text-sm transition-colors duration-300',
            stepStatus === 'pending' &&
              'text-muted-light dark:text-muted-dark',
            stepStatus === 'active' && 'text-primary dark:text-primary-shade1 font-medium',
            stepStatus === 'done' && 'text-heading-light-shade1 dark:text-heading-dark-shade1',
            stepStatus === 'error' && 'text-destructive font-medium'
          )}
        >
          {step.label}
        </Typography>
        {stepStatus === 'active' && step.detail && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
          >
            {step.detail}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Focus Variant Collapsible
// ---------------------------------------------------------------------------

const FocusVariantDone = ({
  steps,
  currentStepIndex,
  status,
}: {
  steps: SkillForgeStep[];
  currentStepIndex: number;
  status: SkillForgeLoaderStatus;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <Collapsible.Trigger asChild>
        <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted-light/5 dark:hover:bg-muted-dark/5 transition-colors focus:outline-none text-left">
          <div className="flex items-center gap-3">
            {/* <DoneIcon className="text-primary" /> */}
            <Typography variant={TypographyVariant.SPAN} weight={TypographyWeight.SEMIBOLD} className="text-sm text-foreground-dark-shade3/90 dark:text-foreground-light-shade3/90">
              All steps completed
            </Typography>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-light dark:text-muted-dark cursor-pointer" />
          </motion.div>
        </button>
      </Collapsible.Trigger>
      <AnimatePresence>
        {open && (
          <Collapsible.Content forceMount asChild>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <Container direction="col" gap="1" className="px-4 pb-4 w-full">
                {steps.map((step, index) => (
                  <StepRow
                    key={step.id}
                    step={step}
                    stepStatus={getStepStatus(index, currentStepIndex, status)}
                  />
                ))}
              </Container>
            </motion.div>
          </Collapsible.Content>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
};

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

function SkillForgeLoaderCore({
  steps,
  currentStepIndex,
  status = 'loading',
  errorMessage,
  totalBlocks = 50,
  variant = 'list',
  className,
}: Omit<SkillForgeLoaderProps, 'overlay'>) {
  const progressPercentage = useMemo(
    () => getProgressPercentage(steps.length, currentStepIndex, status),
    [steps.length, currentStepIndex, status]
  );

  const activeStep = steps[currentStepIndex];

  return (
    <Container
      direction="col"
      className={cn('w-full max-w-md gap-6', className)}
    >
      <Container direction="col" className="gap-3 w-full">
        <Container direction="row" justify="between" align="center" className="w-full">
          <Typography
            variant={TypographyVariant.SPAN}
            weight={TypographyWeight.SEMIBOLD}
            className="text-sm tracking-wide text-background-dark-shade3 dark:text-background-light-shade3"
          >
            {status === 'error'
              ? errorMessage ?? `${activeStep?.label ?? 'Something'} failed`
              : status === 'success'
                ? 'Process Complete'
                : `${activeStep?.label ?? 'Working'}...`}
          </Typography>
          <Typography
            variant={TypographyVariant.SPAN}
            weight={TypographyWeight.BOLD}
            className="text-sm text-heading-light-shade1 dark:text-heading-dark-shade1"
          >
            {progressPercentage}%
          </Typography>
        </Container>
        <ProgressLoader
          totalBlocks={totalBlocks}
          progressPercentage={progressPercentage}
        />
      </Container>

      <Container direction="col" className="w-full relative">
        {variant === 'list' && (
          <Container direction="col" gap="1" className="w-full">
            {steps.map((step, index) => (
              <StepRow
                key={step.id}
                step={step}
                stepStatus={getStepStatus(index, currentStepIndex, status)}
              />
            ))}
          </Container>
        )}

        {variant === 'stack' && (
          <Container direction="col" gap="1" className="w-full rounded-lg bg-background-light-shade1 dark:bg-background-dark-shade1 border border-background-light-shade3 dark:border-background-dark-shade3 px-4 py-2">
            <AnimatePresence>
              {steps.map((step, index) => {
                const isVisible = status === 'success' || index <= currentStepIndex;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <StepRow
                      step={step}
                      stepStatus={getStepStatus(index, currentStepIndex, status)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Container>
        )}

        {variant === 'focus' && (
          <motion.div 
            layout
            className="w-full rounded-lg bg-background-light-shade1 dark:bg-background-dark-shade1 border border-background-light-shade3 dark:border-background-dark-shade3 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success-collapsible"
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <FocusVariantDone
                    steps={steps}
                    currentStepIndex={currentStepIndex}
                    status={status}
                  />
                </motion.div>
              ) : activeStep ? (
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full px-4 py-1"
                >
                  <StepRow
                    step={activeStep}
                    stepStatus={status === 'error' ? 'error' : 'active'}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </Container>
  );
};

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function SkillForgeLoader({
  overlay = false,
  ...props
}: SkillForgeLoaderProps) {
  if (!overlay) {
    return <SkillForgeLoaderCore {...props} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-md bg-background-light/60 dark:bg-background-dark/60 p-4"
      >
        <div className="w-full max-w-md p-6 rounded-2xl bg-background shadow-2xl border border-muted-light/20 dark:border-muted-dark/20">
          <SkillForgeLoaderCore {...props} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};



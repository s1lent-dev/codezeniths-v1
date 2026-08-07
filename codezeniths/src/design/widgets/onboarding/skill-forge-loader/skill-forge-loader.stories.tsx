'use client';
import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SkillForgeLoader, SkillForgeLoaderStatus, SkillForgeStep } from './skill-forge-loader';

const meta = {
  title: 'Components/Feedback/SkillForgeLoader',
  component: SkillForgeLoader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillForgeLoader>;

export default meta;
type Story = StoryObj<typeof meta>;


const RESUME_EXTRACTION_STEPS: SkillForgeStep[] = [
  { id: 'upload', label: 'Fetching Resume' },
  { id: 'parse', label: 'Parsing Resume' },
  { id: 'extract', label: 'Extracting Skills' },
  { id: 'match', label: 'Matching against Taxonomy' },
  { id: 'curate', label: 'Curating skills' },
  { id: 'generate', label: 'Generating insights' },
];

const SimulationWrapper = ({ 
  overlay = false, 
  variant = 'list' 
}: { 
  overlay?: boolean;
  variant?: 'list' | 'focus' | 'stack';
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<SkillForgeLoaderStatus>('loading');

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= RESUME_EXTRACTION_STEPS.length) {
        setStatus('success');
        clearInterval(interval);
      } else {
        setCurrentStep(current);
      }
    }, 2500); // 2.5 seconds per step

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-w-100">
      <SkillForgeLoader
        steps={RESUME_EXTRACTION_STEPS}
        currentStepIndex={currentStep}
        status={status}
        overlay={overlay}
        totalBlocks={50}
        variant={variant}
      />
    </div>
  );
};

export const ListVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper variant="list" />,
};

export const FocusVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper variant="focus" />,
};

export const StackVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper variant="stack" />,
};

export const ListOverlayVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper overlay={true} variant="list" />,
};

export const FocusOverlayVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper overlay={true} variant="focus" />,
};

export const StackOverlayVariant: Story = {
  args: { steps: [], currentStepIndex: 0 },
  render: () => <SimulationWrapper overlay={true} variant="stack" />,
};

export const ErrorState: Story = {
  args: {
    steps: RESUME_EXTRACTION_STEPS,
    currentStepIndex: 2,
    status: 'error',
    errorMessage: 'Failed to extract text from PDF.',
    totalBlocks: 50,
  },
};

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    Code,
    Network,
    Terminal,
    Target,
    Trophy,
    Cpu,
    Sparkles,
    FolderCode,
    Layers,
    BookOpen,
    Users,
    Check,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Badge,
    Button,
    ButtonVariant,
    ButtonSize,
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyColor,
    Container,
    Checkbox,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Step2Values } from '../useCompleteProfileForm';
import { LEARNING_GOAL_OPTIONS, LEARNING_STYLE_OPTIONS } from '../complete-profile.utils';
import { LearningGoal, LearningStyle } from '@codezeniths/schemas/db';

interface Step3Props {
    form: UseFormReturn<Step2Values>;
}

const ICON_MAP: Record<string, any> = {
    Code,
    Network,
    Terminal,
    Target,
    Trophy,
    Cpu,
    Sparkles,
    FolderCode,
    Layers,
    BookOpen,
    Users,
};

// ─────────────────────────────────────────────────────────────
// QuestionCard — Reusable Option Card
// ─────────────────────────────────────────────────────────────

interface QuestionCardOption {
    label: string;
    value: string;
    description: string;
}

interface QuestionCardProps {
    option: QuestionCardOption;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: (value: any) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    option,
    icon: IconComponent,
    isSelected,
    onSelect,
}) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            onClick={() => onSelect(option.value)}
            className={cn(
                "cursor-pointer transition-all duration-300 relative overflow-hidden group border p-4.5 rounded-sm bg-transparent",
                isSelected
                    ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/40"
                    : "bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent"
            )}
        >
            <div className="w-full flex items-center justify-between gap-3.5">
                {/* Left: Icon Avatar */}
                <div className={cn(
                    "p-2.5 rounded-sm transition-colors shrink-0",
                    isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-primary/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                        {option.label}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {option.description}
                    </p>
                </div>

                {/* Right: Pure Visual Square Checkbox Indicator */}
                <div
                    className={cn(
                        "rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none",
                        isSelected
                            ? "bg-primary border-primary text-primary-foreground shadow-xs"
                            : "border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50"
                    )}
                >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>
            </div>
        </Card>
    );
};

// ─────────────────────────────────────────────────────────────
// RenderActiveQuestion — Switch-case sub-step renderer
// ─────────────────────────────────────────────────────────────

interface RenderActiveQuestionProps {
    activeSubStep: 0 | 1;
    currentGoals: LearningGoal[];
    currentStyles: LearningStyle[];
    onToggleGoal: (goal: LearningGoal) => void;
    onToggleStyle: (style: LearningStyle) => void;
    errors: any;
}

const RenderActiveQuestion: React.FC<RenderActiveQuestionProps> = ({
    activeSubStep,
    currentGoals,
    currentStyles,
    onToggleGoal,
    onToggleStyle,
    errors,
}) => {
    switch (activeSubStep) {
        case 0:
            return (
                <div className="space-y-3">
                    <Grid cols={1} className="sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
                        {LEARNING_GOAL_OPTIONS.map((option) => {
                            const IconComponent = (ICON_MAP[option.iconName] || Code) as any;
                            const isSelected = currentGoals.includes(option.value as LearningGoal);
                            return (
                                <QuestionCard
                                    key={option.value}
                                    option={option}
                                    icon={IconComponent}
                                    isSelected={isSelected}
                                    onSelect={onToggleGoal}
                                />
                            );
                        })}
                    </Grid>
                    {errors.learningGoals && (
                        <p className="text-xs text-destructive font-medium">{errors.learningGoals.message}</p>
                    )}
                </div>
            );

        case 1:
            return (
                <div className="space-y-3">
                    <Grid cols={1} className="sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
                        {LEARNING_STYLE_OPTIONS.map((option) => {
                            const IconComponent = (ICON_MAP[option.iconName] || Sparkles) as any;
                            const isSelected = currentStyles.includes(option.value as LearningStyle);
                            return (
                                <QuestionCard
                                    key={option.value}
                                    option={option}
                                    icon={IconComponent}
                                    isSelected={isSelected}
                                    onSelect={onToggleStyle}
                                />
                            );
                        })}
                    </Grid>
                    {errors.learningStyles && (
                        <p className="text-xs text-destructive font-medium">{errors.learningStyles.message}</p>
                    )}
                </div>
            );

        default:
            return null;
    }
};

// ─────────────────────────────────────────────────────────────
// Step3LearningGoals — Main Questionnaire Container
// ─────────────────────────────────────────────────────────────

export const Step3LearningGoals: React.FC<Step3Props> = ({ form }) => {
    const { getValues, setValue, formState: { errors } } = form;

    // Synchronized local state for rock-solid UI reactivity
    const [goals, setGoals] = useState<LearningGoal[]>(() => (getValues('learningGoals') || []) as LearningGoal[]);
    const [styles, setStyles] = useState<LearningStyle[]>(() => (getValues('learningStyles') || []) as LearningStyle[]);

    const [activeSubStep, setActiveSubStep] = useState<0 | 1>(0);

    // Sync state if form resets externally
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.learningGoals && Array.isArray(value.learningGoals)) setGoals(value.learningGoals as LearningGoal[]);
            if (value.learningStyles && Array.isArray(value.learningStyles)) setStyles(value.learningStyles as LearningStyle[]);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const toggleGoal = useCallback((goal: LearningGoal) => {
        const updated = goals.includes(goal)
            ? goals.filter((g) => g !== goal)
            : [...goals, goal];
        setGoals(updated);
        setValue('learningGoals', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [goals, setValue]);

    const toggleStyle = useCallback((style: LearningStyle) => {
        const updated = styles.includes(style)
            ? styles.filter((s) => s !== style)
            : [...styles, style];
        setStyles(updated);
        setValue('learningStyles', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [styles, setValue]);

    return (
        <Container direction="col" size="none" gap="0" padded={false} centered={false} className="w-full space-y-8 flex flex-col gap-8 p-6">
            {/* 1] Top Non-Clickable Progress Lines & Answered Counter */}
            <div className="w-full space-y-2 mt-12 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Typography as="span" variant={TypographyVariant.SPAN} color={TypographyColor.MUTED} className="text-[0.750rem] font-normal uppercase tracking-wider text-body-light dark:text-body-dark">
                        Questionnaire Progress
                    </Typography>
                    <Typography as="span" variant={TypographyVariant.SPAN} color={TypographyColor.PRIMARY} weight={TypographyWeight.BOLD} className="text-xs text-body-light dark:text-body-dark">
                        {activeSubStep + 1}/2
                    </Typography>
                </div>
                <Grid cols={2} gap="sm" className="w-full">
                    {[0, 1].map((stepIdx) => (
                        <div
                            key={stepIdx}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300 pointer-events-none",
                                stepIdx <= activeSubStep
                                    ? "bg-primary shadow-xs"
                                    : "bg-background-light-shade3/40 dark:bg-background-dark-shade3/40"
                            )}
                        />
                    ))}
                </Grid>
            </div>

            {/* 2] Centered Question Title & Subtext Header */}
            <div className="text-center space-y-2 w-full flex flex-col gap-2 items-center mx-auto py-2 mt-8">
                <Typography as="h3" variant={TypographyVariant.H3} weight={TypographyWeight.BOLD} className="text-2xl sm:text-3xl tracking-tight text-body-light dark:text-body-dark">
                    {activeSubStep === 0 && "What are your primary learning goals?"}
                    {activeSubStep === 1 && "How do you learn best?"}
                </Typography>
                <Typography as="p" variant={TypographyVariant.P} color={TypographyColor.MUTED} className="block w-full max-w-sm text-center text-sm text-muted-light dark:text-muted-dark mx-auto leading-relaxed">
                    {activeSubStep === 0 && "Select all that apply to personalize your practice tracks and recommended challenges."}
                    {activeSubStep === 1 && "Choose your preferred learning experience and problem format."}
                </Typography>
            </div>

            {/* 3] Main Question Content Section */}
            <RenderActiveQuestion
                activeSubStep={activeSubStep}
                currentGoals={goals}
                currentStyles={styles}
                onToggleGoal={toggleGoal}
                onToggleStyle={toggleStyle}
                errors={errors}
            />

            {/* Bottom Sub-flow Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                {activeSubStep > 0 ? (
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.DEFAULT}
                        onClick={() => setActiveSubStep((prev) => (prev - 1) as 0 | 1)}
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                        className="rounded-sm text-xs font-semibold"
                    >
                        Previous Question
                    </Button>
                ) : (
                    <div />
                )}

                {activeSubStep < 1 ? (
                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.DEFAULT}
                        onClick={() => setActiveSubStep((prev) => (prev + 1) as 0 | 1)}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                        className="rounded-sm text-xs font-semibold shadow-xs"
                    >
                        Next Question
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-primary stroke-3" />
                        Questionnaire complete! Click &quot;Continue&quot; below to proceed.
                    </span>
                )}
            </div>
        </Container>
    );
};



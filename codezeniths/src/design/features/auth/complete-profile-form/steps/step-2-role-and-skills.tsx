'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    GraduationCap,
    Briefcase,
    BookOpen,
    Building2,
    User as UserIcon,
    Plus,
    X,
    Search,
    Target,
    Users,
    Layers,
    Zap,
    BrainCircuit,
    Award,
    Sparkles,
    Check,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Input,
    Label,
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
    FloatingLabelInput,
    ButtonEffect,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { FileInput } from '@codezeniths/widgets';
import { cn } from '@codezeniths/design/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/design/modules/overlay/dialog/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/design/components/inputs/select/select';
import { skillQueryService } from '@/lib/tanstack/services/skill.query-service';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { SkillForgeLoader, SkillForgeStep, SkillForgeLoaderStatus } from '@codezeniths/widgets';
import { Step1Values } from '../useCompleteProfileForm';
import { USER_TYPE_OPTIONS, EXPERIENCE_LEVEL_OPTIONS } from '../complete-profile.utils';

interface Step2Props {
    form: UseFormReturn<Step1Values>;
    isUploadingResume?: boolean;
    resumeUploadProgress?: number;
    onResumeUpload?: (file: File) => void;
    onPauseResumeUpload?: () => void;
    onResumeResumeUpload?: () => void;
    onResumeRemove?: () => void;
    isExtractingSkills?: boolean;
    resumeUploadCount?: number;
    extractedResumeKeys?: string[];
    onExtractResumeSkills?: (jobId?: string) => Promise<void>;
    createSkillMutation: any;
    modules: any[];
}

const ROLE_ICON_MAP: Record<string, any> = {
    GraduationCap,
    Briefcase,
    Target,
    BookOpen,
    Users,
    Building2,
    Layers,
    User: UserIcon,
};

const EXP_ICON_MAP: Record<string, any> = {
    student: GraduationCap,
    early_career: Zap,
    mid_career: BrainCircuit,
    senior: Award,
};

const RESUME_EXTRACTION_STEPS: SkillForgeStep[] = [
    { id: 'fetch', label: 'Fetching Resume' },
    { id: 'parse', label: 'Parsing Document' },
    { id: 'extract', label: 'AI Extracting Skills' },
    { id: 'match', label: 'Matching against Taxonomy' },
    { id: 'curate', label: 'Curating skills' },
    { id: 'generate', label: 'Generating insights' },
];

const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg";

// ─────────────────────────────────────────────────────────────
// QuestionCard — Reusable Option Card (Questions 1 & 2)
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
    onSelect: (value: string) => void;
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
                        ? "bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                        : "bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                        {option.label}
                    </h4>
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                        {option.description}
                    </p>
                </div>

                {/* Right: Pure Visual Square Checkbox Indicator */}
                <div
                    className={cn(
                        "rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none",
                        isSelected
                            ? "bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
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
    activeSubStep: 0 | 1 | 2;
    currentUserType: string;
    currentExperience: string;
    currentSkills: string[];
    currentResume: string | null;
    isUploadingResume?: boolean;
    resumeUploadProgress?: number;
    onResumeUpload?: (file: File) => void;
    onPauseResumeUpload?: () => void;
    onResumeResumeUpload?: () => void;
    onResumeRemove?: () => void;
    isExtractingSkills?: boolean;
    resumeUploadCount?: number;
    extractedResumeKeys?: string[];
    onExtractResumeSkills?: () => void;
    skillSearchQuery: string;
    setSkillSearchQuery: (query: string) => void;
    filteredSkills: { id: string; title: string }[];
    handleAddSkill: (skill: string) => void;
    handleRemoveSkill: (skill: string) => void;
    handleKeyDownAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSelectRole: (role: string) => void;
    onSelectExperience: (exp: string) => void;
    errors: any;
}

const RenderActiveQuestion: React.FC<RenderActiveQuestionProps> = ({
    activeSubStep,
    currentUserType,
    currentExperience,
    currentSkills,
    currentResume,
    isUploadingResume,
    resumeUploadProgress,
    onResumeUpload,
    onPauseResumeUpload,
    onResumeResumeUpload,
    onResumeRemove,
    isExtractingSkills,
    resumeUploadCount = 0,
    extractedResumeKeys = [],
    onExtractResumeSkills,
    skillSearchQuery,
    setSkillSearchQuery,
    filteredSkills,
    handleAddSkill,
    handleRemoveSkill,
    handleKeyDownAdd,
    onSelectRole,
    onSelectExperience,
    errors,
}) => {
    switch (activeSubStep) {
        case 0:
            return (
                <Grid cols={1} className="sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
                    {USER_TYPE_OPTIONS.map((option) => {
                        const IconComponent = (ROLE_ICON_MAP[option.iconName] || UserIcon) as any;
                        const isSelected = currentUserType === option.value;
                        return (
                            <QuestionCard
                                key={option.value}
                                option={option}
                                icon={IconComponent}
                                isSelected={isSelected}
                                onSelect={onSelectRole}
                            />
                        );
                    })}
                </Grid>
            );

        case 1:
            return (
                <Grid cols={1} className="sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
                    {EXPERIENCE_LEVEL_OPTIONS.map((option) => {
                        const ExpIcon = (EXP_ICON_MAP[option.value] || Sparkles) as any;
                        const isSelected = currentExperience === option.value;
                        return (
                            <QuestionCard
                                key={option.value}
                                option={option}
                                icon={ExpIcon}
                                isSelected={isSelected}
                                onSelect={onSelectExperience}
                            />
                        );
                    })}
                </Grid>
            );

        case 2:
            return (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                    {/* Resume Upload Input */}
                    <div className="w-full">
                        {resumeUploadCount >= 3 ? (
                            <div className="p-8 border border-dashed border-warning/50 bg-warning/5 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                                <AlertCircle className="w-8 h-8 text-warning" />
                                <p className="text-sm font-semibold text-warning">Session Upload Limit Reached</p>
                                <p className="text-xs text-body-light dark:text-body-dark">You have reached the maximum of 3 resume uploads for this session. Please proceed with manually editing your skills below.</p>
                            </div>
                        ) : (
                            <FileInput
                                value={currentResume}
                                onChange={(file, previewUrl) => {
                                    if (!file && !previewUrl) onResumeRemove?.();
                                }}
                                onFileUpload={onResumeUpload}
                                onPauseUpload={onPauseResumeUpload}
                                onResumeUpload={onResumeResumeUpload}
                                uploadProgress={resumeUploadProgress}
                                isUploading={isUploadingResume}
                                title="Resume / CV (Optional)"
                                description="Upload your resume or CV (PDF format up to 5MB)"
                                accept="application/pdf, .pdf"
                                allowedExtensionsLabel="Supports: PDF (Max 5MB)"
                                showFooter={false}
                            />
                        )}
                    </div>

                    {/* AI Skill Extraction Card */}
                    {currentResume && (() => {
                        const isSkillsFull = currentSkills.length >= 15;
                        
                        let resumeKeyToCheck = currentResume;
                        if (currentResume.includes('media/')) {
                            const match = currentResume.match(/(media\/[^?]+)/);
                            if (match) resumeKeyToCheck = match[1];
                        }
                        
                        const hasAlreadyExtracted = extractedResumeKeys.includes(resumeKeyToCheck);
                        const isDisabled = isSkillsFull || hasAlreadyExtracted || isExtractingSkills;

                        return (
                            <div className="py-6 px-4 border border-primary/20 bg-primary/5 rounded-xl flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'p-2.5 rounded-lg',
                                        hasAlreadyExtracted ? 'bg-success/15 text-success' :
                                        isSkillsFull ? 'bg-warning/15 text-warning' :
                                        'bg-primary/15 text-primary'
                                    )}>
                                        {hasAlreadyExtracted ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : isSkillsFull ? (
                                            <AlertCircle className="w-5 h-5" />
                                        ) : (
                                            <Sparkles className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-body-light dark:text-body-dark">
                                            {hasAlreadyExtracted
                                                ? 'Skills Extracted from Resume'
                                                : isSkillsFull
                                                ? 'Skill Capacity Full (15/15)'
                                                : 'Auto-Extract Skills with AI'}
                                        </p>
                                        <p className="text-xs text-body-light dark:text-body-dark">
                                            {hasAlreadyExtracted
                                                ? 'Skills have been extracted and added to your list below.'
                                                : isSkillsFull
                                                ? 'You already have 15 skills selected. Remove some manually to allow AI extraction.'
                                                : `Let AI scan your PDF resume to auto-fill your remaining skills.`}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    disabled={isDisabled}
                                    variant={hasAlreadyExtracted ? ButtonVariant.OUTLINE : ButtonVariant.DEFAULT}
                                    effect={(!isExtractingSkills && !isSkillsFull && !hasAlreadyExtracted) ? ButtonEffect.PULSATING : undefined}
                                    {...((!isExtractingSkills && !isSkillsFull && !hasAlreadyExtracted) ? {
                                        pulseColor: 'rgb(99 102 241 / 0.25)',
                                        pulseDuration: '1.5s'
                                    } : {})}
                                    size={ButtonSize.DEFAULT}
                                    onClick={onExtractResumeSkills}
                                    className="text-xs font-semibold"
                                >
                                    {isExtractingSkills ? (
                                        <>
                                            <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
                                            Analyzing Resume & Matching Skills...
                                        </>
                                    ) : hasAlreadyExtracted ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Skills Extracted
                                        </>
                                    ) : isSkillsFull ? (
                                        <>
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Remove skills to extract more
                                        </>
                                    ) : (
                                        <>
                                            <BrainCircuit className="w-4 h-4 mr-2" />
                                            Extract & Auto-Fill Skills
                                        </>
                                    )}
                                </Button>
                            </div>
                        );
                    })()}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                                Skills & Tech Stack <span className="text-destructive">*</span>
                            </Label>
                            <span className="text-xs text-body-light dark:text-body-dark">
                                {currentSkills.length} / 15 selected
                            </span>
                        </div>

                        {/* Search / Add Input */}
                        <div className="w-full relative">
                            <FloatingLabelInput
                                id="skillSearch"
                                label="Search or type a skill (e.g. C++, React, Python)..."
                                value={skillSearchQuery}
                                onChange={(e) => setSkillSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDownAdd}
                                className="pr-10!"
                            />
                            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-body-light dark:text-body-dark pointer-events-none z-10 cursor-pointer" />
                        </div>

                        {/* Dropdown Suggestions */}
                        {skillSearchQuery.trim().length > 0 && (
                            <div className="p-2 border border-border rounded-sm bg-background shadow-lg max-h-40 overflow-y-auto space-y-1 z-20">
                                {filteredSkills.length > 0 ? (
                                    filteredSkills.slice(0, 8).map((skill: { id: string; title: string }) => (
                                        <button
                                            key={skill.id || skill.title}
                                            type="button"
                                            onClick={() => handleAddSkill(skill.title)}
                                            className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-muted text-xs flex items-center justify-between cursor-pointer"
                                        >
                                            <span>{skill.title}</span>
                                            <Plus className="w-3.5 h-3.5 text-body-light dark:text-body-dark" />
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleAddSkill(skillSearchQuery.trim())}
                                        className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-muted text-xs text-primary font-medium flex items-center justify-between cursor-pointer"
                                    >
                                        <span>Add custom skill &quot;{skillSearchQuery.trim()}&quot;</span>
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Selected Skills Badge List */}
                        <div className="flex flex-wrap content-start gap-2 min-h-24 p-4 border-2 border-dashed border-primary/30 dark:border-primary/40 bg-background-light/30 dark:bg-background-dark/30 hover:border-primary/50 transition-colors rounded-xl">
                            {currentSkills.length > 0 ? (
                                currentSkills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        className="px-3 py-1 bg-primary/15 text-foreground hover:bg-primary/20 border border-primary/30 flex items-center gap-1.5 text-xs rounded-sm font-medium cursor-pointer"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="hover:text-destructive transition-colors cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-xs text-body-light dark:text-body-dark self-center">
                                    No skills added yet. Search and select skills above.
                                </p>
                            )}
                        </div>
                        {errors.skills && (
                            <p className="text-xs text-destructive font-medium">{errors.skills.message}</p>
                        )}
                    </div>
                </div>
            );

        default:
            return null;
    }
};

// ─────────────────────────────────────────────────────────────
// Step2RoleAndSkills — Main Questionnaire Container
// ─────────────────────────────────────────────────────────────

export const Step2RoleAndSkills: React.FC<Step2Props> = ({
    form,
    isUploadingResume,
    resumeUploadProgress,
    onResumeUpload,
    onPauseResumeUpload,
    onResumeResumeUpload,
    onResumeRemove,
    isExtractingSkills,
    resumeUploadCount,
    extractedResumeKeys,
    onExtractResumeSkills,
    createSkillMutation,
    modules,
}) => {
    const { getValues, setValue, watch, formState: { errors } } = form;

    // Synchronized local state for rock-solid UI reactivity
    const [userType, setUserType] = useState<string>(() => getValues('userType') || 'student');
    const [experienceLevel, setExperienceLevel] = useState<string>(() => getValues('experienceLevel') || 'student');
    const [currentSkills, setCurrentSkills] = useState<string[]>(() => getValues('skills') || []);
    const [currentResume, setCurrentResume] = useState<string | null>(() => getValues('resume') || null);

    const [activeSubStep, setActiveSubStep] = useState<0 | 1 | 2>(0);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const { data: dbSkills = [] } = skillQueryService.getSkills();

    // Redis Polling Job Tracking State
    const [extractionJobId, setExtractionJobId] = useState<string | null>(null);
    const [loaderStatus, setLoaderStatus] = useState<SkillForgeLoaderStatus | 'idle'>('idle');
    const [loaderErrorMessage, setLoaderErrorMessage] = useState('');

    const { data: progressData } = userQueryService.getExtractionProgress(
        { jobId: extractionJobId || '' },
        { enabled: !!extractionJobId, refetchInterval: 500 }
    );

    const currentStepIndex = useMemo(() => {
        if (!progressData?.step) return 0;
        const idx = RESUME_EXTRACTION_STEPS.findIndex(s => s.id === progressData.step);
        return idx >= 0 ? idx : 0;
    }, [progressData?.step]);

    const handleExtractClick = async () => {
        if (!onExtractResumeSkills) return;
        const jobId = crypto.randomUUID();
        setExtractionJobId(jobId);
        setLoaderStatus('loading');
        
        try {
            await onExtractResumeSkills(jobId);
            setLoaderStatus('success');
            setTimeout(() => {
                setExtractionJobId(null);
                setLoaderStatus('idle');
            }, 1500);
        } catch (error: any) {
            setLoaderStatus('error');
            setLoaderErrorMessage(error?.message || 'Failed to extract skills.');
            setTimeout(() => {
                setExtractionJobId(null);
                setLoaderStatus('idle');
            }, 3000);
        }
    };

    // Sync state if form resets externally
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.userType && value.userType !== userType) setUserType(value.userType);
            if (value.experienceLevel && value.experienceLevel !== experienceLevel) setExperienceLevel(value.experienceLevel);
            if (value.skills && Array.isArray(value.skills)) setCurrentSkills(value.skills);
            if (value.resume !== undefined) setCurrentResume(value.resume ?? null);
        });
        return () => subscription.unsubscribe();
    }, [form, userType, experienceLevel]);

    // Filter seeded database skills based on search query
    const filteredSkills = useMemo(() => dbSkills.filter(
        (skill: { title: string }) =>
            skill.title.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
            !currentSkills.includes(skill.title)
    ), [dbSkills, skillSearchQuery, currentSkills]);

    // Custom Skill Modal State
    const [isCustomSkillModalOpen, setIsCustomSkillModalOpen] = useState(false);
    const [pendingCustomSkillName, setPendingCustomSkillName] = useState('');
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    const handleAddSkill = useCallback((skillName: string) => {
        if (currentSkills.length >= 15) return;
        
        // Check if skill exists in dbSkills (case-insensitive)
        const existsInDb = dbSkills.some((s: { title: string }) => s.title.toLowerCase() === skillName.toLowerCase());
        
        if (existsInDb) {
            // Standard skill - add directly
            if (!currentSkills.includes(skillName)) {
                const updated = [...currentSkills, skillName];
                setCurrentSkills(updated);
                setValue('skills', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
            setSkillSearchQuery('');
        } else {
            // Custom skill - open modal
            setPendingCustomSkillName(skillName);
            setIsCustomSkillModalOpen(true);
            setSelectedModuleId(null);
        }
    }, [currentSkills, setValue, dbSkills]);

    const handleCreateCustomSkill = useCallback(async () => {
        if (!selectedModuleId || !pendingCustomSkillName) return;
        
        try {
            const newSkill = await createSkillMutation.mutateAsync({
                title: pendingCustomSkillName,
                moduleId: selectedModuleId,
            });
            
            // Add the newly created skill
            const updated = [...currentSkills, newSkill.title];
            setCurrentSkills(updated);
            setValue('skills', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            
            // Cleanup
            setSkillSearchQuery('');
            setIsCustomSkillModalOpen(false);
            setPendingCustomSkillName('');
            setSelectedModuleId(null);
        } catch (error) {
            // Error is handled by mutation globally or can be toasted here
            console.error('Failed to create custom skill', error);
        }
    }, [selectedModuleId, pendingCustomSkillName, createSkillMutation, currentSkills, setValue]);

    const handleRemoveSkill = useCallback((skillName: string) => {
        const updated = currentSkills.filter((s) => s !== skillName);
        setCurrentSkills(updated);
        setValue('skills', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [currentSkills, setValue]);

    const handleKeyDownAdd = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = skillSearchQuery.trim();
            if (trimmed.length > 0) {
                handleAddSkill(trimmed);
            }
        }
    }, [skillSearchQuery, handleAddSkill]);

    const onSelectRole = useCallback((role: string) => {
        setUserType(role);
        setValue('userType', role as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    const onSelectExperience = useCallback((exp: string) => {
        setExperienceLevel(exp);
        setValue('experienceLevel', exp as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    return (
        <Container direction="col" size="none" gap="0" padded={false} centered={false} className="w-full space-y-8 flex flex-col gap-8 p-6">
            {/* 1] Top Non-Clickable Progress Lines & Answered Counter */}
            <div className="w-full space-y-2 mt-12 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Typography as="span" variant={TypographyVariant.SPAN} color={TypographyColor.MUTED} className="text-[0.750rem] font-normal uppercase tracking-wider text-body-light dark:text-body-dark">
                        Questionnaire Progress
                    </Typography>
                    <Typography as="span" variant={TypographyVariant.SPAN} color={TypographyColor.PRIMARY} weight={TypographyWeight.BOLD} className="text-xs text-body-light dark:text-body-dark">
                        {activeSubStep + 1}/3
                    </Typography>
                </div>
                <Grid cols={3} gap="sm" className="w-full">
                    {[0, 1, 2].map((stepIdx) => (
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
            <div className="text-center space-y-2 mx-auto py-2 mt-8 w-full flex flex-col gap-2 items-center">
                <Typography as="h3" variant={TypographyVariant.H3} weight={TypographyWeight.BOLD} className="text-2xl sm:text-3xl tracking-tight text-body-light dark:text-body-dark">
                    {activeSubStep === 0 && "Who are you using CodeZeniths as?"}
                    {activeSubStep === 1 && "What is your current experience level?"}
                    {activeSubStep === 2 && "Skills & Tech Stack"}
                </Typography>
                <Typography as="p" variant={TypographyVariant.P} color={TypographyColor.MUTED} className="block w-full max-w-sm text-center text-sm text-muted-light dark:text-muted-dark mx-auto leading-relaxed">
                    {activeSubStep === 0 && "Choose the developer persona that best describes your current focus."}
                    {activeSubStep === 1 && "This helps us calibrate problem difficulty and customize your learning path."}
                    {activeSubStep === 2 && "Search and select the technologies you work with or want to master."}
                </Typography>
            </div>

            {/* 3] Main Question Content Section */}
            <RenderActiveQuestion
                activeSubStep={activeSubStep}
                currentUserType={userType}
                currentExperience={experienceLevel}
                currentSkills={currentSkills}
                currentResume={currentResume}
                isUploadingResume={isUploadingResume}
                resumeUploadProgress={resumeUploadProgress}
                onResumeUpload={onResumeUpload}
                onPauseResumeUpload={onPauseResumeUpload}
                onResumeResumeUpload={onResumeResumeUpload}
                onResumeRemove={onResumeRemove}
                isExtractingSkills={isExtractingSkills}
                resumeUploadCount={resumeUploadCount}
                extractedResumeKeys={extractedResumeKeys}
                onExtractResumeSkills={handleExtractClick}
                skillSearchQuery={skillSearchQuery}
                setSkillSearchQuery={setSkillSearchQuery}
                filteredSkills={filteredSkills}
                handleAddSkill={handleAddSkill}
                handleRemoveSkill={handleRemoveSkill}
                handleKeyDownAdd={handleKeyDownAdd}
                onSelectRole={onSelectRole}
                onSelectExperience={onSelectExperience}
                errors={errors}
            />

            {/* Bottom Sub-flow Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                {activeSubStep > 0 ? (
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.DEFAULT}
                        onClick={() => setActiveSubStep((prev) => (prev - 1) as 0 | 1 | 2)}
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                        className="rounded-sm text-xs font-semibold"
                    >
                        Previous Question
                    </Button>
                ) : (
                    <div />
                )}

                {activeSubStep < 2 ? (
                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.DEFAULT}
                        onClick={() => setActiveSubStep((prev) => (prev + 1) as 0 | 1 | 2)}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                        className="rounded-sm text-xs font-semibold shadow-xs"
                    >
                        Next Question
                    </Button>
                ) : (
                    <span className="text-xs text-body-light dark:text-body-dark font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-primary stroke-3" />
                        Questionnaire complete! Click &quot;Continue&quot; below to proceed.
                    </span>
                )}
            </div>

            {/* Custom Skill Modal */}
            <Dialog open={isCustomSkillModalOpen} onOpenChange={setIsCustomSkillModalOpen}>
                <DialogContent className="sm:max-w-md bg-background-light dark:bg-background-dark border border-secondary">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Add Custom Skill</DialogTitle>
                        <DialogDescription>
                            Which category does <strong>&quot;{pendingCustomSkillName}&quot;</strong> belong to?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="module-select" className="text-sm font-medium">Category Module <span className="text-destructive">*</span></Label>
                            <Select
                                value={selectedModuleId || ''}
                                onValueChange={setSelectedModuleId}
                            >
                                <SelectTrigger className="w-full h-10 border border-secondary rounded-sm">
                                    <SelectValue placeholder="Select a category..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background-light dark:bg-background-dark border-secondary">
                                    {modules.map((m) => (
                                        <SelectItem key={m.id} value={m.id} className="text-sm">
                                            {m.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            onClick={() => setIsCustomSkillModalOpen(false)}
                            disabled={createSkillMutation.isPending}
                            className="rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={ButtonVariant.DEFAULT}
                            onClick={handleCreateCustomSkill}
                            disabled={!selectedModuleId || createSkillMutation.isPending}
                            isLoading={createSkillMutation.isPending}
                            className="rounded-sm"
                        >
                            Add Skill
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Extraction Loader Overlay Modal */}
            <Dialog open={!!extractionJobId} onOpenChange={() => {}}>
                <DialogContent showCloseButton={false} className="sm:max-w-xl bg-transparent border-none shadow-none p-0 flex items-center justify-center [&>button]:hidden">
                    <SkillForgeLoader
                        steps={RESUME_EXTRACTION_STEPS}
                        currentStepIndex={currentStepIndex}
                        status={loaderStatus === 'idle' ? 'loading' : loaderStatus}
                        errorMessage={loaderErrorMessage}
                        overlay={false}
                        totalBlocks={50}
                        variant="stack"
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

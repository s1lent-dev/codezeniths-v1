'use client';

import React from 'react';
import { defineStepper } from '@/design/modules/navigation/stepper';
import { Card, CardHeader, CardContent, CardVariant } from '@codezeniths/modules';
import {
    ButtonEffect,
    ButtonVariant,
    Spinner,
    SpinnerVariant,
    Typography,
    TypographyVariant,
    Separator,
} from '@codezeniths/components';
import { ArrowRight, Check } from 'lucide-react';
import { useCompleteProfileForm } from './useCompleteProfileForm';
import { Step1PersonalDetails } from './steps/step-1-personal-details';
import { Step2RoleAndSkills } from './steps/step-2-role-and-skills';
import { Step3LearningGoals } from './steps/step-3-learning-goals';
import { Step4Preferences } from './steps/step-4-preferences';
import type { StepDefinition } from '@/design/modules/navigation/stepper';

const STEP_DEFINITIONS: [StepDefinition, StepDefinition, StepDefinition, StepDefinition] = [
    { id: 'personal', title: 'Personal Details', description: 'Photo, name & location', skippable: false },
    { id: 'role', title: 'Role & Stack', description: 'Experience & skills', skippable: false },
    { id: 'goals', title: 'Goals & Style', description: 'Learning preferences', skippable: true },
    { id: 'preferences', title: 'Settings', description: 'Theme & notifications', skippable: true },
];

const { Stepper } = defineStepper(...STEP_DEFINITIONS);

export const CompleteProfileForm: React.FC = () => {
    const {
        step0Form,
        step1Form,
        step2Form,
        step3Form,
        onboardingProfile,
        hasExistingPhoneNumber,
        isLoadingSettings,
        isUploadingImage,
        isUploadingResume,
        resumeUploadProgress,
        isExtractingSkills,
        resumeUploadCount,
        extractedResumeKeys,
        phoneCheck,
        isCheckingPhone,
        isSubmittingStep0,
        isSubmittingStep1,
        isSubmittingStep2,
        isSubmittingStep3,
        isSubmitting,
        handleAvatarUpload,
        handleAvatarRemove,
        handleResumeUpload,
        handleResumePause,
        handleResumeResume,
        handleResumeRemove,
        handleExtractResumeSkills,
        validateAndSubmitStep,
        createSkillMutation,
        modules,
    } = useCompleteProfileForm();

    if (isLoadingSettings) {
        return (
            <Card variant={CardVariant.FLAT} className="w-[95%] md:w-[80%] sm:w-[75%] max-w-6xl p-8 md:p-16 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none">
                <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-8 h-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading onboarding profile...</p>
                </div>
            </Card>
        );
    }

    const maxAllowedStep = onboardingProfile?.onBoardingStep ?? 0;

    return (
        <Card variant={CardVariant.FLAT} className="w-[95%] md:w-[80%] sm:w-[75%] max-w-6xl p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none">
            <CardHeader className="flex-col items-center justify-center mt-8 mb-8 p-0 border-none shrink-0 w-full space-y-2">
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-3xl sm:text-4xl lg:text-5xl text-body-light dark:text-body-dark text-center"
                >
                    Complete Your Profile
                </Typography>
                <Typography
                    variant={TypographyVariant.SPAN}
                    className="block w-full max-w-sm text-center text-sm text-muted-light dark:text-muted-dark mx-auto"
                >
                    Set up your developer identity, skills, and preferences to customize your experience.
                </Typography>
            </CardHeader>
            <CardContent className="p-0 w-full flex flex-col mt-12 gap-8">
                <Stepper.Provider initialStep={STEP_DEFINITIONS[Math.min(maxAllowedStep, 3)].id}>
                    {({ methods }) => (
                        <div className="w-full flex flex-col gap-8">
                            {/* Stepper Navigation */}
                            <div className="w-full pb-2">
                                <Stepper.Navigation
                                    onStepClick={async (targetStep) => {
                                        const targetIdx = STEP_DEFINITIONS.findIndex((s) => s.id === targetStep.id);
                                        const currentIdx = methods.currentIndex;

                                        // Disallow jumping ahead beyond user.onBoardingStep
                                        if (targetIdx > maxAllowedStep) {
                                            return false;
                                        }

                                        if (targetIdx > currentIdx) {
                                            const success = await validateAndSubmitStep(currentIdx);
                                            if (!success) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    }}
                                />
                            </div>

                            {/* Main Form Body */}
                            <div className="w-full flex flex-col gap-8">
                                {/* Step Panel Content */}
                                <div className="w-full min-h-85 flex items-center justify-center">
                                    <Stepper.Panel forStep="personal">
                                        <Step1PersonalDetails
                                            form={step0Form}
                                            hasExistingPhoneNumber={hasExistingPhoneNumber}
                                            isUploadingImage={isUploadingImage}
                                            onAvatarUpload={handleAvatarUpload}
                                            onAvatarRemove={handleAvatarRemove}
                                            phoneCheck={phoneCheck}
                                            isCheckingPhone={isCheckingPhone}
                                        />
                                    </Stepper.Panel>
                                    <Stepper.Panel forStep="role">
                                        <Step2RoleAndSkills
                                            form={step1Form}
                                            isUploadingResume={isUploadingResume}
                                            resumeUploadProgress={resumeUploadProgress}
                                            onResumeUpload={handleResumeUpload}
                                            onPauseResumeUpload={handleResumePause}
                                            onResumeResumeUpload={handleResumeResume}
                                            onResumeRemove={handleResumeRemove}
                                            isExtractingSkills={isExtractingSkills}
                                            resumeUploadCount={resumeUploadCount}
                                            extractedResumeKeys={extractedResumeKeys}
                                            onExtractResumeSkills={handleExtractResumeSkills}
                                            createSkillMutation={createSkillMutation}
                                            modules={modules}
                                        />
                                    </Stepper.Panel>
                                    <Stepper.Panel forStep="goals">
                                        <Step3LearningGoals form={step2Form} />
                                    </Stepper.Panel>
                                    <Stepper.Panel forStep="preferences">
                                        <Step4Preferences form={step3Form} />
                                    </Stepper.Panel>
                                </div>

                                {/* Divider */}
                                <Separator className="w-full bg-secondary-shade2/25 dark:bg-secondary-shade2/25" />

                                {/* Stepper Controls */}
                                <div className="w-full pt-2">
                                    <Stepper.Controls
                                        nextLabel="Continue"
                                        finishLabel={
                                            <span className="flex items-center gap-2">
                                                Complete Setup
                                                <Check className="w-4 h-4" />
                                            </span>
                                        }
                                        nextButtonProps={{
                                            disabled: isUploadingImage || isUploadingResume || isSubmitting,
                                            isLoading: methods.currentIndex === 0 ? isSubmittingStep0 : methods.currentIndex === 1 ? isSubmittingStep1 : isSubmittingStep2,
                                            variant: ButtonVariant.DEFAULT,
                                            rightIcon: <ArrowRight className="w-4 h-4" />,
                                        }}
                                        finishButtonProps={{
                                            disabled: isSubmitting,
                                            isLoading: isSubmittingStep3,
                                            variant: ButtonVariant.DEFAULT,
                                        }}
                                        prevButtonProps={{
                                            disabled: isSubmitting,
                                        }}
                                        onNext={async (m) => {
                                            const success = await validateAndSubmitStep(m.currentIndex);
                                            if (success) {
                                                m.next();
                                            }
                                        }}
                                        onFinish={async () => {
                                            await validateAndSubmitStep(methods.currentIndex);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Stepper.Provider>
            </CardContent>
        </Card>
    );
};

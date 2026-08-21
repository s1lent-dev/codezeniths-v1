'use client';

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    Button,
    ButtonVariant,
    ButtonSize,
    ScrollArea,
} from '@codezeniths/components';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@codezeniths/modules';
import { useEditProfileForm } from './useEditProfileForm';
import { ProfileEditForm } from './profile-edit-form';
import { UserProfileDetails } from './profile-edit-form.utils';
import { Save } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface ProfileEditSheetProps {
    isOpen: boolean;
    onClose: () => void;
    profile?: UserProfileDetails | null;
}

export const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({
    isOpen,
    onClose,
    profile,
}) => {
    const {
        form,
        isSaving,
        isUploadingAvatar,
        isUploadingResume,
        resumeUploadProgress,
        availableSkills,
        isDiscardDialogOpen,
        handleAvatarUpload,
        handleAvatarRemove,
        handleResumeUpload,
        handleResumeRemove,
        onSubmit,
        handleDiscard,
        confirmDiscard,
        cancelDiscard,
    } = useEditProfileForm({
        profile,
        isOpen,
        onClose,
    });

    const isBusy = isSaving || isUploadingAvatar || isUploadingResume;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    handleDiscard();
                }
            }}>
                <SheetContent
                    side="right"
                    onPointerDownOutside={(e) => {
                        e.preventDefault();
                    }}
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                    className="fixed inset-y-0 right-0 z-100 w-full data-[side=right]:sm:max-w-4xl data-[side=right]:md:max-w-5xl data-[side=right]:lg:max-w-6xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl flex flex-col p-0 bg-background-light dark:bg-background-dark border-l border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xl overflow-hidden"
                >
                    {/* Internal Dimming Scrim Layer when Discard Dialog is active */}
                    {isDiscardDialogOpen && (
                        <div className="absolute inset-0 z-150 bg-black/40 dark:bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-200 pointer-events-auto" />
                    )}

                    {/* Header */}
                    <SheetHeader className="px-8 py-6 sm:px-10 sm:py-6 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1 shrink-0">
                        <SheetTitle className="text-xl font-bold text-heading-light dark:text-heading-dark">
                            Edit Profile Details
                        </SheetTitle>
                        <SheetDescription className="text-xs text-muted-light dark:text-muted-dark mt-1">
                            Update your personal background, bio, skills, and social connections.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Scrollable Form Content with in-house ScrollArea and ScrollBar */}
                    <ScrollArea className="flex-1 w-full">
                        <div className="px-8 py-8 sm:px-10 sm:py-10">
                            <form id="profile-edit-form" onSubmit={onSubmit}>
                                <ProfileEditForm
                                    form={form}
                                    profile={profile}
                                    isUploadingAvatar={isUploadingAvatar}
                                    isUploadingResume={isUploadingResume}
                                    resumeUploadProgress={resumeUploadProgress}
                                    availableSkills={availableSkills}
                                    onAvatarUpload={handleAvatarUpload}
                                    onAvatarRemove={handleAvatarRemove}
                                    onResumeUpload={handleResumeUpload}
                                    onResumeRemove={handleResumeRemove}
                                />
                            </form>
                        </div>
                    </ScrollArea>

                    {/* Sticky Footer */}
                    <SheetFooter className="px-8 py-5 sm:px-10 sm:py-5 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light/95 dark:bg-foreground-dark/95 backdrop-blur-xs flex flex-row items-center justify-end gap-3.5 shrink-0">
                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.DEFAULT}
                            onClick={() => handleDiscard(true)}
                            disabled={isBusy}
                            className="text-xs sm:text-sm font-medium"
                        >
                            Discard
                        </Button>

                        <Button
                            type="submit"
                            form="profile-edit-form"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.DEFAULT}
                            isLoading={isSaving}
                            loadingText="Saving Changes..."
                            disabled={isBusy}
                            leftIcon={<Save className="size-4" />}
                            className="text-xs sm:text-sm font-medium min-w-36"
                        >
                            Save Changes
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Discard Confirmation Dialog */}
            <AlertDialog open={isDiscardDialogOpen} onOpenChange={(open: boolean) => !open && cancelDiscard()}>
                <AlertDialogContent
                    className={cn(
                        'z-200 sm:max-w-md bg-background-light dark:bg-background-dark border border-secondary/25 dark:border-secondary/30 shadow-2xl rounded-xl',
                        'sm:left-[calc(100vw-(min(100vw,56rem)/2))] md:left-[calc(100vw-(min(100vw,64rem)/2))] lg:left-[calc(100vw-(min(100vw,72rem)/2))]'
                    )}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-heading-light dark:text-heading-dark">
                            Discard Unsaved Changes?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                            You have unsaved changes in your profile. Are you sure you want to discard them? Any edits made will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-background-light-shade1/60 dark:bg-background-dark-shade1/60 border-t border-secondary/15 px-4 py-3">
                        <AlertDialogCancel onClick={cancelDiscard} className="text-xs font-medium">
                            Keep Editing
                        </AlertDialogCancel>
                        <Button
                            type="button"
                            variant={ButtonVariant.ERROR}
                            onClick={confirmDiscard}
                            className="text-xs font-medium"
                        >
                            Discard Changes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

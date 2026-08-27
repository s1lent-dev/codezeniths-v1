'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    toast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { problemQueryService } from '@/lib/tanstack';
import {
    NotebookPen,
    ExternalLink,
    Trash2,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import type { ProblemItem } from './problem-row';

export interface ProblemNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    problem: ProblemItem | null;
}

export const ProblemNoteDialog: React.FC<ProblemNoteDialogProps> = ({
    open,
    onOpenChange,
    problem,
}) => {
    const [noteText, setNoteText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // 1. Lazy Query: Fetch problem note ONLY when the dialog is open
    const {
        data: noteData,
        isLoading: isNoteLoading,
    } = problemQueryService.getProblemNote(
        { problemId: problem?.id || '' },
        { enabled: open && Boolean(problem?.id) }
    );

    // 2. Sync fetched note into local editing state
    useEffect(() => {
        if (open && noteData) {
            setNoteText(noteData.notes || '');
        } else if (!open) {
            setNoteText('');
        }
    }, [open, noteData]);

    // Auto-focus textarea when dialog opens and data is ready
    useEffect(() => {
        if (open && !isNoteLoading) {
            const timer = setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open, isNoteLoading]);

    const updateMutation = problemQueryService.updateProblem();

    if (!problem) return null;

    const initialNote = noteData?.notes || '';
    const isDirty = noteText !== initialNote;
    const hasExistingNote = Boolean(initialNote.trim());
    const characterCount = noteText.length;
    const maxCharacters = 5000;

    const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
        if (difficulty === 'medium') return 'Medium';
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    const handleClose = () => {
        if (!isSaving) {
            onOpenChange(false);
        }
    };

    const handleSave = async () => {
        const trimmed = noteText.trim();
        setIsSaving(true);
        try {
            await updateMutation.mutateAsync({
                problemId: problem.id,
                notes: trimmed ? trimmed : null,
            });

            toast.success(
                trimmed ? 'Note Saved' : 'Note Cleared',
                trimmed
                    ? `Your notes for "${problem.title}" have been saved.`
                    : `Notes for "${problem.title}" have been cleared.`
            );
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Save Failed', error?.message || 'Unable to save notes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = async () => {
        setIsSaving(true);
        try {
            await updateMutation.mutateAsync({
                problemId: problem.id,
                notes: null,
            });

            setNoteText('');
            toast.success('Note Removed', `Notes for "${problem.title}" have been removed.`);
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Clear Failed', error?.message || 'Unable to remove note.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ctrl + Enter or Cmd + Enter to quickly save
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isSaving && (isDirty || noteText.trim())) {
                void handleSave();
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent
                onPointerDownOutside={(e) => {
                    if (isSaving) e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    if (isSaving) e.preventDefault();
                }}
                className="sm:max-w-lg md:max-w-xl bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md p-0 overflow-hidden shadow-xl gap-0 z-300"
            >
                <div className="space-y-0">
                    <div className="p-4 sm:p-6 space-y-4">
                        <DialogHeader className="space-y-1.5 pb-0">
                            <div className="flex items-center gap-3.5 pr-8">
                                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                                    <NotebookPen className="size-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-semibold text-heading-light dark:text-heading-dark">
                                        {problem.title}
                                    </DialogTitle>
                                    <div className="flex items-center gap-2 flex-wrap text-xs mt-1">
                                        <span
                                            className={cn(
                                                'text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0',
                                                problem.difficulty === 'hard' && 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
                                                problem.difficulty === 'medium' && 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
                                                problem.difficulty === 'easy' && 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                                            )}
                                        >
                                            {formatDifficulty(problem.difficulty)}
                                        </span>

                                        {(problem.problemUrl || problem.articleUrl) && (
                                            <>
                                                <span className="text-muted-light dark:text-muted-dark text-[10px]">•</span>
                                                <a
                                                    href={problem.problemUrl || problem.articleUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                                                >
                                                    <span>Open Problem</span>
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-2 pt-2 sm:pt-3">
                            {isNoteLoading ? (
                                <div className="h-36 sm:h-48 w-full flex flex-col items-center justify-center gap-2 rounded-sm bg-foreground-light-shade2/50 dark:bg-foreground-dark-shade2/50 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 animate-pulse">
                                    <Loader2 className="size-5 animate-spin text-primary opacity-60" />
                                    <span className="text-xs text-muted-light dark:text-muted-dark">Loading your notes...</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <textarea
                                        ref={textareaRef}
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        maxLength={maxCharacters}
                                        disabled={isSaving}
                                        placeholder="Write your approach, time/space complexity, edge cases, or key insights here..."
                                        className="w-full h-36 sm:h-48 p-3 sm:p-3.5 text-xs sm:text-sm font-sans rounded-sm border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-foreground-dark-shade3 dark:text-foreground-light-shade3 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none shadow-2xs leading-relaxed"
                                    />

                                    <div className="flex items-center justify-between text-[11px] text-muted-light dark:text-muted-dark px-0.5">
                                        <span className="hidden xs:inline-flex items-center gap-1 opacity-75">
                                            <Sparkles className="size-3 text-primary" />
                                            <span>Press <kbd className="font-mono bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 px-1 py-0.2 rounded text-[10px]">Ctrl+Enter</kbd> to save</span>
                                        </span>
                                        <span className={cn('ml-auto font-mono text-[10px] sm:text-[11px]', characterCount >= maxCharacters && 'text-destructive font-bold')}>
                                            {characterCount} / {maxCharacters}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-4 sm:px-6 py-3.5 sm:py-4 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 flex flex-row items-center justify-between gap-2.5 m-0 rounded-b-md rounded-t-none">
                        <div className="flex items-center">
                            {hasExistingNote ? (
                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={handleClear}
                                    disabled={isSaving || isNoteLoading}
                                    leftIcon={<Trash2 className="size-3.5 text-destructive" />}
                                    className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer h-8 px-2 rounded-sm"
                                >
                                    Clear Note
                                </Button>
                            ) : (
                                <div />
                            )}
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.SM}
                                onClick={handleClose}
                                disabled={isSaving}
                                className="text-xs rounded-sm"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                variant={ButtonVariant.DEFAULT}
                                size={ButtonSize.SM}
                                onClick={handleSave}
                                disabled={isSaving || isNoteLoading || !isDirty}
                                isLoading={isSaving}
                                loadingText="Saving..."
                                className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 min-w-28 px-4 py-2"
                            >
                                Save Note
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};


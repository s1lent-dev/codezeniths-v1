'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    toast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    FloatingLabelInput,
    FloatingLabelTextarea,
    Switch,
    ScrollArea,
} from '@codezeniths/components';
import { playlistQueryService } from '@/lib/tanstack';
import { Globe, Lock, ListPlus } from 'lucide-react';
import {
    PlaylistProblemPicker,
    type ProblemPickerItem,
} from '../shared/playlist-problem-picker';

export interface CreatePlaylistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newPlaylist: { id: string; slug: string; title: string }) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
    open,
    onOpenChange,
    onSuccess,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [selectedProblems, setSelectedProblems] = useState<ProblemPickerItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createMutation = playlistQueryService.createPlaylist();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            toast.error('Validation Error', 'Please enter a playlist title.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createMutation.mutateAsync({
                title: trimmedTitle,
                description: description.trim() || undefined,
                isPublic,
                problemIds: selectedProblems.map((p) => p.id),
            });

            toast.success('Playlist Created', `"${result.title}" has been successfully created.`);
            setTitle('');
            setDescription('');
            setIsPublic(true);
            setSelectedProblems([]);
            onOpenChange(false);
            onSuccess?.(result);
        } catch (error: any) {
            toast.error('Creation Failed', error?.message || 'Something went wrong while creating playlist.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden z-300 rounded-2xl bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
                    {/* ─── Fixed Header ─── */}
                    <DialogHeader className="p-6 pb-4 border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 shrink-0 bg-foreground-light dark:bg-foreground-dark gap-2">
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <ListPlus className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-lg sm:text-xl font-bold">
                                    Create New Playlist
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm text-muted-light dark:text-muted-dark block max-w-96">
                                    Curate, organize, and practice your problem sets into targeted tracks.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* ─── Scrollable Form Body ─── */}
                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <div className="p-6 space-y-5">
                            {/* Title Floating Input */}
                            <div className="space-y-1.5">
                                <FloatingLabelInput
                                    label="Playlist Title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={100}
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                <p className="text-[11px] text-muted-light dark:text-muted-dark text-right px-1">
                                    {title.length}/100
                                </p>
                            </div>

                            {/* Description Floating Textarea */}
                            <div className="space-y-1.5">
                                <FloatingLabelTextarea
                                    label="Description (Optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={500}
                                    disabled={isSubmitting}
                                />
                                <p className="text-[11px] text-muted-light dark:text-muted-dark text-right px-1">
                                    {description.length}/500
                                </p>
                            </div>

                            {/* Visibility Switch Card */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-foreground-light-shade2/60 dark:bg-foreground-dark-shade2/60 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-body-light-shade3 dark:text-body-dark">
                                        {isPublic ? (
                                            <>
                                                <Globe className="size-4 text-primary" />
                                                <span>Public Playlist</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="size-4 text-warning" />
                                                <span>Private Playlist</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                        {isPublic
                                            ? 'Visible to the Codezeniths community. Anyone can view and bookmark.'
                                            : 'Only visible to you on your account.'}
                                    </p>
                                </div>

                                <Switch
                                    checked={isPublic}
                                    onCheckedChange={setIsPublic}
                                    disabled={isSubmitting}
                                    className="shrink-0"
                                />
                            </div>

                            {/* Search & Add Problems to Playlist */}
                            <PlaylistProblemPicker
                                selectedProblems={selectedProblems}
                                onSelectedProblemsChange={setSelectedProblems}
                            />
                        </div>
                    </ScrollArea>

                    {/* ─── Fixed Footer with Vertically Centered Actions ─── */}
                    <DialogFooter className="p-5 px-6 border-t border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 shrink-0 flex flex-row items-center justify-end gap-3 bg-foreground-light dark:bg-foreground-dark">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                disabled={isSubmitting}
                                className="px-5 font-semibold"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant={ButtonVariant.DEFAULT}
                            disabled={isSubmitting || !title.trim()}
                            isLoading={isSubmitting}
                            loadingText="Creating..."
                            className="px-6 font-semibold bg-primary hover:bg-primary-shade2 text-white shadow-xs"
                        >
                            Create Playlist
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

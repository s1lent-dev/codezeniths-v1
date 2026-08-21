'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    useToast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Checkbox,
} from '@codezeniths/components';
import { DownloadCloud, CheckCircle2, Loader2, FileArchive, Code, History, User } from 'lucide-react';

interface ExportDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
    isOpen,
    onClose,
}) => {
    const toast = useToast();
    const [isExporting, setIsExporting] = useState(false);
    const [includeSolutions, setIncludeSolutions] = useState(true);
    const [includeSubmissions, setIncludeSubmissions] = useState(true);
    const [includeProfile, setIncludeProfile] = useState(true);
    const [includeNotes, setIncludeNotes] = useState(true);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            toast.success('Archive generated successfully', 'Your Codezeniths data archive (JSON) has been downloaded.');
            onClose();
        } catch {
            toast.error('Export failed', 'Could not generate archive. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 z-100">
                <DialogHeader className="space-y-2">
                    <div className="size-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                        <FileArchive className="size-5" />
                    </div>
                    <DialogTitle className="text-base font-bold text-heading-light dark:text-heading-dark">
                        Export Personal Data Archive
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark">
                        Select the data categories you want to include in your downloadable ZIP/JSON archive.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3">
                    {/* Item 1: Solutions */}
                    <div
                        onClick={() => setIncludeSolutions(!includeSolutions)}
                        className="flex items-center justify-between p-3 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 cursor-pointer hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Code className="size-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    Solved Problems & Code
                                </span>
                                <span className="text-[11px] text-muted-light dark:text-muted-dark">
                                    All written code solutions across languages
                                </span>
                            </div>
                        </div>
                        <Checkbox checked={includeSolutions} onCheckedChange={(val) => setIncludeSolutions(!!val)} />
                    </div>

                    {/* Item 2: Submissions */}
                    <div
                        onClick={() => setIncludeSubmissions(!includeSubmissions)}
                        className="flex items-center justify-between p-3 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 cursor-pointer hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <History className="size-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    Submission Logs & Stats
                                </span>
                                <span className="text-[11px] text-muted-light dark:text-muted-dark">
                                    Runtime benchmarks, memory, and dates
                                </span>
                            </div>
                        </div>
                        <Checkbox checked={includeSubmissions} onCheckedChange={(val) => setIncludeSubmissions(!!val)} />
                    </div>

                    {/* Item 3: Profile */}
                    <div
                        onClick={() => setIncludeProfile(!includeProfile)}
                        className="flex items-center justify-between p-3 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 cursor-pointer hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <User className="size-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    Profile Details & Settings
                                </span>
                                <span className="text-[11px] text-muted-light dark:text-muted-dark">
                                    Account metadata, bio, skills, and social links
                                </span>
                            </div>
                        </div>
                        <Checkbox checked={includeProfile} onCheckedChange={(val) => setIncludeProfile(!!val)} />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onClose}
                        disabled={isExporting}
                        className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.SM}
                        onClick={handleExport}
                        disabled={isExporting || (!includeSolutions && !includeSubmissions && !includeProfile && !includeNotes)}
                        leftIcon={isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <DownloadCloud className="size-3.5" />}
                        className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3"
                    >
                        {isExporting ? 'Preparing Archive...' : 'Download JSON Archive'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

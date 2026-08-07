'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    FileText,
    Pause,
    Play,
    X,
    Check,
    HelpCircle,
    UploadCloud,
    AlertCircle,
    ExternalLink,
    Eye,
} from 'lucide-react';
import {
    Container,
    Typography,
    TypographyVariant,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface FileInputProps {
    /** Current file URL string or File object */
    value?: string | File | null;
    /** Callback when file changes or is removed */
    onChange?: (file: File | null, previewUrl: string | null) => void;
    /** Callback for triggering async upload */
    onFileUpload?: (file: File) => void;
    /** External pause upload callback */
    onPauseUpload?: () => void;
    /** External resume upload callback */
    onResumeUpload?: () => void;
    /** External uploading progress state (0 to 100) */
    uploadProgress?: number;
    /** Section Title */
    title?: string;
    /** Section Subtext / Description */
    description?: string;
    /** Accepted file MIME types or extensions string */
    accept?: string;
    /** Display string for supported formats prompt */
    allowedExtensionsLabel?: string;
    /** Maximum allowed file size in bytes (defaults to 5MB) */
    maxSizeBytes?: number;
    /** External uploading active state */
    isUploading?: boolean;
    /** Custom central icon */
    icon?: React.ComponentType<{ className?: string }>;
    /** Show bottom action footer (Help Centre, Cancel, Done) */
    showFooter?: boolean;
    /** Cancel callback */
    onCancel?: () => void;
    /** Done / Submit callback */
    onDone?: () => void;
    /** Custom wrapper class names */
    className?: string;
}

interface UploadProgressItem {
    name: string;
    size: string;
    progress: number;
    status: 'uploading' | 'paused' | 'completed' | 'error';
    previewUrl: string;
    file?: File;
    errorMessage?: string;
}

const isPdfDocument = (fileNameOrUrl: string, type?: string) => {
    if (type === 'application/pdf') return true;
    const lower = (fileNameOrUrl || '').toLowerCase();
    return lower.endsWith('.pdf') || lower.includes('.pdf') || lower.includes('application/pdf');
};

export const FileInput: React.FC<FileInputProps> = ({
    value,
    onChange,
    onFileUpload,
    onPauseUpload,
    onResumeUpload,
    uploadProgress,
    title = 'Upload File',
    description = 'Upload your document or file',
    accept = 'application/pdf, .pdf',
    allowedExtensionsLabel = 'Supports: PDF',
    maxSizeBytes = 5 * 1024 * 1024, // 5 MB
    isUploading = false,
    icon: MainIcon = FileText,
    showFooter = true,
    onCancel,
    onDone,
    className,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadItem, setUploadItem] = useState<UploadProgressItem | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const maxSizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);

    // Sync external value & isUploading & uploadProgress
    useEffect(() => {
        if (value) {
            const isFile = value instanceof File;
            const name = isFile ? value.name : 'Resume_Document.pdf';
            const url = isFile ? URL.createObjectURL(value) : value;
            const sizeStr = isFile ? `${(value.size / (1024 * 1024)).toFixed(1)} MB` : 'PDF Document';

            const currentProg = isUploading ? (uploadProgress ?? 50) : 100;
            const currentStatus = isUploading ? 'uploading' : 'completed';

            setUploadItem({
                name,
                size: sizeStr,
                progress: currentProg,
                status: currentStatus,
                previewUrl: url,
                file: isFile ? value : undefined,
            });
        } else if (isUploading) {
            setUploadItem((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    progress: uploadProgress ?? prev.progress,
                    status: 'uploading',
                };
            });
        } else {
            setUploadItem(null);
        }
    }, [value, isUploading, uploadProgress]);

    // Handle Pause / Resume toggle
    const togglePause = () => {
        if (!uploadItem) return;

        if (uploadItem.status === 'uploading') {
            setUploadItem({ ...uploadItem, status: 'paused' });
            onPauseUpload?.();
        } else if (uploadItem.status === 'paused') {
            setUploadItem({ ...uploadItem, status: 'uploading' });
            if (onResumeUpload) {
                onResumeUpload();
            } else if (uploadItem.file && onFileUpload) {
                onFileUpload(uploadItem.file);
            }
        }
    };

    // Handle file selection with type and size limits
    const handleFileSelect = (file: File) => {
        setFileError(null);

        // Type check
        if (!isPdfDocument(file.name, file.type) && accept.includes('pdf')) {
            setFileError('Invalid file format. Only PDF documents (.pdf) are allowed.');
            return;
        }

        if (file.size > maxSizeBytes) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            setFileError(`File size (${sizeInMb} MB) exceeds maximum allowed limit of ${maxSizeMb} MB.`);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

        setUploadItem({
            name: file.name,
            size: sizeStr,
            progress: uploadProgress ?? 20,
            status: 'uploading',
            previewUrl: objectUrl,
            file,
        });

        if (onFileUpload) {
            onFileUpload(file);
        }
        onChange?.(file, objectUrl);
    };

    // Drag and Drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Clear upload
    const handleRemove = () => {
        setUploadItem(null);
        setFileError(null);
        onChange?.(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isPdf = uploadItem ? isPdfDocument(uploadItem.name, uploadItem.file?.type) || uploadItem.previewUrl.includes('.pdf') : false;

    return (
        <Container
            direction="col"
            className={cn(
                "w-full rounded-2xl border border-secondary/20 dark:border-secondary-shade2/40 bg-foreground-light/60 dark:bg-foreground-dark/60 p-6 sm:p-8 gap-6 shadow-sm backdrop-blur-xs",
                className
            )}
        >
            {/* Header */}
            <Container align="center" justify="between" className="w-full">
                <Container direction="col" className="space-y-1">
                    <Typography
                        variant={TypographyVariant.H5}
                        className="font-semibold text-body-light dark:text-body-dark text-base sm:text-lg"
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-xs text-muted-light dark:text-muted-dark block"
                    >
                        {description} (Max {maxSizeMb} MB)
                    </Typography>
                </Container>

                {uploadItem && (
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.ICON_SM}
                        onClick={handleRemove}
                        className="text-muted-light dark:text-muted-dark hover:text-destructive hover:bg-destructive/10"
                        title="Reset upload"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </Container>

            {/* Drag & Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                        ? 'border-primary bg-primary/10 scale-[1.01]'
                        : 'border-primary/30 dark:border-primary/40 hover:border-primary dark:hover:border-primary-shade1 bg-background-light/30 dark:bg-background-dark/30 hover:bg-primary/5'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Central Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-primary/15 dark:bg-primary/25 flex items-center justify-center text-primary mb-3 shadow-inner group-hover:scale-105 transition-transform">
                    <MainIcon className="w-7 h-7" />
                </div>

                {/* Text Prompts using Typography */}
                <Typography variant={TypographyVariant.P} className="text-sm font-medium text-body-light dark:text-body-dark">
                    Drop your PDF file here, or{' '}
                    <Typography variant={TypographyVariant.SPAN} className="text-primary font-semibold hover:underline">
                        browse
                    </Typography>
                </Typography>

                <Typography variant={TypographyVariant.SPAN} className="text-xs text-muted-light dark:text-muted-dark mt-1 block">
                    {allowedExtensionsLabel} (Max {maxSizeMb} MB)
                </Typography>
            </div>

            {/* Validation Error Message */}
            {fileError && (
                <Container align="center" className="w-full p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fileError}</span>
                </Container>
            )}

            {/* Progress / File Card */}
            {uploadItem && (
                <Container
                    direction="col"
                    className="w-full relative rounded-xl border border-secondary/20 dark:border-secondary-shade2/40 bg-background-light dark:bg-background-dark p-4 gap-4 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    <Container align="center" justify="between" className="w-full gap-3">
                        {/* File Thumbnail & Info */}
                        <Container align="center" className="gap-3 overflow-hidden min-w-0">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-secondary/20 bg-destructive/10 text-destructive shrink-0 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                                {isPdf ? 'PDF' : <MainIcon className="w-6 h-6" />}
                            </div>

                            <Container direction="col" className="min-w-0">
                                <Typography
                                    variant={TypographyVariant.P}
                                    className="text-sm font-semibold text-body-light dark:text-body-dark truncate"
                                >
                                    {uploadItem.name}
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.SPAN}
                                    className="text-xs text-muted-light dark:text-muted-dark block"
                                >
                                    {uploadItem.size}
                                </Typography>
                            </Container>
                        </Container>

                        {/* Control Buttons */}
                        <Container align="center" className="gap-1 shrink-0">
                            {uploadItem.status === 'uploading' && (
                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.ICON_SM}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePause();
                                    }}
                                    className="text-muted-light dark:text-muted-dark hover:text-foreground hover:bg-secondary/10"
                                    title="Pause upload"
                                >
                                    <Pause className="w-4 h-4" />
                                </Button>
                            )}

                            {uploadItem.status === 'paused' && (
                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.ICON_SM}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePause();
                                    }}
                                    className="text-primary hover:bg-primary/10"
                                    title="Resume upload"
                                >
                                    <Play className="w-4 h-4" />
                                </Button>
                            )}

                            {uploadItem.status === 'completed' && (
                                <div className="p-1 rounded-full bg-success/15 text-success flex items-center justify-center mr-1">
                                    <Check className="w-4 h-4 stroke-3" />
                                </div>
                            )}

                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.ICON_SM}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="text-muted-light dark:text-muted-dark hover:text-destructive hover:bg-destructive/10"
                                title="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </Container>
                    </Container>

                    {/* Progress Bar & Percentage */}
                    <Container direction="col" className="w-full space-y-1.5 pt-1">
                        <Container align="center" justify="between" className="w-full text-xs font-medium">
                            <Typography variant={TypographyVariant.SPAN} className="text-muted-light dark:text-muted-dark">
                                {uploadItem.status === 'paused'
                                    ? 'Paused'
                                    : uploadItem.status === 'completed'
                                    ? 'Uploaded successfully'
                                    : 'Uploading...'}
                            </Typography>
                            <Typography variant={TypographyVariant.SPAN} className="text-primary dark:text-primary-shade1 font-bold">
                                {uploadItem.progress}%
                            </Typography>
                        </Container>

                        <div className="w-full h-1.5 bg-secondary/15 dark:bg-secondary-shade2/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                    uploadItem.status === 'completed'
                                        ? 'bg-success'
                                        : uploadItem.status === 'paused'
                                        ? 'bg-warning'
                                        : 'bg-primary'
                                }`}
                                style={{ width: `${uploadItem.progress}%` }}
                            />
                        </div>
                    </Container>

                    {/* Embedded PDF Viewer Box */}
                    {isPdf && uploadItem.previewUrl && (
                        <div className="w-full mt-2 rounded-xl border border-secondary/20 dark:border-secondary-shade2/40 overflow-hidden bg-background-light/50 dark:bg-background-dark/50 p-3 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-destructive/15 text-destructive">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-body-light dark:text-body-dark truncate max-w-xs sm:max-w-md">
                                        PDF Document Preview
                                    </span>
                                </div>
                                <a
                                    href={uploadItem.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span>Open Full PDF</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            <div className="w-full h-80 rounded-lg overflow-hidden border border-secondary/20 bg-muted/20 relative">
                                <iframe
                                    src={`${uploadItem.previewUrl}#toolbar=0`}
                                    title="PDF Document Preview"
                                    className="w-full h-full border-0"
                                />
                            </div>
                        </div>
                    )}
                </Container>
            )}

            {/* Footer Bar */}
            {showFooter && (
                <Container align="center" justify="between" className="w-full pt-3 border-t border-secondary/10 dark:border-secondary-shade2/20">
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.SM}
                        leftIcon={<HelpCircle className="w-4 h-4" />}
                        onClick={() => {
                            window.open('https://codezeniths.com/help', '_blank');
                        }}
                        className="text-xs text-muted-light dark:text-muted-dark hover:text-primary"
                    >
                        Help Centre
                    </Button>

                    <Container align="center" className="gap-2">
                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.DEFAULT}
                            onClick={() => {
                                handleRemove();
                                onCancel?.();
                            }}
                            className="text-xs text-muted-light dark:text-muted-dark hover:bg-secondary/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.DEFAULT}
                            disabled={uploadItem?.status === 'uploading'}
                            onClick={onDone}
                            className="text-xs"
                        >
                            Done
                        </Button>
                    </Container>
                </Container>
            )}
        </Container>
    );
};

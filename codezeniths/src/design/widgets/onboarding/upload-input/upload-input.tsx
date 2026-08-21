'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, User, RefreshCw, X, AlertCircle } from 'lucide-react';
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    Button,
    ButtonVariant,
    ButtonSize,
    Spinner,
    SpinnerVariant,
    Typography,
    TypographyVariant,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface UploadInputProps {
    /** Current image URL string or File object */
    value?: string | File | null;
    /** Callback fired when image is selected or removed */
    onChange?: (file: File | null, previewUrl: string | null) => void;
    /** Async upload trigger callback */
    onUpload?: (file: File) => void | Promise<void>;
    /** Async remove trigger callback */
    onRemove?: () => void | Promise<void>;
    /** Section Title */
    title?: string;
    /** Section Subtext / Description */
    description?: string;
    /** Custom text for Upload button */
    uploadButtonText?: string;
    /** Custom text for Change button */
    changeButtonText?: string;
    /** Custom text for Remove button */
    removeButtonText?: string;
    /** Toggle remove button visibility */
    showRemoveButton?: boolean;
    /** Size of avatar preview */
    avatarSize?: 'sm' | 'md' | 'lg' | 'xl' | number;
    /** Shape of avatar frame */
    shape?: 'circle' | 'square' | 'rounded';
    /** Fallback initials to display when no image uploaded */
    fallbackInitials?: string;
    /** Custom fallback Lucide icon component */
    fallbackIcon?: React.ComponentType<{ className?: string }>;
    /** Maximum allowed file size in bytes (defaults to 5MB) */
    maxSizeBytes?: number;
    /** Accepted file MIME types */
    accept?: string;
    /** Loading state for image upload in progress */
    isUploading?: boolean;
    /** Error message string or boolean flag */
    error?: string | boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Helper hint text rendered at bottom */
    helperText?: string;
    /** Container wrapper class names */
    className?: string;
}

const SIZE_MAP = {
    sm: 'size-12 text-sm',
    md: 'size-16 text-base',
    lg: 'size-24 text-xl',
    xl: 'size-32 text-2xl',
};

const SHAPE_MAP = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-2xl',
};

export const UploadInput: React.FC<UploadInputProps> = ({
    value,
    onChange,
    onUpload,
    onRemove,
    title = 'Profile Picture',
    description = 'PNG, JPG, or WEBP up to 5MB',
    uploadButtonText = 'Upload Photo',
    changeButtonText = 'Change Photo',
    removeButtonText = 'Remove',
    showRemoveButton = true,
    avatarSize = 'lg',
    shape = 'circle',
    fallbackInitials,
    fallbackIcon: FallbackIcon = User,
    maxSizeBytes = 5 * 1024 * 1024,
    accept = 'image/png, image/jpeg, image/jpg, image/webp',
    isUploading = false,
    error,
    disabled = false,
    helperText,
    className,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Compute preview URL whenever value changes
    useEffect(() => {
        if (!value) {
            setPreviewUrl(null);
        } else if (typeof value === 'string') {
            setPreviewUrl(value);
        } else if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [value]);

    const maxSizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);

    const handleFile = (file: File) => {
        setLocalError(null);

        if (file.size > maxSizeBytes) {
            const fileMb = (file.size / (1024 * 1024)).toFixed(1);
            setLocalError(`File size (${fileMb} MB) exceeds maximum limit of ${maxSizeMb} MB.`);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        onChange?.(file, objectUrl);
        onUpload?.(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setLocalError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onChange?.(null, null);
        onRemove?.();
    };

    // Drag and Drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled || isUploading) return;
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
        if (disabled || isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const avatarSizeClass = typeof avatarSize === 'string' ? SIZE_MAP[avatarSize] : '';
    const avatarStyle = typeof avatarSize === 'number' ? { width: avatarSize, height: avatarSize } : undefined;
    const shapeClass = SHAPE_MAP[shape];

    const errorMessage = typeof error === 'string' ? error : localError;

    return (
        <div className={cn("w-full space-y-3", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={disabled || isUploading}
                className="hidden"
            />

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    "flex flex-col sm:flex-row items-center gap-8 p-5 rounded-2xl border transition-all duration-200 bg-foreground-light/40 dark:bg-foreground-dark/40 backdrop-blur-xs",
                    dragActive
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : "border-muted-light/25 dark:border-muted-dark/25 hover:border-primary/40",
                    disabled && "opacity-60 cursor-not-allowed",
                    errorMessage && "border-destructive/60 bg-destructive/5"
                )}
            >
                {/* Left: Avatar Frame with Overlay */}
                <div
                    onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                    className={cn(
                        "relative group shrink-0 cursor-pointer overflow-hidden shadow-md transition-transform active:scale-95",
                        avatarSizeClass,
                        shapeClass,
                        styleToClassName(avatarStyle)
                    )}
                    style={avatarStyle}
                >
                    <Avatar className={cn("w-full h-full", shapeClass)}>
                        {previewUrl && <AvatarImage src={previewUrl} alt={title} className="object-cover" />}
                        <AvatarFallback className="bg-primary/50 text-primary font-bold flex items-center justify-center">
                            {fallbackInitials ? (
                                fallbackInitials.toUpperCase()
                            ) : (
                                <FallbackIcon className="w-1/2 h-1/2 text-background-dark-shade3 dark:text-background-light-shade3" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    {/* Hover Camera Overlay */}
                    {!disabled && (
                        <div className={cn(
                            "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1",
                            isUploading && "opacity-100 bg-black/70"
                        )}>
                            {isUploading ? (
                                <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-5 h-5 text-white" />
                            ) : (
                                <>
                                    <Camera className="w-5 h-5" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Change</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Text & Actions */}
                <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left w-full">
                    <div className="space-y-0.5">
                        <Typography variant={TypographyVariant.H5} className="font-bold text-sm sm:text-base text-foreground">
                            {title}
                        </Typography>
                        <Typography variant={TypographyVariant.SPAN} className="text-xs text-body-light dark:text-body-dark block leading-relaxed">
                            {description}
                        </Typography>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                        <Button
                            type="button"
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || isUploading}
                            leftIcon={previewUrl ? <RefreshCw className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                            className="rounded-lg text-xs font-semibold text-background-dark-shade3 dark:text-background-light-shade3"
                        >
                            {previewUrl ? changeButtonText : uploadButtonText}
                        </Button>

                        {previewUrl && showRemoveButton && (
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.SM}
                                onClick={handleRemove}
                                disabled={disabled || isUploading}
                                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                                className="rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive font-medium"
                            >
                                {removeButtonText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="flex items-center gap-1.5 text-destructive text-xs font-medium px-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Helper Text */}
            {helperText && !errorMessage && (
                <Typography variant={TypographyVariant.SPAN} className="text-xs text-body-light dark:text-body-dark block px-1">
                    {helperText}
                </Typography>
            )}
        </div>
    );
};

function styleToClassName(style?: React.CSSProperties): string {
    if (!style) return '';
    return '';
}

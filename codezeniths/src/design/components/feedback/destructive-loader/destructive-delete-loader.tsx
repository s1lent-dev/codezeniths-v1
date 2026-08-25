'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Trash2, AlertOctagon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface DestructiveDeleteLoaderProps {
    mode?: 'inline' | 'overlay';
    className?: string;
    showSteps?: boolean;
}

const PURGE_STEPS = [
    'Purging database relations...',
    'Revoking sessions & tokens...',
    'Clearing search index & cache...',
    'Wiping cloud storage media...',
    'Finalizing account erasure...',
];

export const DestructiveDeleteLoader: React.FC<DestructiveDeleteLoaderProps> = ({
    mode = 'inline',
    className,
    showSteps = true,
}) => {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % PURGE_STEPS.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    if (mode === 'inline') {
        return (
            <div className={cn('relative flex items-center justify-center size-5 shrink-0', className)}>
                {/* Rotating Outer Segmented Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 border-r-rose-400 opacity-90"
                />
                {/* Counter-rotating Inner Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0.5 rounded-full border-2 border-transparent border-b-rose-600 border-l-red-500"
                />
                {/* Center Pulse Core */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                />
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col items-center justify-center py-6 px-4 space-y-5 text-center', className)}>
            {/* High-Tech Concentric Destructive Ring Container */}
            <div className="relative size-24 flex items-center justify-center">
                {/* Ambient Red Glow Halo */}
                <div className="absolute inset-0 rounded-full bg-rose-600/20 blur-xl animate-pulse" />

                {/* Outer Dashed Orbit */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-rose-500/30"
                />

                {/* Outer High-Speed Laser Arc */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-1 rounded-full border-2 border-transparent border-t-rose-500 border-r-red-400 shadow-[0_0_12px_#f43f5e]"
                />

                {/* Counter-Rotating Segmented Middle Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-2 border-transparent border-b-rose-600 border-l-rose-400"
                />

                {/* Inner Orbiting Particles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-3.5 flex items-start justify-center pointer-events-none"
                >
                    <div className="size-2 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]" />
                </motion.div>

                {/* Center Core: Pulsing Destructive Icon */}
                <motion.div
                    animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                    className="size-12 rounded-xl bg-gradient-to-br from-rose-600/20 to-red-950/40 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] z-10"
                >
                    <Flame className="size-6 fill-rose-500/30 text-rose-500 animate-pulse" />
                </motion.div>
            </div>

            {/* Status Feedback Text */}
            <div className="space-y-1.5 max-w-xs">
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400 tracking-tight">
                    Irreversibly Purging Account
                </p>
                {showSteps && (
                    <motion.p
                        key={stepIndex}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs text-muted-light dark:text-muted-dark font-mono"
                    >
                        {PURGE_STEPS[stepIndex]}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

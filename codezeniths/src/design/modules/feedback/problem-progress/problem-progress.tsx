'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { ProblemProgressProps } from './problem-progress.types';

export const ProblemProgress: React.FC<ProblemProgressProps> = ({
    easy,
    medium,
    hard,
    totalProblems,
    solved,
    unsolved,
    completionPercentage,
    revisitCount,
    className,
    interactive = true,
    defaultMode = 'difficulty',
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Determine current mode (hover swaps mode when interactive)
    const isStatusMode = interactive
        ? defaultMode === 'difficulty'
            ? isHovered
            : !isHovered
        : defaultMode === 'status';

    // ── SVG Gauge Geometry ────────────────────────────────────────────────
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ~282.743px
    const totalSpanFraction = 0.75; // 270-degree open gauge
    const totalGaugeArcLength = circumference * totalSpanFraction; // ~212.058px
    const strokeWidthVal = 3.5;
    const strokeCapRadius = strokeWidthVal / 2; // 1.75px (half-cap offset for rounded linecaps)
    const gapPx = 8; // Visual gap between consecutive rounded segments

    // Total problems sum for proportional slice allocation
    const actualTotalProblems = totalProblems ?? (easy.total + medium.total + hard.total);
    const calcTotalProblems = Math.max(1, actualTotalProblems);

    // ── DIFFICULTY MODE: Proportional Slices (Easy = Teal, Medium = Yellow, Hard = Red) ──
    const easyShare = Math.min(1, Math.max(0, easy.total / calcTotalProblems));
    const mediumShare = Math.min(1 - easyShare, Math.max(0, medium.total / calcTotalProblems));
    const hardShare = Math.min(1 - easyShare - mediumShare, Math.max(0, hard.total / calcTotalProblems));

    const activeDiffSegmentsCount = (easyShare > 0 ? 1 : 0) + (mediumShare > 0 ? 1 : 0) + (hardShare > 0 ? 1 : 0);
    const totalDiffGapsPx = activeDiffSegmentsCount > 1 ? (activeDiffSegmentsCount - 1) * gapPx : 0;
    const availableDiffLength = Math.max(0, totalGaugeArcLength - totalDiffGapsPx);

    // Allocated visible length per difficulty tier
    const easyAlloc = availableDiffLength * easyShare;
    const mediumAlloc = availableDiffLength * mediumShare;
    const hardAlloc = availableDiffLength * hardShare;

    // Track dash lengths (subtract strokeWidthVal so the outer rounded ends fit within the allocation)
    const easyTrackLength = Math.max(0, easyAlloc - strokeWidthVal);
    const mediumTrackLength = Math.max(0, mediumAlloc - strokeWidthVal);
    const hardTrackLength = Math.max(0, hardAlloc - strokeWidthVal);

    // Exact linear fill lengths with rounded linecap scaling (ensuring min dot visibility for solved > 0)
    const easyFillLength = easy.total > 0 && easy.solved > 0
        ? Math.max(0.5, easyTrackLength * Math.min(1, Math.max(0, easy.solved / easy.total)))
        : 0;
    const mediumFillLength = medium.total > 0 && medium.solved > 0
        ? Math.max(0.5, mediumTrackLength * Math.min(1, Math.max(0, medium.solved / medium.total)))
        : 0;
    const hardFillLength = hard.total > 0 && hard.solved > 0
        ? Math.max(0.5, hardTrackLength * Math.min(1, Math.max(0, hard.solved / hard.total)))
        : 0;

    // Rotational offsets (shifted by strokeCapRadius so rounded start caps align precisely with segment start)
    const posEasy = 0;
    const posMedium = easyShare > 0 ? easyAlloc + gapPx : 0;
    const posHard = (easyShare > 0 ? easyAlloc + gapPx : 0) + (mediumShare > 0 ? mediumAlloc + gapPx : 0);

    const offsetEasy = -(posEasy + strokeCapRadius);
    const offsetMedium = -(posMedium + strokeCapRadius);
    const offsetHard = -(posHard + strokeCapRadius);

    // ── STATUS DISTRIBUTION MODE: Solved (Green) & Unsolved (Dim Slate) ──
    const safeSolved = Math.max(0, Math.min(actualTotalProblems, solved));
    const safeUnsolved = Math.max(0, actualTotalProblems - safeSolved);

    const activeStatusSegmentsCount = (safeSolved > 0 ? 1 : 0) + (safeUnsolved > 0 ? 1 : 0);
    const totalStatusGapsPx = activeStatusSegmentsCount > 1 ? (activeStatusSegmentsCount - 1) * gapPx : 0;
    const availableStatusLength = Math.max(0, totalGaugeArcLength - totalStatusGapsPx);

    // Minimum visible allocation for a rounded cap dot (~4px = strokeWidthVal + 0.5)
    // Ensures a single solved or unsolved problem is always visibly rendered even with thousands of problems
    const minSegmentAlloc = strokeWidthVal + 0.5;

    let solvedAlloc = 0;
    let unsolvedAlloc = 0;

    if (activeStatusSegmentsCount === 2) {
        const rawSolvedAlloc = availableStatusLength * (safeSolved / calcTotalProblems);
        const rawUnsolvedAlloc = availableStatusLength * (safeUnsolved / calcTotalProblems);

        if (rawSolvedAlloc < minSegmentAlloc) {
            solvedAlloc = minSegmentAlloc;
            unsolvedAlloc = Math.max(0, availableStatusLength - solvedAlloc);
        } else if (rawUnsolvedAlloc < minSegmentAlloc) {
            unsolvedAlloc = minSegmentAlloc;
            solvedAlloc = Math.max(0, availableStatusLength - unsolvedAlloc);
        } else {
            solvedAlloc = rawSolvedAlloc;
            unsolvedAlloc = rawUnsolvedAlloc;
        }
    } else if (safeSolved > 0) {
        solvedAlloc = availableStatusLength;
        unsolvedAlloc = 0;
    } else if (safeUnsolved > 0) {
        solvedAlloc = 0;
        unsolvedAlloc = availableStatusLength;
    }

    const distSolvedLength = safeSolved > 0 ? Math.max(0.2, solvedAlloc - strokeWidthVal) : 0;
    const distUnsolvedLength = safeUnsolved > 0 ? Math.max(0.2, unsolvedAlloc - strokeWidthVal) : 0;

    const posDistSolved = 0;
    const posDistUnsolved = safeSolved > 0 ? solvedAlloc + gapPx : 0;

    const offsetDistSolved = -(posDistSolved + strokeCapRadius);
    const offsetDistUnsolved = -(posDistUnsolved + strokeCapRadius);

    // Format Completion Percentage integer and decimal parts
    const integerPart = Math.floor(completionPercentage || 0);
    const decimalPart = ((completionPercentage || 0) % 1).toFixed(2).substring(1); // e.g. ".06"

    return (
        <motion.div
            className={cn(
                'relative flex flex-col items-center justify-center p-1 bg-transparent select-none transition-all duration-300 group cursor-pointer',
                className
            )}
            style={{ transform: 'translateZ(0)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={() => interactive && setIsHovered(true)}
            onMouseLeave={() => interactive && setIsHovered(false)}
        >
            {/* SVG Semi-Circle Gauge Container */}
            <div className="relative size-36 xs:size-40 sm:size-44 flex items-center justify-center">
                <svg
                    className="size-full overflow-visible"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        {/* Refined, crisp luminescent filters */}
                        <filter id="glow-cp-easy" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#00b8a3" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="glow-cp-medium" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#feb800" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="glow-cp-hard" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#ff2d55" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="glow-cp-solved" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#2cbb5d" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <AnimatePresence mode="wait">
                        {!isStatusMode ? (
                            /* MODE 1: Difficulty Mode (Easy = Teal, Medium = Yellow, Hard = Red) with Rounded Linecaps */
                            <motion.g
                                key="difficulty-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Easy Tier: Background Track & Solved Fill */}
                                {easyAlloc > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-teal/20"
                                        strokeDasharray={`${easyTrackLength} ${circumference - easyTrackLength}`}
                                        strokeDashoffset={offsetEasy}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${easyTrackLength} ${circumference - easyTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}
                                    />
                                )}
                                {easy.solved > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        stroke="var(--color-teal)"
                                        filter="url(#glow-cp-easy)"
                                        strokeDasharray={`${easyFillLength} ${circumference - easyFillLength}`}
                                        strokeDashoffset={offsetEasy}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${easyFillLength} ${circumference - easyFillLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.08 }}
                                    />
                                )}

                                {/* Medium Tier: Background Track & Solved Fill */}
                                {mediumAlloc > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-warning/20"
                                        strokeDasharray={`${mediumTrackLength} ${circumference - mediumTrackLength}`}
                                        strokeDashoffset={offsetMedium}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${mediumTrackLength} ${circumference - mediumTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
                                    />
                                )}
                                {medium.solved > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        stroke="var(--color-warning)"
                                        filter="url(#glow-cp-medium)"
                                        strokeDasharray={`${mediumFillLength} ${circumference - mediumFillLength}`}
                                        strokeDashoffset={offsetMedium}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${mediumFillLength} ${circumference - mediumFillLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.16 }}
                                    />
                                )}

                                {/* Hard Tier: Background Track & Solved Fill */}
                                {hardAlloc > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-destructive/20"
                                        strokeDasharray={`${hardTrackLength} ${circumference - hardTrackLength}`}
                                        strokeDashoffset={offsetHard}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${hardTrackLength} ${circumference - hardTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
                                    />
                                )}
                                {hard.solved > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        stroke="var(--color-destructive)"
                                        filter="url(#glow-cp-hard)"
                                        strokeDasharray={`${hardFillLength} ${circumference - hardFillLength}`}
                                        strokeDashoffset={offsetHard}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${hardFillLength} ${circumference - hardFillLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.24 }}
                                    />
                                )}
                            </motion.g>
                        ) : (
                            /* MODE 2: Status Distribution Mode (Solved = Green, Unsolved = Dim) with Rounded Linecaps */
                            <motion.g
                                key="status-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* 1. Solved Share Arc (Green) */}
                                {safeSolved > 0 && distSolvedLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        stroke="var(--color-success)"
                                        filter="url(#glow-cp-solved)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${distSolvedLength} ${circumference - distSolvedLength}`}
                                        strokeDashoffset={offsetDistSolved}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${distSolvedLength} ${circumference - distSolvedLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0 }}
                                    />
                                )}

                                {/* 2. Unsolved Share Arc (Dim Slate/Grey) */}
                                {safeUnsolved > 0 && distUnsolvedLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-foreground-light-shade3/30 dark:stroke-foreground-dark-shade3/30"
                                        strokeDasharray={`${distUnsolvedLength} ${circumference - distUnsolvedLength}`}
                                        strokeDashoffset={offsetDistUnsolved}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${distUnsolvedLength} ${circumference - distUnsolvedLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: safeSolved > 0 ? 0.08 : 0 }}
                                    />
                                )}
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Center Content Display with Monospace Typography & Hover Transition */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-2">
                    <AnimatePresence mode="wait">
                        {isStatusMode ? (
                            <motion.div
                                key="status-mode-text"
                                initial={{ opacity: 0, y: 4, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.94 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-baseline font-mono text-heading-light dark:text-heading-dark">
                                    <span className="text-3xl font-extrabold tabular-nums tracking-tight">{solved}</span>
                                    <span className="text-sm font-bold text-muted-light dark:text-muted-dark ml-0.5">
                                        /{actualTotalProblems}
                                    </span>
                                </div>
                                <div className="mt-0.5 text-[10px] font-sans font-bold text-muted-light dark:text-muted-dark tracking-widest uppercase flex items-center justify-center gap-1">
                                    <Check className="w-3 h-3 text-[#2cbb5d] stroke-3" />
                                    <span>Solved</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="difficulty-mode-text"
                                initial={{ opacity: 0, y: 4, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.94 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-baseline font-mono text-heading-light dark:text-heading-dark">
                                    <span className="text-3xl font-extrabold tabular-nums tracking-tight">{integerPart}</span>
                                    <span className="text-xs font-bold text-muted-light dark:text-muted-dark ml-0.5">
                                        {decimalPart}%
                                    </span>
                                </div>
                                <div className="mt-0.5 text-[10px] font-sans font-bold text-muted-light dark:text-muted-dark tracking-widest uppercase">
                                    <span>Completed</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Revisit Count & Text Positioned at the Bottom Horizontal Open Gap */}
                {revisitCount > 0 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-baseline gap-1 text-center whitespace-nowrap">
                        <span className="font-mono text-xs font-bold tabular-nums text-body-light-shade3 dark:text-body-dark">
                            {revisitCount}
                        </span>
                        <span className="text-[10px] font-sans text-muted-light dark:text-muted-dark tracking-wider uppercase">
                            revisits
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

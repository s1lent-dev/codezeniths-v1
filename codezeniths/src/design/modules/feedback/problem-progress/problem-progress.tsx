'use client';

import React, { useId, useState } from 'react';
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
    const rawId = useId();
    const uniqueId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

    // Unique SVG filter and mask IDs to avoid DOM collisions
    const glowEasyId = `glow-cp-easy-${uniqueId}`;
    const glowMediumId = `glow-cp-medium-${uniqueId}`;
    const glowHardId = `glow-cp-hard-${uniqueId}`;
    const glowSolvedId = `glow-cp-solved-${uniqueId}`;

    const maskEasyId = `mask-cp-easy-${uniqueId}`;
    const maskMediumId = `mask-cp-medium-${uniqueId}`;
    const maskHardId = `mask-cp-hard-${uniqueId}`;
    const maskStatusId = `mask-cp-status-${uniqueId}`;

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
    const easyTotal = Math.max(0, easy.total);
    const mediumTotal = Math.max(0, medium.total);
    const hardTotal = Math.max(0, hard.total);

    const sumDiffTotals = easyTotal + mediumTotal + hardTotal;
    const diffBaseTotal = sumDiffTotals > 0 ? sumDiffTotals : calcTotalProblems;

    const easyShare = easyTotal / diffBaseTotal;
    const mediumShare = mediumTotal / diffBaseTotal;
    const hardShare = hardTotal / diffBaseTotal;

    const activeDiffSegmentsCount = (easyTotal > 0 ? 1 : 0) + (mediumTotal > 0 ? 1 : 0) + (hardTotal > 0 ? 1 : 0);
    const totalDiffGapsPx = activeDiffSegmentsCount > 1 ? (activeDiffSegmentsCount - 1) * gapPx : 0;
    const availableDiffLength = Math.max(0, totalGaugeArcLength - totalDiffGapsPx);

    // Allocated visible length per difficulty tier
    const easyAlloc = availableDiffLength * easyShare;
    const mediumAlloc = availableDiffLength * mediumShare;
    const hardAlloc = availableDiffLength * hardShare;

    // Track dash lengths (subtract strokeWidthVal so outer rounded ends fit exactly within allocation)
    const easyTrackLength = Math.max(0, easyAlloc - strokeWidthVal);
    const mediumTrackLength = Math.max(0, mediumAlloc - strokeWidthVal);
    const hardTrackLength = Math.max(0, hardAlloc - strokeWidthVal);

    // Sequential start positions along the 270° gauge
    let currentPos = 0;
    let posEasy = 0;
    let posMedium = 0;
    let posHard = 0;

    if (easyTotal > 0) {
        posEasy = currentPos;
        currentPos += easyAlloc + gapPx;
    }
    if (mediumTotal > 0) {
        posMedium = currentPos;
        currentPos += mediumAlloc + gapPx;
    }
    if (hardTotal > 0) {
        posHard = currentPos;
        currentPos += hardAlloc + gapPx;
    }

    // Rotational offsets (shifted by strokeCapRadius so rounded start caps align precisely with segment start)
    const offsetEasy = -(posEasy + strokeCapRadius);
    const offsetMedium = -(posMedium + strokeCapRadius);
    const offsetHard = -(posHard + strokeCapRadius);

    // Exact linear progress ratios and fill lengths (100% mathematically exact without cap bloat)
    const easyRatio = easyTotal > 0 ? Math.min(1, Math.max(0, easy.solved / easyTotal)) : 0;
    const mediumRatio = mediumTotal > 0 ? Math.min(1, Math.max(0, medium.solved / mediumTotal)) : 0;
    const hardRatio = hardTotal > 0 ? Math.min(1, Math.max(0, hard.solved / hardTotal)) : 0;

    const easyFillLength = easyAlloc * easyRatio;
    const mediumFillLength = mediumAlloc * mediumRatio;
    const hardFillLength = hardAlloc * hardRatio;

    // ── STATUS DISTRIBUTION MODE: Solved (Green) & Unsolved (Dim Slate) ──
    const safeSolved = Math.max(0, Math.min(actualTotalProblems, solved));
    const safeUnsolved = Math.max(0, actualTotalProblems - safeSolved);
    const solvedRatio = calcTotalProblems > 0 ? safeSolved / calcTotalProblems : 0;

    const statusTrackLength = Math.max(0, totalGaugeArcLength - strokeWidthVal);
    const offsetStatusTrack = -strokeCapRadius;
    const statusFillLength = totalGaugeArcLength * solvedRatio;

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
                        <filter id={glowEasyId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#00b8a3" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id={glowMediumId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#feb800" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id={glowHardId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#ff2d55" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id={glowSolvedId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                            <feFlood floodColor="#2cbb5d" floodOpacity="0.35" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Track Masks: Clip fill arcs to exact rounded track boundaries for pixel-perfect precision */}
                        {easyAlloc > 0 && (
                            <mask id={maskEasyId}>
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    strokeWidth={strokeWidthVal}
                                    fill="none"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeDasharray={`${easyTrackLength} ${circumference - easyTrackLength}`}
                                    strokeDashoffset={offsetEasy}
                                />
                            </mask>
                        )}

                        {mediumAlloc > 0 && (
                            <mask id={maskMediumId}>
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    strokeWidth={strokeWidthVal}
                                    fill="none"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeDasharray={`${mediumTrackLength} ${circumference - mediumTrackLength}`}
                                    strokeDashoffset={offsetMedium}
                                />
                            </mask>
                        )}

                        {hardAlloc > 0 && (
                            <mask id={maskHardId}>
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    strokeWidth={strokeWidthVal}
                                    fill="none"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeDasharray={`${hardTrackLength} ${circumference - hardTrackLength}`}
                                    strokeDashoffset={offsetHard}
                                />
                            </mask>
                        )}

                        <mask id={maskStatusId}>
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                strokeWidth={strokeWidthVal}
                                fill="none"
                                stroke="white"
                                strokeLinecap="round"
                                strokeDasharray={`${statusTrackLength} ${circumference - statusTrackLength}`}
                                strokeDashoffset={offsetStatusTrack}
                            />
                        </mask>
                    </defs>

                    <AnimatePresence mode="wait">
                        {!isStatusMode ? (
                            /* MODE 1: Difficulty Mode (Easy = Teal, Medium = Yellow, Hard = Red) */
                            <motion.g
                                key="difficulty-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Easy Tier: Background Track & Masked Linear Solved Fill */}
                                {easyAlloc > 0 && (
                                    <g key="easy-tier-group">
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
                                        {easy.solved > 0 && easyFillLength > 0 && (
                                            <g filter={`url(#${glowEasyId})`}>
                                                <g mask={`url(#${maskEasyId})`}>
                                                    <motion.circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        strokeWidth={strokeWidthVal}
                                                        fill="none"
                                                        strokeLinecap="butt"
                                                        stroke="var(--color-teal)"
                                                        strokeDasharray={`${easyFillLength} ${circumference - easyFillLength}`}
                                                        strokeDashoffset={-posEasy}
                                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                                        animate={{ strokeDasharray: `${easyFillLength} ${circumference - easyFillLength}` }}
                                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.08 }}
                                                    />
                                                </g>
                                            </g>
                                        )}
                                    </g>
                                )}

                                {/* Medium Tier: Background Track & Masked Linear Solved Fill */}
                                {mediumAlloc > 0 && (
                                    <g key="medium-tier-group">
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
                                        {medium.solved > 0 && mediumFillLength > 0 && (
                                            <g filter={`url(#${glowMediumId})`}>
                                                <g mask={`url(#${maskMediumId})`}>
                                                    <motion.circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        strokeWidth={strokeWidthVal}
                                                        fill="none"
                                                        strokeLinecap="butt"
                                                        stroke="var(--color-warning)"
                                                        strokeDasharray={`${mediumFillLength} ${circumference - mediumFillLength}`}
                                                        strokeDashoffset={-posMedium}
                                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                                        animate={{ strokeDasharray: `${mediumFillLength} ${circumference - mediumFillLength}` }}
                                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.16 }}
                                                    />
                                                </g>
                                            </g>
                                        )}
                                    </g>
                                )}

                                {/* Hard Tier: Background Track & Masked Linear Solved Fill */}
                                {hardAlloc > 0 && (
                                    <g key="hard-tier-group">
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
                                        {hard.solved > 0 && hardFillLength > 0 && (
                                            <g filter={`url(#${glowHardId})`}>
                                                <g mask={`url(#${maskHardId})`}>
                                                    <motion.circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        strokeWidth={strokeWidthVal}
                                                        fill="none"
                                                        strokeLinecap="butt"
                                                        stroke="var(--color-destructive)"
                                                        strokeDasharray={`${hardFillLength} ${circumference - hardFillLength}`}
                                                        strokeDashoffset={-posHard}
                                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                                        animate={{ strokeDasharray: `${hardFillLength} ${circumference - hardFillLength}` }}
                                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.24 }}
                                                    />
                                                </g>
                                            </g>
                                        )}
                                    </g>
                                )}
                            </motion.g>
                        ) : (
                            /* MODE 2: Status Distribution Mode (Solved = Green, Unsolved = Dim) */
                            <motion.g
                                key="status-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* 1. Full 270° Unsolved Track (Dim Slate) */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    strokeWidth={strokeWidthVal}
                                    fill="none"
                                    strokeLinecap="round"
                                    className="stroke-foreground-light-shade3/30 dark:stroke-foreground-dark-shade3/30"
                                    strokeDasharray={`${statusTrackLength} ${circumference - statusTrackLength}`}
                                    strokeDashoffset={offsetStatusTrack}
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={{ strokeDasharray: `${statusTrackLength} ${circumference - statusTrackLength}` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />

                                {/* 2. Exact Linear Solved Portion (Green) Masked to Gauge Track */}
                                {safeSolved > 0 && statusFillLength > 0 && (
                                    <g filter={`url(#${glowSolvedId})`}>
                                        <g mask={`url(#${maskStatusId})`}>
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                strokeWidth={strokeWidthVal}
                                                fill="none"
                                                strokeLinecap="butt"
                                                stroke="var(--color-success)"
                                                strokeDasharray={`${statusFillLength} ${circumference - statusFillLength}`}
                                                strokeDashoffset={0}
                                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                                animate={{ strokeDasharray: `${statusFillLength} ${circumference - statusFillLength}` }}
                                                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0 }}
                                            />
                                        </g>
                                    </g>
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


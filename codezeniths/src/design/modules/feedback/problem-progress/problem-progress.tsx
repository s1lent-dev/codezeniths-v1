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

    // Determine current mode
    const isStatusMode = interactive
        ? defaultMode === 'difficulty'
            ? isHovered
            : !isHovered
        : defaultMode === 'status';

    // SVG Geometry Constants
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ~282.743
    const totalSpanFraction = 0.75; // 270 degrees semi-circle open ring
    const totalGaugeArcLength = circumference * totalSpanFraction; // ~212.057px

    // Refined 3.5px stroke width and rounded linecap overhang compensation
    const strokeWidthVal = 3.5;
    const strokeOverhang = 3.5;
    const gapPx = 8;

    // Total problems sum for proportional calculations
    const calcTotalProblems = Math.max(1, totalProblems || (easy.total + medium.total + hard.total));

    // =========================================================================
    // DIFFICULTY MODE: Proportional Slices for Easy (Teal), Medium (Yellow), Hard (Red)
    // =========================================================================
    const easyShare = Math.min(1, Math.max(0, easy.total / calcTotalProblems));
    const mediumShare = Math.min(1 - easyShare, Math.max(0, medium.total / calcTotalProblems));
    const hardShare = Math.min(1 - easyShare - mediumShare, Math.max(0, hard.total / calcTotalProblems));

    const activeDiffSegmentsCount = (easyShare > 0 ? 1 : 0) + (mediumShare > 0 ? 1 : 0) + (hardShare > 0 ? 1 : 0);
    const totalDiffGapsPx = activeDiffSegmentsCount > 1 ? (activeDiffSegmentsCount - 1) * gapPx : 0;
    const availableDiffLength = Math.max(0, totalGaugeArcLength - totalDiffGapsPx);

    // Allocated track lengths per difficulty tier based on total problems per tier
    const rawEasyTotalLength = availableDiffLength * easyShare;
    const rawMediumTotalLength = availableDiffLength * mediumShare;
    const rawHardTotalLength = availableDiffLength * hardShare;

    const easyTrackLength = Math.max(0, rawEasyTotalLength - (easyShare > 0 ? strokeOverhang : 0));
    const mediumTrackLength = Math.max(0, rawMediumTotalLength - (mediumShare > 0 ? strokeOverhang : 0));
    const hardTrackLength = Math.max(0, rawHardTotalLength - (hardShare > 0 ? strokeOverhang : 0));

    // Exact sub-pixel linear progress fill lengths with rounded linecap overhang compensation
    const rawEasyFill = rawEasyTotalLength * (easy.total > 0 ? Math.min(1, Math.max(0, easy.solved / easy.total)) : 0);
    const rawMediumFill = rawMediumTotalLength * (medium.total > 0 ? Math.min(1, Math.max(0, medium.solved / medium.total)) : 0);
    const rawHardFill = rawHardTotalLength * (hard.total > 0 ? Math.min(1, Math.max(0, hard.solved / hard.total)) : 0);

    const easyFillLength = easy.solved > 0
        ? Math.max(0.1, rawEasyFill > strokeOverhang ? rawEasyFill - strokeOverhang : rawEasyFill)
        : 0;
    const mediumFillLength = medium.solved > 0
        ? Math.max(0.1, rawMediumFill > strokeOverhang ? rawMediumFill - strokeOverhang : rawMediumFill)
        : 0;
    const hardFillLength = hard.solved > 0
        ? Math.max(0.1, rawHardFill > strokeOverhang ? rawHardFill - strokeOverhang : rawHardFill)
        : 0;

    // Offsets for Difficulty Mode along the 270-degree arc
    const offsetEasy = 0;
    const offsetMedium = -(rawEasyTotalLength + gapPx);
    const offsetHard = -(rawEasyTotalLength + gapPx + rawMediumTotalLength + gapPx);

    // =========================================================================
    // STATUS DISTRIBUTION MODE: Exact Proportional Shares for Solved, Revisit, Unsolved
    // =========================================================================
    const solvedShare = Math.min(1, Math.max(0, solved / calcTotalProblems));
    const revisitShare = Math.min(1 - solvedShare, Math.max(0, revisitCount / calcTotalProblems));
    const unsolvedShare = Math.min(1 - solvedShare - revisitShare, Math.max(0, unsolved / calcTotalProblems));

    const activeStatusSegmentsCount = (solvedShare > 0 ? 1 : 0) + (revisitShare > 0 ? 1 : 0) + (unsolvedShare > 0 ? 1 : 0);
    const totalStatusGapsPx = activeStatusSegmentsCount > 1 ? (activeStatusSegmentsCount - 1) * gapPx : 0;
    const availableStatusLength = Math.max(0, totalGaugeArcLength - totalStatusGapsPx);

    const rawDistSolvedLength = availableStatusLength * solvedShare;
    const rawDistRevisitLength = availableStatusLength * revisitShare;
    const rawDistUnsolvedLength = availableStatusLength * unsolvedShare;

    const distSolvedLength = solved > 0
        ? Math.max(0.1, rawDistSolvedLength > strokeOverhang ? rawDistSolvedLength - strokeOverhang : rawDistSolvedLength)
        : 0;
    const distRevisitLength = revisitCount > 0
        ? Math.max(0.1, rawDistRevisitLength > strokeOverhang ? rawDistRevisitLength - strokeOverhang : rawDistRevisitLength)
        : 0;
    const distUnsolvedLength = unsolved > 0
        ? Math.max(0.1, rawDistUnsolvedLength > strokeOverhang ? rawDistUnsolvedLength - strokeOverhang : rawDistUnsolvedLength)
        : 0;

    const offsetDistSolved = 0;
    const offsetDistRevisit = -(rawDistSolvedLength + gapPx);
    const offsetDistUnsolved = -(rawDistSolvedLength + gapPx + rawDistRevisitLength + gapPx);

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
            {/* SVG Semi-Circle Gauge Container with Glowing Filters */}
            <div className="relative size-44 flex items-center justify-center">
                <svg
                    className="size-full overflow-visible"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        {/* Glow Filter for Easy Arc (Teal) */}
                        <filter id="glow-cp-easy" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feFlood floodColor="#00b8a3" floodOpacity="0.5" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Glow Filter for Medium Arc (Yellow) */}
                        <filter id="glow-cp-medium" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feFlood floodColor="#feb800" floodOpacity="0.5" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Glow Filter for Hard Arc (Red) */}
                        <filter id="glow-cp-hard" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feFlood floodColor="#ff2d55" floodOpacity="0.5" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Glow Filter for Solved Arc (Green) */}
                        <filter id="glow-cp-solved" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feFlood floodColor="#2cbb5d" floodOpacity="0.5" result="c" />
                            <feComposite in="c" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <AnimatePresence mode="wait">
                        {!isStatusMode ? (
                            /* MODE 1: Difficulty Mode (Easy = Teal #00b8a3, Medium = Yellow #feb800, Hard = Red #ff2d55) */
                            <motion.g
                                key="difficulty-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Easy Tier: Background Track & Solved Fill */}
                                {rawEasyTotalLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-teal/18"
                                        strokeDasharray={`${easyTrackLength} ${circumference - easyTrackLength}`}
                                        strokeDashoffset={offsetEasy}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${easyTrackLength} ${circumference - easyTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}
                                    />
                                )}
                                {easyFillLength > 0 && (
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
                                {rawMediumTotalLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-warning/18"
                                        strokeDasharray={`${mediumTrackLength} ${circumference - mediumTrackLength}`}
                                        strokeDashoffset={offsetMedium}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${mediumTrackLength} ${circumference - mediumTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
                                    />
                                )}
                                {mediumFillLength > 0 && (
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
                                {rawHardTotalLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-destructive/18"
                                        strokeDasharray={`${hardTrackLength} ${circumference - hardTrackLength}`}
                                        strokeDashoffset={offsetHard}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${hardTrackLength} ${circumference - hardTrackLength}` }}
                                        transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
                                    />
                                )}
                                {hardFillLength > 0 && (
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
                            /* MODE 2: Status Distribution Mode (Solved = Green #2cbb5d, Revisit = Amber #feb800, Unsolved = Dim) */
                            <motion.g
                                key="status-arcs"
                                className="transform rotate-135 origin-[50px_50px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* 1. Solved Share Arc (Green) */}
                                {distSolvedLength > 0 && (
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

                                {/* 2. Revisit Share Arc (Amber) */}
                                {distRevisitLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        stroke="var(--color-warning)"
                                        filter="url(#glow-cp-medium)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${distRevisitLength} ${circumference - distRevisitLength}`}
                                        strokeDashoffset={offsetDistRevisit}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${distRevisitLength} ${circumference - distRevisitLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.08 }}
                                    />
                                )}

                                {/* 3. Unsolved Share Arc (Dim Slate/Grey) */}
                                {distUnsolvedLength > 0 && (
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        strokeWidth={strokeWidthVal}
                                        fill="none"
                                        strokeLinecap="round"
                                        className="stroke-foreground-light-shade3/40 dark:stroke-foreground-dark-shade3/40"
                                        strokeDasharray={`${distUnsolvedLength} ${circumference - distUnsolvedLength}`}
                                        strokeDashoffset={offsetDistUnsolved}
                                        initial={{ strokeDasharray: `0 ${circumference}` }}
                                        animate={{ strokeDasharray: `${distUnsolvedLength} ${circumference - distUnsolvedLength}` }}
                                        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.16 }}
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
                                        /{calcTotalProblems}
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

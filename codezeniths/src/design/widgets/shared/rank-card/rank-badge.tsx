'use client';

import React from 'react';
import Image from 'next/image';
import { Shield, Sparkles, Award, Zap, Flame, Crown, Diamond, CircleDot } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    RankTier,
    Division,
    getRankFromScore,
    RANK_DEFINITIONS,
    UNRANKED_DEFINITION,
    RankDefinition,
} from '@/utils/rank.utils';
import { RANK_SVG_MAP } from '@/assets/ranks';

export interface RankBadgeProps {
    score?: number;
    tier?: RankTier;
    division?: Division;
    rankTitle?: string;
    customText?: string;
    customIcon?: React.FC<{ className?: string }>;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    showDivision?: boolean;
    showIcon?: boolean;
    useSvgIcon?: boolean;
    showGlow?: boolean;
    className?: string;
}

const tierIcons: Record<RankTier, React.FC<{ className?: string }>> = {
    UNRANKED: CircleDot,
    GUARDIAN: Shield,
    KNIGHT: Award,
    VANGUARD: Zap,
    MAVEN: Flame,
    ASCENDANT: Diamond,
    OMNISCIENT: Sparkles,
    ZENITH: Crown,
};

export const RankBadge: React.FC<RankBadgeProps> = ({
    score,
    tier,
    division,
    rankTitle,
    customText,
    customIcon,
    size = 'sm',
    showDivision = true,
    showIcon = true,
    useSvgIcon = false,
    showGlow = false,
    className,
}) => {
    let rankMeta: RankDefinition;

    if (score !== undefined) {
        rankMeta = getRankFromScore(score);
    } else if (tier === 'UNRANKED' || rankTitle?.toLowerCase() === 'unranked') {
        rankMeta = UNRANKED_DEFINITION;
    } else if (tier) {
        const found = RANK_DEFINITIONS.find(
            (r) => r.tier === tier && (!division || r.division === division)
        );
        rankMeta = found || UNRANKED_DEFINITION;
    } else if (rankTitle) {
        const found = RANK_DEFINITIONS.find(
            (r) => r.name.toLowerCase() === rankTitle.toLowerCase()
        );
        rankMeta = found || UNRANKED_DEFINITION;
    } else {
        rankMeta = UNRANKED_DEFINITION;
    }

    const IconComponent = customIcon || tierIcons[rankMeta.tier] || Shield;
    const svgAsset = RANK_SVG_MAP[rankMeta.svgKey] || RANK_SVG_MAP['Unranked'];

    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-[9px] gap-1',
        sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
        md: 'px-3 py-1 text-xs gap-1.5',
        lg: 'px-3.5 py-1.5 text-sm gap-2',
    };

    const iconSizes = {
        xs: 'size-2.5',
        sm: 'size-3',
        md: 'size-3.5',
        lg: 'size-4',
    };

    const svgSizes = {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
    };

    return (
        <span
            style={{
                boxShadow: showGlow ? `0 0 12px ${rankMeta.glowColor}` : undefined,
            }}
            className={cn(
                'inline-flex items-center font-bold tracking-wider uppercase rounded-full border transition-all select-none',
                sizeClasses[size],
                rankMeta.badgeClass,
                className
            )}
            title={`${rankMeta.name} (${rankMeta.minScore.toLocaleString()} - ${rankMeta.maxScore.toLocaleString()} pts) — ${rankMeta.description}`}
        >
            {showIcon && (
                !customIcon && useSvgIcon && svgAsset ? (
                    <Image
                        src={svgAsset}
                        alt={rankMeta.name}
                        width={svgSizes[size]}
                        height={svgSizes[size]}
                        className={cn('shrink-0 object-contain', iconSizes[size])}
                    />
                ) : (
                    <IconComponent className={cn('shrink-0', iconSizes[size])} />
                )
            )}
            <span className="truncate">
                {customText || (showDivision ? rankMeta.name : rankMeta.tier)}
            </span>
        </span>
    );
};

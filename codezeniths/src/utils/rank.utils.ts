import { z } from 'zod';

export const RankTierEnum = z.enum([
    'UNRANKED',
    'GUARDIAN',
    'KNIGHT',
    'VANGUARD',
    'MAVEN',
    'ASCENDANT',
    'OMNISCIENT',
    'ZENITH',
]);
export type RankTier = z.infer<typeof RankTierEnum>;

export const DivisionEnum = z.enum(['I', 'II', 'III', 'NONE']);
export type Division = z.infer<typeof DivisionEnum>;

export const RankDefinitionSchema = z.object({
    tier: RankTierEnum,
    division: DivisionEnum,
    name: z.string(),
    minScore: z.number().int(),
    maxScore: z.number().int(),
    color: z.string(),
    textColor: z.string(),
    gradient: z.string(),
    badgeClass: z.string(),
    glowColor: z.string(),
    description: z.string(),
    svgKey: z.string(),
});
export type RankDefinition = z.infer<typeof RankDefinitionSchema>;

export const UserRankProgressSchema = z.object({
    currentRank: RankDefinitionSchema,
    nextRank: RankDefinitionSchema.nullable(),
    score: z.number().int(),
    progressPercentage: z.number().min(0).max(100),
    pointsToNextRank: z.number().int(),
    isMaxRank: z.boolean(),
});
export type UserRankProgress = z.infer<typeof UserRankProgressSchema>;

/**
 * 0-Score Unranked Definition (Secondary theme color #565F89)
 */
export const UNRANKED_DEFINITION: RankDefinition = {
    tier: 'UNRANKED',
    division: 'NONE',
    name: 'Unranked',
    minScore: 0,
    maxScore: 9,
    color: '#565F89',
    textColor: 'text-secondary',
    gradient: 'from-secondary to-secondary-shade2',
    badgeClass: 'bg-secondary/15 text-secondary border-secondary/30',
    glowColor: 'rgba(86, 95, 137, 0.25)',
    description: 'Solve 1 problem to unlock Guardian I.',
    svgKey: 'Unranked',
};

/**
 * 21-Tier Rank Progression Matrix for Codezeniths (Maximum platform score: 51,260 pts).
 *
 * Theme palette:
 * - Unranked: Secondary (#565F89)
 * - Guardian: Body Theme Tone (#9AA3C9 / text-body-light dark:text-body-dark)
 * - Knight: Teal (#14B8A6 / text-teal-400)
 * - Vanguard: Rose (#F43F5E / text-rose-400)
 * - Maven: Amber (#F59E0B / text-amber-400)
 * - Ascendant: Emerald (#10B981 / text-emerald-400)
 * - Omniscient: Purple (#A855F7 / text-purple-400)
 * - Zenith: Primary (#6A7CFF / text-primary)
 */
export const RANK_DEFINITIONS: RankDefinition[] = [
    // ─── 1. GUARDIAN (10 - 2,499 pts) ── Body theme tone ─────────────────────
    {
        tier: 'GUARDIAN',
        division: 'I',
        name: 'Guardian I',
        minScore: 10,
        maxScore: 499,
        color: '#9AA3C9',
        textColor: 'text-body-light dark:text-body-dark',
        gradient: 'from-secondary-shade1 to-secondary',
        badgeClass: 'bg-secondary/10 text-body-light dark:text-body-dark border-secondary/25',
        glowColor: 'rgba(154, 163, 201, 0.2)',
        description: 'First steps into algorithmic problem solving.',
        svgKey: 'Guardian-I',
    },
    {
        tier: 'GUARDIAN',
        division: 'II',
        name: 'Guardian II',
        minScore: 500,
        maxScore: 1199,
        color: '#A9B1D6',
        textColor: 'text-body-light dark:text-body-dark',
        gradient: 'from-secondary to-secondary-shade1',
        badgeClass: 'bg-secondary/15 text-body-light dark:text-body-dark border-secondary/35',
        glowColor: 'rgba(169, 177, 214, 0.25)',
        description: 'Consistently solving fundamental problems.',
        svgKey: 'Guardian-II',
    },
    {
        tier: 'GUARDIAN',
        division: 'III',
        name: 'Guardian III',
        minScore: 1200,
        maxScore: 2499,
        color: '#BAC3E8',
        textColor: 'text-heading-light dark:text-heading-dark',
        gradient: 'from-secondary-shade1 to-primary-shade3',
        badgeClass: 'bg-secondary/20 text-heading-light dark:text-heading-dark border-secondary/40',
        glowColor: 'rgba(186, 195, 232, 0.3)',
        description: 'Mastered basic patterns and ready to advance.',
        svgKey: 'Guardian-III',
    },

    // ─── 2. KNIGHT (2,500 - 7,499 pts) ── Teal ───────────────────────────────
    {
        tier: 'KNIGHT',
        division: 'I',
        name: 'Knight I',
        minScore: 2500,
        maxScore: 3999,
        color: '#14B8A6',
        textColor: 'text-teal-400',
        gradient: 'from-teal-500 to-teal-700',
        badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/25',
        glowColor: 'rgba(20, 184, 166, 0.25)',
        description: 'Building solid algorithmic foundations across data structures.',
        svgKey: 'Knight-I',
    },
    {
        tier: 'KNIGHT',
        division: 'II',
        name: 'Knight II',
        minScore: 4000,
        maxScore: 5699,
        color: '#2DD4BF',
        textColor: 'text-teal-300',
        gradient: 'from-teal-400 to-teal-600',
        badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/35',
        glowColor: 'rgba(45, 212, 191, 0.3)',
        description: 'Comfortably tackling intermediate medium-difficulty problems.',
        svgKey: 'Knight-II',
    },
    {
        tier: 'KNIGHT',
        division: 'III',
        name: 'Knight III',
        minScore: 5700,
        maxScore: 7499,
        color: '#5EEAD4',
        textColor: 'text-teal-200',
        gradient: 'from-teal-300 to-teal-500',
        badgeClass: 'bg-teal-500/20 text-teal-200 border-teal-400/45 shadow-sm',
        glowColor: 'rgba(94, 234, 212, 0.35)',
        description: 'Elite knight with wide algorithmic coverage.',
        svgKey: 'Knight-III',
    },

    // ─── 3. VANGUARD (7,500 - 14,999 pts) ── Rose ────────────────────────────
    {
        tier: 'VANGUARD',
        division: 'I',
        name: 'Vanguard I',
        minScore: 7500,
        maxScore: 9699,
        color: '#F43F5E',
        textColor: 'text-rose-400',
        gradient: 'from-rose-500 to-rose-700',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
        glowColor: 'rgba(244, 63, 94, 0.25)',
        description: 'Leading the frontlines of competitive programming.',
        svgKey: 'Vanguard-I',
    },
    {
        tier: 'VANGUARD',
        division: 'II',
        name: 'Vanguard II',
        minScore: 9700,
        maxScore: 12199,
        color: '#FB7185',
        textColor: 'text-rose-300',
        gradient: 'from-rose-400 to-rose-600',
        badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/35',
        glowColor: 'rgba(251, 113, 133, 0.3)',
        description: 'Commanding mastery over graph, tree, and dynamic programming topics.',
        svgKey: 'Vanguard-II',
    },
    {
        tier: 'VANGUARD',
        division: 'III',
        name: 'Vanguard III',
        minScore: 12200,
        maxScore: 14999,
        color: '#FDA4AF',
        textColor: 'text-rose-200',
        gradient: 'from-rose-300 to-rose-500',
        badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/45 shadow-sm',
        glowColor: 'rgba(253, 164, 175, 0.35)',
        description: 'Formidable vanguard ready to enter the Maven ranks.',
        svgKey: 'Vanguard-III',
    },

    // ─── 4. MAVEN (15,000 - 24,999 pts) ── Amber ─────────────────────────────
    {
        tier: 'MAVEN',
        division: 'I',
        name: 'Maven I',
        minScore: 15000,
        maxScore: 17999,
        color: '#F59E0B',
        textColor: 'text-amber-400',
        gradient: 'from-amber-500 to-amber-700',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
        glowColor: 'rgba(245, 158, 11, 0.25)',
        description: 'Expert knowledge across complex algorithmic domains.',
        svgKey: 'Maven-I',
    },
    {
        tier: 'MAVEN',
        division: 'II',
        name: 'Maven II',
        minScore: 18000,
        maxScore: 21299,
        color: '#FBBF24',
        textColor: 'text-amber-300',
        gradient: 'from-amber-400 to-amber-600',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
        glowColor: 'rgba(251, 191, 36, 0.3)',
        description: 'Seasoned problem solver routinely conquering hard challenges.',
        svgKey: 'Maven-II',
    },
    {
        tier: 'MAVEN',
        division: 'III',
        name: 'Maven III',
        minScore: 21300,
        maxScore: 24999,
        color: '#FDE68A',
        textColor: 'text-amber-200',
        gradient: 'from-amber-300 to-amber-500',
        badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/45 shadow-sm',
        glowColor: 'rgba(253, 230, 138, 0.35)',
        description: 'Revered maven among the top problem solvers on the platform.',
        svgKey: 'Maven-III',
    },

    // ─── 5. ASCENDANT (25,000 - 35,999 pts) ── Emerald ───────────────────────
    {
        tier: 'ASCENDANT',
        division: 'I',
        name: 'Ascendant I',
        minScore: 25000,
        maxScore: 28399,
        color: '#10B981',
        textColor: 'text-emerald-400',
        gradient: 'from-emerald-500 to-emerald-700',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
        glowColor: 'rgba(16, 185, 129, 0.25)',
        description: 'Ascending beyond conventional limits into advanced algorithmic mastery.',
        svgKey: 'Ascendant-I',
    },
    {
        tier: 'ASCENDANT',
        division: 'II',
        name: 'Ascendant II',
        minScore: 28400,
        maxScore: 31999,
        color: '#34D399',
        textColor: 'text-emerald-300',
        gradient: 'from-emerald-400 to-emerald-600',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
        glowColor: 'rgba(52, 211, 153, 0.3)',
        description: 'Demonstrating effortless prowess on high-tier hard problems.',
        svgKey: 'Ascendant-II',
    },
    {
        tier: 'ASCENDANT',
        division: 'III',
        name: 'Ascendant III',
        minScore: 32000,
        maxScore: 35999,
        color: '#6EE7B7',
        textColor: 'text-emerald-200',
        gradient: 'from-emerald-300 to-emerald-500',
        badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/45 shadow-sm',
        glowColor: 'rgba(110, 231, 183, 0.35)',
        description: 'Apex ascendant standing at the threshold of omniscience.',
        svgKey: 'Ascendant-III',
    },

    // ─── 6. OMNISCIENT (36,000 - 45,999 pts) ── Purple ────────────────────────
    {
        tier: 'OMNISCIENT',
        division: 'I',
        name: 'Omniscient I',
        minScore: 36000,
        maxScore: 38999,
        color: '#A855F7',
        textColor: 'text-purple-400',
        gradient: 'from-purple-500 to-purple-700',
        badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/25 shadow-sm',
        glowColor: 'rgba(168, 85, 247, 0.28)',
        description: 'Near-universal understanding of algorithmic paradigm and theory.',
        svgKey: 'Omniscient-I',
    },
    {
        tier: 'OMNISCIENT',
        division: 'II',
        name: 'Omniscient II',
        minScore: 39000,
        maxScore: 42299,
        color: '#C084FC',
        textColor: 'text-purple-300',
        gradient: 'from-purple-400 to-purple-600',
        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/35 shadow-md',
        glowColor: 'rgba(192, 132, 252, 0.35)',
        description: 'Grandmaster tier problem solver with vast problem coverage.',
        svgKey: 'Omniscient-II',
    },
    {
        tier: 'OMNISCIENT',
        division: 'III',
        name: 'Omniscient III',
        minScore: 42300,
        maxScore: 45999,
        color: '#E9D5FF',
        textColor: 'text-purple-200',
        gradient: 'from-purple-300 to-purple-500',
        badgeClass: 'bg-purple-500/20 text-purple-200 border-purple-400/45 shadow-lg',
        glowColor: 'rgba(233, 213, 255, 0.4)',
        description: 'Supreme omniscient on the verge of reaching the Zenith.',
        svgKey: 'Omniscient-III',
    },

    // ─── 7. ZENITH (46,000 - 51,260+ pts) ── Primary (#6A7CFF) ───────────────
    {
        tier: 'ZENITH',
        division: 'I',
        name: 'Zenith I',
        minScore: 46000,
        maxScore: 47999,
        color: '#6A7CFF',
        textColor: 'text-primary dark:text-primary-shade1',
        gradient: 'from-primary to-primary-shade3',
        badgeClass: 'bg-primary/15 text-primary dark:text-primary-shade1 border-primary/35 shadow-md',
        glowColor: 'rgba(106, 124, 255, 0.35)',
        description: 'The pinnacle of Codezeniths. One of the highest-rated problem solvers.',
        svgKey: 'Zenith-I',
    },
    {
        tier: 'ZENITH',
        division: 'II',
        name: 'Zenith II',
        minScore: 48000,
        maxScore: 49999,
        color: '#8A98FF',
        textColor: 'text-primary-shade1 dark:text-primary-shade1',
        gradient: 'from-primary-shade1 via-primary to-primary-shade2 shadow-primary/30',
        badgeClass: 'bg-primary/20 text-primary-shade1 border-primary/50 shadow-lg',
        glowColor: 'rgba(138, 152, 255, 0.45)',
        description: 'Legendary mastery. Over 95% of all problems on the platform solved.',
        svgKey: 'Zenith-II',
    },
    {
        tier: 'ZENITH',
        division: 'III',
        name: 'Zenith III',
        minScore: 50000,
        maxScore: 51260,
        color: '#A0AEFC',
        textColor: 'text-heading-dark-shade1',
        gradient: 'from-primary-shade1 via-heading-dark to-primary shadow-primary/50',
        badgeClass: 'bg-linear-to-r from-primary/25 via-primary-shade1/20 to-primary/25 text-heading-dark-shade1 border-primary-shade1/60 shadow-xl shadow-primary/25 ring-1 ring-primary/40',
        glowColor: 'rgba(160, 174, 252, 0.6)',
        description: 'The ultimate apex. 100% complete algorithmic domination.',
        svgKey: 'Zenith-III',
    },
];

/**
 * Calculates current rank definition and progress towards the next division/tier.
 */
export function getRankProgress(score: number): UserRankProgress {
    const cleanScore = Math.max(0, score);

    // If score is 0, user is Unranked
    if (cleanScore === 0) {
        return {
            currentRank: UNRANKED_DEFINITION,
            nextRank: RANK_DEFINITIONS[0], // Guardian I (minScore: 10)
            score: 0,
            progressPercentage: 0,
            pointsToNextRank: 10,
            isMaxRank: false,
        };
    }

    const index = RANK_DEFINITIONS.findIndex(
        (r) => cleanScore >= r.minScore && cleanScore <= r.maxScore
    );

    const currentIndex = index === -1 ? RANK_DEFINITIONS.length - 1 : index;
    const currentRank = RANK_DEFINITIONS[currentIndex];
    const nextRank = currentIndex < RANK_DEFINITIONS.length - 1 ? RANK_DEFINITIONS[currentIndex + 1] : null;

    if (!nextRank) {
        return {
            currentRank,
            nextRank: null,
            score: cleanScore,
            progressPercentage: 100,
            pointsToNextRank: 0,
            isMaxRank: true,
        };
    }

    const rangeSpan = currentRank.maxScore - currentRank.minScore + 1;
    const pointsInTier = cleanScore - currentRank.minScore;
    const progressPercentage = Math.min(100, Math.max(0, Math.round((pointsInTier / rangeSpan) * 100)));
    const pointsToNextRank = Math.max(0, nextRank.minScore - cleanScore);

    return {
        currentRank,
        nextRank,
        score: cleanScore,
        progressPercentage,
        pointsToNextRank,
        isMaxRank: false,
    };
}

/**
 * Returns the RankDefinition for a given score.
 */
export function getRankFromScore(score: number): RankDefinition {
    return getRankProgress(score).currentRank;
}

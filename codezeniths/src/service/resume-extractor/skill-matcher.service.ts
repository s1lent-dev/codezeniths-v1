import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@/service/logging';

import { COMMON_SKILL_ALIASES } from './skill-aliases';
import { SKILL_IMPORTANCE } from './skill-importance';

export async function matchSkillsWithDatabase(
    extractedSkills: string[],
    existingSkills: string[] = []
): Promise<{ matchedSkills: string[]; totalMatched: number }> {
    logger.info('[skill-matcher] Starting DB skill matching', {
        extractedCount: extractedSkills.length,
        existingCount: existingSkills.length,
    });

    try {
        const dbSkills = await prisma.skill.findMany({
            select: { title: true },
        });

        const dbTitleMap = new Map<string, string>();
        for (const s of dbSkills) {
            dbTitleMap.set(s.title.toLowerCase(), s.title);
        }

        const lockedSkills = new Set<string>();

        // 1. Add existing user-selected skills first, validating they exist in DB (These are locked)
        for (const existing of existingSkills) {
            if (existing && existing.trim()) {
                const trimmed = existing.trim();
                const lower = trimmed.toLowerCase();
                if (dbTitleMap.has(lower)) {
                    lockedSkills.add(dbTitleMap.get(lower)!);
                } else if (COMMON_SKILL_ALIASES[lower] && dbTitleMap.has(COMMON_SKILL_ALIASES[lower].toLowerCase())) {
                    lockedSkills.add(dbTitleMap.get(COMMON_SKILL_ALIASES[lower].toLowerCase())!);
                }
            }
        }

        const aiSkills = new Set<string>();

        // 2. Match extracted AI skills
        for (const rawSkill of extractedSkills) {
            const trimmed = rawSkill.trim();
            const lower = trimmed.toLowerCase();

            // Direct exact case-insensitive match
            if (dbTitleMap.has(lower)) {
                aiSkills.add(dbTitleMap.get(lower)!);
                continue;
            }

            // Alias match
            const aliasNormalized = COMMON_SKILL_ALIASES[lower];
            if (aliasNormalized && dbTitleMap.has(aliasNormalized.toLowerCase())) {
                aiSkills.add(dbTitleMap.get(aliasNormalized.toLowerCase())!);
                continue;
            }

            // Partial match check against seeded skills
            for (const [dbLower, dbOriginal] of dbTitleMap.entries()) {
                if (dbLower === lower || (lower.length > 2 && dbLower.includes(lower))) {
                    aiSkills.add(dbOriginal);
                    break;
                }
            }
        }

        // Sort new AI skills by importance and only take what's needed to fill the 15 limit
        const newUniqueAiSkills = Array.from(aiSkills)
            .filter(skill => !lockedSkills.has(skill))
            .sort((a, b) => {
                const scoreA = SKILL_IMPORTANCE[a] ?? 50;
                const scoreB = SKILL_IMPORTANCE[b] ?? 50;
                return scoreB - scoreA;
            });

        const lockedArray = Array.from(lockedSkills);
        const remainingSlots = Math.max(0, 15 - lockedArray.length);
        const finalSkillsList = [...lockedArray, ...newUniqueAiSkills.slice(0, remainingSlots)];

        logger.info('[skill-matcher] Skill matching complete', {
            finalCount: finalSkillsList.length,
            skills: finalSkillsList,
        });

        return {
            matchedSkills: finalSkillsList,
            totalMatched: finalSkillsList.length,
        };
    } catch (error: any) {
        logger.error('[skill-matcher] Error during skill matching', { error: String(error) });
        // Fallback to strictly empty if we cannot hit the DB, to ensure 100% DB-only compliance.
        return {
            matchedSkills: [],
            totalMatched: 0,
        };
    }
}

import { z } from 'zod';
import { LevelSchema } from '../../db.schema';

export const ProblemFilterInputSchema = z.object({
    moduleSlug: z.string().optional(),
    topicSlug: z.string().optional(),
    topicLevel: LevelSchema.optional(),
    playlistSlug: z.string().optional(),
    playlistId: z.string().optional(),
    searchScope: z.enum(['topic', 'problem']).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    tagSlugs: z.array(z.string()).optional(),
    status: z.enum(['solved', 'not_solved']).optional(),
    revisit: z.boolean().optional(),
    favourite: z.boolean().optional(),
    bookmarkedTopics: z.boolean().optional(),
    search: z.string().optional(),
});

export type ProblemFilterInput = z.infer<typeof ProblemFilterInputSchema>;

export const ProblemSortingInputSchema = z.object({
    sortBy: z.enum(['name', 'difficulty', 'createdAt', 'popularity', 'topicLevel']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export type ProblemSortingInput = z.infer<typeof ProblemSortingInputSchema>;


import { z } from 'zod';

export const ProblemFilterInputSchema = z.object({
    moduleSlug: z.string().optional(),
    topicSlug: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    tagSlugs: z.array(z.string()).optional(),
    status: z.enum(['solved', 'revisit', 'not_solved']).optional(),
    favourite: z.boolean().optional(),
    search: z.string().optional(),
});

export type ProblemFilterInput = z.infer<typeof ProblemFilterInputSchema>;

export const ProblemSortingInputSchema = z.object({
    sortBy: z.enum(['name', 'difficulty', 'createdAt', 'popularity']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export type ProblemSortingInput = z.infer<typeof ProblemSortingInputSchema>;

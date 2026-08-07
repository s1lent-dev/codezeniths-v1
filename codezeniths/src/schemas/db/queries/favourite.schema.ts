import { z } from 'zod';

// ─── getFavouriteInfo ──────────────────────────────────────────────────────

export const GetFavouriteInfoInputSchema = z.object({
    userId: z.string().uuid(),
});

export type GetFavouriteInfoInput = z.infer<typeof GetFavouriteInfoInputSchema>;

export const GetFavouriteInfoOutputSchema = z.object({
    title: z.string(),
    description: z.string(),
    progress: z.object({
        problemsCount: z.number(),
        problemsSolvedCount: z.number(),
        problemsRevisitCount: z.number(),
        problemNotSolvedCount: z.number(),
        problemsSolvedPercentage: z.number(),
        problemsCountByDifficulty: z.object({
            easy: z.number(),
            medium: z.number(),
            hard: z.number(),
        }),
        problemsSolvedCountByDifficulty: z.object({
            easy: z.number(),
            medium: z.number(),
            hard: z.number(),
        }),
    }),
});

export type GetFavouriteInfoOutput = z.infer<typeof GetFavouriteInfoOutputSchema>;

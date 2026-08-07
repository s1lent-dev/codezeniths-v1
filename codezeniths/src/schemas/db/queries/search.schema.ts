import { z } from 'zod';
import { Difficulty } from '@prisma/client';

export const GetSearchProblemsInputSchema = z.object({}).optional();
export const GetSearchProblemsOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        difficulty: z.enum(Object.values(Difficulty) as [string, ...string[]]),
        tags: z.array(z.string()),
        topic: z.string().nullable(),
        module: z.string().nullable(),
        phoneticTitle: z.string().optional(),
    })
);

export const GetSearchSkillsInputSchema = z.object({}).optional();
export const GetSearchSkillsOutputSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        phoneticName: z.string().optional(),
    })
);

export const GetSearchTagsInputSchema = z.object({}).optional();
export const GetSearchTagsOutputSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        phoneticName: z.string().optional(),
    })
);

import { Difficulty } from '@prisma/client';
import { z } from 'zod';

export const SearchProblemIndexSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    difficulty: z.enum(Difficulty),
    tags: z.array(z.string()),
    topic: z.string().nullable(),
    module: z.string().nullable(),
    phoneticTitle: z.string().optional(),
});

export const SearchSkillIndexSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string(),
    phoneticName: z.string().optional(),
});

export const SearchTagIndexSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string(),
    phoneticName: z.string().optional(),
});

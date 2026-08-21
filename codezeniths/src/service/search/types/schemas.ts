import { Difficulty, UserRole, UserType } from '@prisma/client';
import { z } from 'zod';

export const SearchProblemIndexSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    difficulty: z.enum(Object.values(Difficulty) as [string, ...string[]]),
    tags: z.array(z.string()),
    topic: z.string().nullable(),
    module: z.string().nullable(),
    phoneticTitle: z.string().optional(),
});

export const SearchTopicIndexSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    module: z.string().nullable().optional(),
    level: z.string().nullable().optional(),
    problemsCount: z.number().optional(),
    phoneticTitle: z.string().optional(),
});

export const SearchModuleIndexSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    tagsCount: z.number().optional(),
    topicsCount: z.number().optional(),
    problemsCount: z.number().optional(),
    phoneticTitle: z.string().optional(),
});

export const SearchTagIndexSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: z.string().nullable().optional(),
    module: z.string().nullable().optional(),
    problemsCount: z.number().optional(),
    phoneticName: z.string().optional(),
});


export const SearchProductIndexSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    phoneticTitle: z.string().optional(),
});

export const SearchUserIndexSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string().nullable().optional(),
    email: z.string(),
    image: z.string().nullable().optional(),
    role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
    userType: z.enum(Object.values(UserType) as [string, ...string[]]).nullable().optional(),
    phoneticName: z.string().optional(),
    phoneticUsername: z.string().optional(),
});


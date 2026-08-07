import { z, type ZodType } from 'zod';

export const PaginationInputSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const CursorInputSchema = z.object({
    cursor: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const paginatedOutput = <T extends ZodType>(item: T) =>
    z.object({
        items: z.array(item),
        total: z.number().int(),
        page: z.number().int(),
        limit: z.number().int(),
        totalPages: z.number().int(),
        hasNextPage: z.boolean(),
    });

export const cursorOutput = <T extends ZodType>(item: T) =>
    z.object({
        items: z.array(item),
        nextCursor: z.string().uuid().nullable(),
    });

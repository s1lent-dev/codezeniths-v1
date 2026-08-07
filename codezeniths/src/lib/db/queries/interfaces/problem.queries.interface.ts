import { z } from 'zod';
import {
    GetProblemsInputSchema,
    GetProblemsOutputSchema,
    GetProblemsPaginatedInputSchema,
    GetProblemsPaginatedOutputSchema,
    GetProblemsInfiniteInputSchema,
    GetProblemsInfiniteOutputSchema,
    GetProblemsWithFiltersInputSchema,
    GetProblemsWithFiltersOutputSchema,
    UpdateProblemStatusInputSchema,
    UpdateProblemStatusOutputSchema,
    UpdateProblemNoteInputSchema,
    UpdateProblemNoteOutputSchema,
    UpdateProblemFavouriteInputSchema,
    UpdateProblemFavouriteOutputSchema,
    GetProblemTablePrimitivesInputSchema,
    GetProblemTablePrimitivesOutputSchema,
    GetProblemProgressInputSchema,
    GetProblemProgressOutputSchema,
} from '@codezeniths/schemas/db';

export interface IProblemQueries {
    getProblemTablePrimitives: (
        payload: z.infer<typeof GetProblemTablePrimitivesInputSchema>,
    ) => Promise<z.infer<typeof GetProblemTablePrimitivesOutputSchema>>;

    getProblems: (
        payload: z.infer<typeof GetProblemsInputSchema>,
    ) => Promise<z.infer<typeof GetProblemsOutputSchema>>;

    getProblemsPaginated: (
        payload: z.infer<typeof GetProblemsPaginatedInputSchema>,
    ) => Promise<z.infer<typeof GetProblemsPaginatedOutputSchema>>;

    getProblemsInfinite: (
        payload: z.infer<typeof GetProblemsInfiniteInputSchema>,
    ) => Promise<z.infer<typeof GetProblemsInfiniteOutputSchema>>;

    getProblemsWithFilters: (
        payload: z.infer<typeof GetProblemsWithFiltersInputSchema>,
    ) => Promise<z.infer<typeof GetProblemsWithFiltersOutputSchema>>;

    updateProblemStatus: (
        payload: z.infer<typeof UpdateProblemStatusInputSchema>,
    ) => Promise<z.infer<typeof UpdateProblemStatusOutputSchema>>;

    updateProblemNote: (
        payload: z.infer<typeof UpdateProblemNoteInputSchema>,
    ) => Promise<z.infer<typeof UpdateProblemNoteOutputSchema>>;

    updateProblemFavourite: (
        payload: z.infer<typeof UpdateProblemFavouriteInputSchema>,
    ) => Promise<z.infer<typeof UpdateProblemFavouriteOutputSchema>>;

    getProblemProgress: (
        payload: z.infer<typeof GetProblemProgressInputSchema>,
    ) => Promise<z.infer<typeof GetProblemProgressOutputSchema>>;
}

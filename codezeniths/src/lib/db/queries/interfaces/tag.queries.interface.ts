import { z } from 'zod';
import {
    GetTagsOutputSchema,
    GetTagsFilteredInputSchema,
    GetTagsFilteredOutputSchema,
    GetSingleTagProblemsInputSchema,
    GetSingleTagProblemsOutputSchema,
    GetSingleTagProblemProgressInputSchema,
    GetSingleTagProblemProgressOutputSchema,
} from '@codezeniths/schemas/db';

export interface ITagQueries {
    getTags: (payload: void) => Promise<z.infer<typeof GetTagsOutputSchema>>;

    getTagsFiltered: (
        payload: z.infer<typeof GetTagsFilteredInputSchema>,
    ) => Promise<z.infer<typeof GetTagsFilteredOutputSchema>>;

    getSingleTagProblems: (
        payload: z.infer<typeof GetSingleTagProblemsInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTagProblemsOutputSchema>>;

    getSingleTagProblemProgress: (
        payload: z.infer<typeof GetSingleTagProblemProgressInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTagProblemProgressOutputSchema>>;

    getSingleTag: (
        payload: z.infer<typeof import('@codezeniths/schemas/db').GetSingleTagInputSchema>,
    ) => Promise<z.infer<typeof import('@codezeniths/schemas/db').GetSingleTagOutputSchema>>;
}


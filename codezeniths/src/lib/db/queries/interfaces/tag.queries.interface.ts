import { z } from 'zod';
import {
    GetTagsOutputSchema,
    GetSingleTagProgressInputSchema,
    GetSingleTagProgressOutputSchema,
    GetSingleTagInputSchema,
    GetSingleTagOutputSchema,
    GetTagSuggestionsInputSchema,
    GetTagSuggestionsOutputSchema,
    ToggleTagBookmarkInputSchema,
    ToggleTagBookmarkOutputSchema,
    GetUserTagProgressByLevelInputSchema,
    GetUserTagProgressByLevelOutputSchema,
} from '@codezeniths/schemas/db';

export interface ITagQueries {
    getTags: (payload: void) => Promise<z.infer<typeof GetTagsOutputSchema>>;

    getSingleTagProgress: (
        payload: z.infer<typeof GetSingleTagProgressInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTagProgressOutputSchema>>;

    getSingleTag: (
        payload: z.infer<typeof GetSingleTagInputSchema>,
    ) => Promise<z.infer<typeof GetSingleTagOutputSchema>>;

    getTagSuggestions: (
        payload: z.infer<typeof GetTagSuggestionsInputSchema>,
    ) => Promise<z.infer<typeof GetTagSuggestionsOutputSchema>>;

    toggleTagBookmark: (
        payload: z.infer<typeof ToggleTagBookmarkInputSchema>,
    ) => Promise<z.infer<typeof ToggleTagBookmarkOutputSchema>>;

    getUserTagProgressByLevel: (
        payload: z.infer<typeof GetUserTagProgressByLevelInputSchema>,
    ) => Promise<z.infer<typeof GetUserTagProgressByLevelOutputSchema>>;
}

import { z } from 'zod';
import {
    GetModulesOutputSchema,
    GetSingleModuleInputSchema,
    GetSingleModuleOutputSchema,
    GetSingleModuleProgressInputSchema,
    GetSingleModuleProgressOutputSchema,
    GetRecentlySolvedModuleInputSchema,
    GetRecentlySolvedModuleOutputSchema,
    GetModulesWithTopicsInputSchema,
    GetModulesWithTopicsOutputSchema,
    ToggleModuleBookmarkInputSchema,
    ToggleModuleBookmarkOutputSchema,
    ToggleTopicBookmarkInputSchema,
    ToggleTopicBookmarkOutputSchema,
} from '@codezeniths/schemas/db';

export interface IModuleQueries {
    getModules: (payload: void) => Promise<z.infer<typeof GetModulesOutputSchema>>;

    getSingleModule: (
        payload: z.infer<typeof GetSingleModuleInputSchema>,
    ) => Promise<z.infer<typeof GetSingleModuleOutputSchema>>;

    getSingleModuleProgress: (
        payload: z.infer<typeof GetSingleModuleProgressInputSchema>,
    ) => Promise<z.infer<typeof GetSingleModuleProgressOutputSchema>>;

    getRecentlySolvedModule: (
        payload: z.infer<typeof GetRecentlySolvedModuleInputSchema>,
    ) => Promise<z.infer<typeof GetRecentlySolvedModuleOutputSchema>>;

    getModulesWithTopics: (
        payload: z.infer<typeof GetModulesWithTopicsInputSchema>,
    ) => Promise<z.infer<typeof GetModulesWithTopicsOutputSchema>>;

    toggleModuleBookmark: (
        payload: z.infer<typeof ToggleModuleBookmarkInputSchema>,
    ) => Promise<z.infer<typeof ToggleModuleBookmarkOutputSchema>>;

    toggleTopicBookmark: (
        payload: z.infer<typeof ToggleTopicBookmarkInputSchema>,
    ) => Promise<z.infer<typeof ToggleTopicBookmarkOutputSchema>>;
}

import {
    GetSearchProblemsInputSchema,
    GetSearchProblemsOutputSchema,
    GetSearchTopicsInputSchema,
    GetSearchTopicsOutputSchema,
    GetSearchModulesInputSchema,
    GetSearchModulesOutputSchema,
    GetSearchTagsInputSchema,
    GetSearchTagsOutputSchema,
    GetSearchProductsInputSchema,
    GetSearchProductsOutputSchema,
    GetSearchUsersInputSchema,
    GetSearchUsersOutputSchema,
    GetRecentSearchHistoryInputSchema,
    GetRecentSearchHistoryOutputSchema,
    DeleteSearchHistoryItemInputSchema,
    DeleteSearchHistoryItemOutputSchema,
    ClearSearchHistoryInputSchema,
    ClearSearchHistoryOutputSchema,
    GetSearchHistoryInfiniteInputSchema,
    GetSearchHistoryInfiniteOutputSchema,
    GetSearchHistoryStatsInputSchema,
    GetSearchHistoryStatsOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface ISearchQueries {
    getSearchProblems(input?: z.infer<typeof GetSearchProblemsInputSchema>): Promise<z.infer<typeof GetSearchProblemsOutputSchema>>;
    getSearchTopics(input?: z.infer<typeof GetSearchTopicsInputSchema>): Promise<z.infer<typeof GetSearchTopicsOutputSchema>>;
    getSearchModules(input?: z.infer<typeof GetSearchModulesInputSchema>): Promise<z.infer<typeof GetSearchModulesOutputSchema>>;
    getSearchTags(input?: z.infer<typeof GetSearchTagsInputSchema>): Promise<z.infer<typeof GetSearchTagsOutputSchema>>;
    getSearchProducts(input?: z.infer<typeof GetSearchProductsInputSchema>): Promise<z.infer<typeof GetSearchProductsOutputSchema>>;
    getSearchUsers(input?: z.infer<typeof GetSearchUsersInputSchema>): Promise<z.infer<typeof GetSearchUsersOutputSchema>>;

    getRecentSearchHistory(input: z.infer<typeof GetRecentSearchHistoryInputSchema>): Promise<z.infer<typeof GetRecentSearchHistoryOutputSchema>>;
    getSearchHistoryInfinite(input: z.infer<typeof GetSearchHistoryInfiniteInputSchema>): Promise<z.infer<typeof GetSearchHistoryInfiniteOutputSchema>>;
    getSearchHistoryStats(input: z.infer<typeof GetSearchHistoryStatsInputSchema>): Promise<z.infer<typeof GetSearchHistoryStatsOutputSchema>>;
    deleteSearchHistoryItem(input: z.infer<typeof DeleteSearchHistoryItemInputSchema>): Promise<z.infer<typeof DeleteSearchHistoryItemOutputSchema>>;
    clearSearchHistory(input: z.infer<typeof ClearSearchHistoryInputSchema>): Promise<z.infer<typeof ClearSearchHistoryOutputSchema>>;
}

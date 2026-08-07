import {
    GetSearchProblemsInputSchema,
    GetSearchProblemsOutputSchema,
    GetSearchSkillsInputSchema,
    GetSearchSkillsOutputSchema,
    GetSearchTagsInputSchema,
    GetSearchTagsOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface ISearchQueries {
    getSearchProblems(input?: z.infer<typeof GetSearchProblemsInputSchema>): Promise<z.infer<typeof GetSearchProblemsOutputSchema>>;
    getSearchSkills(input?: z.infer<typeof GetSearchSkillsInputSchema>): Promise<z.infer<typeof GetSearchSkillsOutputSchema>>;
    getSearchTags(input?: z.infer<typeof GetSearchTagsInputSchema>): Promise<z.infer<typeof GetSearchTagsOutputSchema>>;
}

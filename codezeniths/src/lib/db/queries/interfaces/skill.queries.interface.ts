import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    GetSingleSkillInputSchema,
    GetSingleSkillOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface ISkillQueries {
    getSkills(payload: z.infer<typeof GetSkillsInputSchema>): Promise<z.infer<typeof GetSkillsOutputSchema>>;
    getSingleSkill(payload: z.infer<typeof GetSingleSkillInputSchema>): Promise<z.infer<typeof GetSingleSkillOutputSchema>>;
    createSkill(payload: z.infer<typeof CreateSkillInputSchema>): Promise<z.infer<typeof CreateSkillOutputSchema>>;
}

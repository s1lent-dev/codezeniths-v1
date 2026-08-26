import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface ISkillQueries {
    getSkills(payload: z.infer<typeof GetSkillsInputSchema>): Promise<z.infer<typeof GetSkillsOutputSchema>>;
    createSkill(payload: z.infer<typeof CreateSkillInputSchema>): Promise<z.infer<typeof CreateSkillOutputSchema>>;
}

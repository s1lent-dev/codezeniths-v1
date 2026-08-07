import { z } from 'zod';
import { SkillSchema } from '../db.schema';

export const GetSkillsInputSchema = z.object({});
export const GetSkillsOutputSchema = z.array(SkillSchema);

export const GetSingleSkillInputSchema = z.object({
    slug: z.string(),
});
export const GetSingleSkillOutputSchema = SkillSchema;

export const CreateSkillInputSchema = z.object({
    title: z.string().min(1, "Skill title is required").max(40, "Skill title is too long"),
    moduleId: z.string().uuid("Invalid module ID"),
});
export const CreateSkillOutputSchema = SkillSchema;

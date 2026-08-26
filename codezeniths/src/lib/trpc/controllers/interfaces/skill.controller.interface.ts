import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface ISkillController {
    getSkills({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetSkillsInputSchema> }): Promise<z.infer<typeof GetSkillsOutputSchema>>;
    createSkill({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof CreateSkillInputSchema> }): Promise<z.infer<typeof CreateSkillOutputSchema>>;
}

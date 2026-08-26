import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';

export const skillRouter = createTRPCRouter({
    getSkills: publicProcedure
        .input(GetSkillsInputSchema)
        .output(GetSkillsOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.skill.getSkills({ ctx, input })),

    createSkill: protectedProcedure
        .input(CreateSkillInputSchema)
        .output(CreateSkillOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.skill.createSkill({ ctx, input })),
});

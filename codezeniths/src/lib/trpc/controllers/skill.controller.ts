import { TRPCContext } from '../trpc/trpc.context';
import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    GetSingleSkillInputSchema,
    GetSingleSkillOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { ISkillController } from './interfaces';
import { logger } from '@/service/logging';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export class SkillController implements ISkillController {
    async getSkills({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetSkillsInputSchema> }): Promise<z.infer<typeof GetSkillsOutputSchema>> {
        logger.info('Executing getSkills controller');
        try {
            return await ctx.queries.skill.getSkills(input);
        } catch (error: any) {
            logger.error('Error in getSkills controller', { error });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Error fetching skills' });
        }
    }

    async getSingleSkill({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetSingleSkillInputSchema> }): Promise<z.infer<typeof GetSingleSkillOutputSchema>> {
        logger.info('Executing getSingleSkill controller', { input });
        try {
            return await ctx.queries.skill.getSingleSkill(input);
        } catch (error: any) {
            logger.error('Error in getSingleSkill controller', { error, slug: input.slug });
            if (error?.code === 'NOT_FOUND') throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Error fetching skill' });
        }
    }

    async createSkill({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof CreateSkillInputSchema> }): Promise<z.infer<typeof CreateSkillOutputSchema>> {
        logger.info('Executing createSkill controller', { title: input.title, moduleId: input.moduleId });
        try {
            return await ctx.queries.skill.createSkill(input);
        } catch (error: any) {
            logger.error('Error in createSkill controller', { error, input });
            if (error?.code === 'BAD_REQUEST') throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Error creating skill' });
        }
    }
}

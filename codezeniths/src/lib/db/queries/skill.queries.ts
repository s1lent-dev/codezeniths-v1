import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    GetSingleSkillInputSchema,
    GetSingleSkillOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { ISkillQueries } from './interfaces/skill.queries.interface';

export class SkillQueries implements ISkillQueries {
    getSkills = qRPC()
        .input(GetSkillsInputSchema)
        .output(GetSkillsOutputSchema)
        .handler(async () => {
            logger.info('Executing getSkills query');
            return await prisma.skill.findMany();
        })
        .build();

    getSingleSkill = qRPC()
        .input(GetSingleSkillInputSchema)
        .output(GetSingleSkillOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleSkill query', { payload });
            const skill = await prisma.skill.findUnique({
                where: { slug: payload.slug },
            });
            if (!skill) {
                throw new AppErrorBuilder('Skill not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }
            return skill;
        })
        .build();

    createSkill = qRPC()
        .input(CreateSkillInputSchema)
        .output(CreateSkillOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing createSkill query', { title: payload.title, moduleId: payload.moduleId });
            
            const cleanTitle = payload.title.trim();
            const generatedSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'custom-skill';

            // Check if skill already exists (case-insensitive)
            let existingSkill = await prisma.skill.findFirst({
                where: {
                    OR: [
                        { title: { equals: cleanTitle, mode: 'insensitive' } },
                        { slug: generatedSlug },
                    ],
                },
            });

            if (existingSkill) {
                return existingSkill;
            }

            // Verify module exists
            const module = await prisma.module.findUnique({
                where: { id: payload.moduleId }
            });

            if (!module) {
                throw new AppErrorBuilder('Module not found')
                    .setCode(ErrorCode.BAD_REQUEST)
                    .build();
            }

            const newSkill = await prisma.skill.create({
                data: {
                    title: cleanTitle,
                    slug: `${generatedSlug}-${Date.now()}`,
                    moduleId: payload.moduleId,
                }
            });

            return newSkill;
        })
        .build();
}

export const skillQueries = new SkillQueries();

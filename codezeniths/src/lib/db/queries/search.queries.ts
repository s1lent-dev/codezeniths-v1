import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import {
    GetSearchProblemsInputSchema,
    GetSearchProblemsOutputSchema,
    GetSearchSkillsInputSchema,
    GetSearchSkillsOutputSchema,
    GetSearchTagsInputSchema,
    GetSearchTagsOutputSchema,
} from '@codezeniths/schemas/db';
import { ISearchQueries } from './interfaces/search.queries.interface';

export class SearchQueries implements ISearchQueries {
    getSearchProblems = qRPC()
        .input(GetSearchProblemsInputSchema)
        .output(GetSearchProblemsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchProblems query', { payload });
            const problems = await prisma.problem.findMany({
                include: {
                    tags: {
                        include: { tag: true },
                    },
                    topic: {
                        include: { module: true },
                    },
                },
            });

            return problems.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                tags: p.tags.map((t) => t.tag.name),
                topic: p.topic?.title || null,
                module: p.topic?.module?.title || null,
                phoneticTitle: p.title,
            }));
        })
        .build();

    getSearchSkills = qRPC()
        .input(GetSearchSkillsInputSchema)
        .output(GetSearchSkillsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchSkills query', { payload });
            const skills = await prisma.skill.findMany();
            return skills.map((s) => ({
                id: s.id,
                name: s.title,
                slug: s.slug,
                phoneticName: s.title,
            }));
        })
        .build();

    getSearchTags = qRPC()
        .input(GetSearchTagsInputSchema)
        .output(GetSearchTagsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchTags query', { payload });
            const tags = await prisma.tag.findMany();
            return tags.map((t) => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                phoneticName: t.name,
            }));
        })
        .build();
}

export const searchQueries = new SearchQueries();

/**
 * @file src/scripts/get-featured-and-fallback-topics.ts
 * @description Fetches the exact database records for candidate featured topics
 *              and the active fallback topic from PostgreSQL via Prisma.
 */

import 'dotenv/config';
import { prisma } from '../lib/db/prisma.client';

async function fetchFeaturedAndFallbackTopics() {
    console.log('🔍 Searching topics in the database for candidate featured topics & fallback...\n');

    const searchCriteria = [
        { moduleSlug: 'module-dsa', titleKeyword: 'Dynamic Programming', slugKeyword: 'dynamic-programming' },
        { moduleSlug: 'module-dsa', titleKeyword: 'Sliding Window', slugKeyword: 'sliding-window' },
        { moduleSlug: 'module-dsa', titleKeyword: 'Recursion', slugKeyword: 'recursion' },
        { moduleSlug: 'module-system-design', titleKeyword: 'System Design', slugKeyword: 'system-design' },
        { moduleSlug: 'module-javascript', titleKeyword: 'Functions', slugKeyword: 'function' },
        { moduleSlug: 'module-os', titleKeyword: 'Memory', slugKeyword: 'memory' },
        { moduleSlug: 'module-dsa', titleKeyword: 'Array', slugKeyword: 'array' },
    ];

    try {
        const allModules = await prisma.module.findMany({
            select: { id: true, title: true, slug: true },
        });

        console.log('📦 Available Modules in DB:');
        console.table(allModules);

        const topics = await prisma.topic.findMany({
            where: {
                OR: [
                    { slug: { contains: 'dynamic-programming', mode: 'insensitive' } },
                    { slug: { contains: 'sliding-window', mode: 'insensitive' } },
                    { slug: { contains: 'recursion', mode: 'insensitive' } },
                    { slug: { contains: 'backtrack', mode: 'insensitive' } },
                    { slug: { contains: 'system-design', mode: 'insensitive' } },
                    { slug: { contains: 'scenario', mode: 'insensitive' } },
                    { slug: { contains: 'function', mode: 'insensitive' } },
                    { slug: { contains: 'closure', mode: 'insensitive' } },
                    { slug: { contains: 'memory', mode: 'insensitive' } },
                    { slug: { contains: 'array', mode: 'insensitive' } },
                    { slug: { contains: 'string', mode: 'insensitive' } },
                ],
            },
            include: {
                module: {
                    select: { id: true, title: true, slug: true },
                },
                problems: {
                    take: 3,
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        difficulty: true,
                        tags: {
                            select: {
                                tag: {
                                    select: { id: true, name: true, slug: true },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { problems: true },
                },
            },
            orderBy: { order: 'asc' },
        });

        console.log(`\n✅ Found ${topics.length} matching topics in DB:\n`);

        const formattedResults = topics.map((t) => ({
            id: t.id,
            title: t.title,
            slug: t.slug,
            level: t.level,
            description: t.description,
            order: t.order,
            module: {
                id: t.module.id,
                title: t.module.title,
                slug: t.module.slug,
            },
            problemsCount: t._count.problems,
            sampleProblems: t.problems.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                tags: p.tags.map((pt) => pt.tag.name),
            })),
        }));

        console.log(JSON.stringify(formattedResults, null, 2));

        // Group into candidate featured topics and fallback
        const dsaDP = formattedResults.find((t) => t.module.slug === 'module-dsa' && t.slug.includes('dynamic-programming'));
        const dsaSlidingWindow = formattedResults.find((t) => t.module.slug === 'module-dsa' && t.slug.includes('sliding-window'));
        const dsaRecursion = formattedResults.find((t) => t.module.slug === 'module-dsa' && (t.slug.includes('recursion') || t.slug.includes('backtracking')));
        const sysDesignScenarios = formattedResults.find((t) => t.module.slug === 'module-system-design' && (t.slug.includes('scenario') || t.title.toLowerCase().includes('scenario') || t.slug.includes('system-design')));
        const jsFunctions = formattedResults.find((t) => t.module.slug === 'module-javascript' && (t.slug.includes('function') || t.slug.includes('closure')));
        const osMemory = formattedResults.find((t) => t.module.slug === 'module-os' && t.slug.includes('memory'));
        const dsaArrays = formattedResults.find((t) => t.module.slug === 'module-dsa' && t.slug.includes('array'));

        console.log('\n=================== SUMMARY OF MATCHES ===================');
        console.log('1. DSA - Dynamic Programming:', dsaDP ? `${dsaDP.title} (${dsaDP.slug}) - ${dsaDP.problemsCount} problems` : 'NOT FOUND');
        console.log('2. DSA - Sliding Window:', dsaSlidingWindow ? `${dsaSlidingWindow.title} (${dsaSlidingWindow.slug}) - ${dsaSlidingWindow.problemsCount} problems` : 'NOT FOUND');
        console.log('3. DSA - Recursion & Backtracking:', dsaRecursion ? `${dsaRecursion.title} (${dsaRecursion.slug}) - ${dsaRecursion.problemsCount} problems` : 'NOT FOUND');
        console.log('4. System Design - Scenarios:', sysDesignScenarios ? `${sysDesignScenarios.title} (${sysDesignScenarios.slug}) - ${sysDesignScenarios.problemsCount} problems` : 'NOT FOUND');
        console.log('5. JS Internals - Functions & Closures:', jsFunctions ? `${jsFunctions.title} (${jsFunctions.slug}) - ${jsFunctions.problemsCount} problems` : 'NOT FOUND');
        console.log('6. OS - Memory Management:', osMemory ? `${osMemory.title} (${osMemory.slug}) - ${osMemory.problemsCount} problems` : 'NOT FOUND');
        console.log('⭐ Active Fallback (DSA Arrays):', dsaArrays ? `${dsaArrays.title} (${dsaArrays.slug}) - ${dsaArrays.problemsCount} problems` : 'NOT FOUND');
    } catch (error) {
        console.error('❌ Error querying database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fetchFeaturedAndFallbackTopics();

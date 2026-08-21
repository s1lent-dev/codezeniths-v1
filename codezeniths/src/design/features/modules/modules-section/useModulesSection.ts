'use client';

import { useRouter } from 'next/navigation';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';

export interface ModuleItem {
    id: string;
    title: string;
    description: string;
    slug: string;
    problemCount?: number;
    completedCount?: number;
    bgGradient?: string;
}

const MOCK_FALLBACK_MODULES: ModuleItem[] = [
    {
        id: 'module-dsa',
        title: 'Data Structures and Algorithms',
        description: 'Master core data structures and algorithmic patterns required for technical interviews.',
        slug: 'module-dsa',
        problemCount: 48,
    },
    {
        id: 'module-system-design',
        title: 'System Design',
        description: 'Architect high-scale distributed systems, covering HLD and low-level tradeoffs.',
        slug: 'module-system-design',
        problemCount: 25,
    },
    {
        id: 'module-database',
        title: 'Database',
        description: 'Master SQL, NoSQL, indexing, transactions, and distributed database systems.',
        slug: 'module-database',
        problemCount: 30,
    },
    {
        id: 'module-os',
        title: 'Operating System',
        description: 'Understand process management, memory allocation, concurrency, and Linux internals.',
        slug: 'module-os',
        problemCount: 24,
    },
    {
        id: 'module-cn',
        title: 'Computer Networks',
        description: 'Deep dive into internet protocols, OSI layers, and distributed network architecture.',
        slug: 'module-cn',
        problemCount: 20,
    },
];

export function useModulesSection() {
    const router = useRouter();

    const { data: rawModules, isLoading: isLoadingModules, isError, error } = moduleQueryService.getModules();
    const { data: streakData, isLoading: isLoadingStreak } = userQueryService.getUserStreak();
    const { data: recentModuleData, isLoading: isLoadingRecent } = moduleQueryService.getRecentlySolvedModule();
    const { data: problemProgress, isLoading: isLoadingProgress } = problemQueryService.getProblemProgress();
    const { data: modulesWithTopics, isLoading: isLoadingWithTopics } = moduleQueryService.getModulesWithTopics();

    const hasRecentModule = Boolean(recentModuleData?.module);
    const { data: featuredModuleData, isLoading: isLoadingFeatured } = moduleQueryService.getSingleModule(
        { slug: 'module-dsa' },
        { enabled: !hasRecentModule && !isLoadingRecent }
    );

    const modules: ModuleItem[] = (rawModules && rawModules.length > 0)
        ? rawModules.map((m: any) => ({
              id: m.id,
              title: m.title,
              description: m.description || 'Master key data structures and algorithmic paradigms with curated practice sets.',
              slug: m.slug,
              problemCount: m.problemCount ?? (m._count?.problems || 0),
          }))
        : MOCK_FALLBACK_MODULES;

    const handleSolveModule = (slug: string) => {
        router.push(`/modules/${slug}`);
    };

    return {
        modules,
        streakData,
        recentModuleData,
        featuredModuleData,
        problemProgress,
        modulesWithTopics,
        isLoading: isLoadingModules,
        isLoadingStreak,
        isLoadingRecent,
        isLoadingFeatured,
        isLoadingProgress,
        isLoadingWithTopics,
        isError,
        error,
        handleSolveModule,
    };
}

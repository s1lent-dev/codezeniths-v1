'use client';

import { useRouter } from 'next/navigation';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export interface ModuleItem {
    id: string;
    title: string;
    description: string;
    slug: string;
    bgGradient?: string;
}

const CARD_GRADIENTS = [
    'from-[#1e1b4b] via-[#2e1065] to-[#0f172a]',
    'from-[#2e1065] via-[#3b0764] to-[#1e1b4b]',
    'from-[#064e3b] via-[#022c22] to-[#0f172a]',
    'from-[#31103f] via-[#1e1b4b] to-[#0f172a]',
];

const MOCK_FALLBACK_MODULES: ModuleItem[] = [
    {
        id: 'module-dsa',
        title: 'Data Structures and Algorithms',
        description: 'Master core data structures and algorithmic patterns required for technical interviews.',
        slug: 'module-dsa',
    },
    {
        id: 'module-system-design',
        title: 'System Design',
        description: 'Architect high-scale distributed systems, covering HLD and low-level tradeoffs.',
        slug: 'module-system-design',
    },
    {
        id: 'module-database',
        title: 'Database',
        description: 'Master SQL, NoSQL, indexing, transactions, and distributed database systems.',
        slug: 'module-database',
    },
    {
        id: 'module-os',
        title: 'Operating System',
        description: 'Understand process management, memory allocation, concurrency, and Linux internals.',
        slug: 'module-os',
    },
    {
        id: 'module-cn',
        title: 'Computer Networks',
        description: 'Deep dive into internet protocols, OSI layers, and distributed network architecture.',
        slug: 'module-cn',
    },
];

export function useModules() {
    const router = useRouter();
    const { data: rawModules, isLoading, isError, error } = moduleQueryService.getModules();

    const modules: ModuleItem[] = (rawModules && rawModules.length > 0)
        ? rawModules.map((m: any, index: number) => ({
              id: m.id,
              title: m.title,
              description: m.description || 'Be the zen1th in problem solving',
              slug: m.slug,
              bgGradient: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
          }))
        : MOCK_FALLBACK_MODULES;

    const handleSolveModule = (slug: string) => {
        router.push(`/modules/${slug}`);
    };

    return {
        modules,
        isLoading,
        isError,
        error,
        handleSolveModule,
    };
}

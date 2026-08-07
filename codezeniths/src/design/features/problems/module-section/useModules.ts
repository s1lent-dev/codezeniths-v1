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

export function useModules() {
    const router = useRouter();
    const { data: rawModules, isLoading, isError, error } = moduleQueryService.getModules();

    const modules: ModuleItem[] = rawModules
        ? rawModules.map((m: any, index: number) => ({
              id: m.id,
              title: m.title,
              description: m.description || 'Be the zen1th in problem solving',
              slug: m.slug,
              bgGradient: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
          }))
        : [];

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

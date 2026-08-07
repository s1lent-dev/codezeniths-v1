'use client';

import { useState, useMemo } from 'react';
import { searchQueryService } from '@codezeniths/lib/tanstack';
import type { FuzzyAlgorithmName, PhoneticAlgorithmName } from './types/search.types';

export interface UseSearchConfig {
  limit?: number;
  fuzzy?: { algorithm?: FuzzyAlgorithmName; threshold?: number };
  phonetic?: { algorithm?: PhoneticAlgorithmName };
  didYouMean?: boolean;
  autocomplete?: { limit?: number };
}

export function useSearch<TDoc>(
  collectionName: string,
  initialConfig: UseSearchConfig = {}
) {
  const [query, setQuery] = useState('');
  const [config, setConfig] = useState<UseSearchConfig>(initialConfig);

  const isEnabled = query.length > 0;

  const searchInput = useMemo(() => ({
    query,
    limit: config.limit ?? 10,
    fuzzy: config.fuzzy ? {
      algorithm: config.fuzzy.algorithm ?? 'jaro-winkler' as FuzzyAlgorithmName,
      threshold: config.fuzzy.threshold ?? 0.7,
    } : undefined,
    phonetic: config.phonetic ? {
      algorithm: config.phonetic.algorithm ?? 'metaphone' as PhoneticAlgorithmName,
    } : undefined,
    didYouMean: config.didYouMean ?? false,
    autocomplete: config.autocomplete ? { limit: config.autocomplete.limit ?? 10 } : undefined,
  }), [query, config]);

  const { data, isLoading, error } = searchQueryService.search(collectionName, searchInput, isEnabled);

  return {
    query,
    setQuery,
    config,
    setConfig,
    results: (data?.hits ?? []) as Array<{ document: TDoc; score: number; matchedStrategies: string[] }>,
    metadata: {
      didYouMean: data?.metadata?.didYouMean as string | undefined,
      autocomplete: (data?.metadata?.autocomplete ?? []) as string[],
      tookMs: data?.metadata?.tookMs ?? 0,
    },
    isLoading,
    error,
  };
}

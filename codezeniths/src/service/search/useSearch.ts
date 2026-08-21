'use client';

import { useState, useMemo, useEffect } from 'react';
import { searchQueryService } from '@codezeniths/lib/tanstack';
import type { FuzzyAlgorithmName, PhoneticAlgorithmName } from './types/search.types';

export interface UseSearchConfig {
  limit?: number;
  fuzzy?: { algorithm?: FuzzyAlgorithmName; threshold?: number };
  phonetic?: { algorithm?: PhoneticAlgorithmName };
  didYouMean?: boolean;
  autocomplete?: { limit?: number };
  debounceMs?: number;
}

export function useSearch<TDoc = any>(
  initialCollection: string = 'all',
  initialConfig: UseSearchConfig = {}
) {
  const [collection, setCollection] = useState<string>(initialCollection);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [config, setConfig] = useState<UseSearchConfig>(initialConfig);

  useEffect(() => {
    setCollection(initialCollection);
  }, [initialCollection]);

  const debounceMs = config.debounceMs ?? 150;


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  const isEnabled = debouncedQuery.trim().length > 0;

  const searchInput = useMemo(() => ({
    query: debouncedQuery,
    limit: config.limit ?? 10,
    fuzzy: config.fuzzy ? {
      algorithm: config.fuzzy.algorithm ?? 'jaro-winkler' as FuzzyAlgorithmName,
      threshold: config.fuzzy.threshold ?? 0.7,
    } : undefined,
    phonetic: config.phonetic ? {
      algorithm: config.phonetic.algorithm ?? 'metaphone' as PhoneticAlgorithmName,
    } : undefined,
    didYouMean: config.didYouMean ?? true,
    autocomplete: config.autocomplete ? { limit: config.autocomplete.limit ?? 10 } : undefined,
  }), [debouncedQuery, config]);

  const { data, isLoading, error } = searchQueryService.search(collection, searchInput, isEnabled);

  const autocompletes = (data?.metadata?.autocomplete ?? []) as string[];

  const topSuggestion = useMemo(() => {
    if (!query.trim()) return '';
    const lowerQuery = query.toLowerCase();

    // 1. Check autocompletes from server Trie metadata
    let match = autocompletes.find((item) =>
      item.toLowerCase().startsWith(lowerQuery) && item.toLowerCase() !== lowerQuery
    );

    // 2. Fallback to current document result titles if Trie didn't yield a prefix match yet
    if (!match && data?.hits) {
      for (const hit of data.hits) {
        const doc = hit.document as Record<string, unknown>;
        const title = (doc.title || doc.name || doc.username) as string;
        if (typeof title === 'string' && title.toLowerCase().startsWith(lowerQuery) && title.toLowerCase() !== lowerQuery) {
          match = title.toLowerCase();
          break;
        }
      }
    }

    return match || '';
  }, [query, autocompletes, data?.hits]);

  const inlineSuffix = useMemo(() => {
    if (!topSuggestion || !query) return '';
    if (topSuggestion.toLowerCase().startsWith(query.toLowerCase())) {
      return topSuggestion.slice(query.length);
    }
    return '';
  }, [topSuggestion, query]);


  return {
    query,
    setQuery,
    debouncedQuery,
    collection,
    setCollection,
    config,
    setConfig,
    topSuggestion,
    inlineSuffix,
    results: (data?.hits ?? []) as Array<{ document: TDoc & { _collection?: string }; score: number; matchedStrategies: string[] }>,
    metadata: {
      didYouMean: data?.metadata?.didYouMean as string | undefined,
      autocomplete: autocompletes,
      tookMs: data?.metadata?.tookMs ?? 0,
    },
    isLoading: isEnabled ? isLoading : false,
    error,
  };
}



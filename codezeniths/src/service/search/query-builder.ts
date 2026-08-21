import type { FuzzyAlgorithmName, PhoneticAlgorithmName, QueryConfig, SearchHit, SearchResult, CollectionDefinition, ScoringStrategyName } from './types/search.types';
import { fuzzyAlgorithmRegistry, phoneticAlgorithmRegistry } from './utils/algorithms';
import { scoringStrategyRegistry, ScoringPipeline } from './utils/scoring';
import { redisService } from '@codezeniths/lib/redis';


export class SearchQueryBuilder<TDoc> {
  private constructor(
    private readonly definition: CollectionDefinition<any>,
    private readonly config: QueryConfig
  ) {}

  static create<TDoc>(definition: CollectionDefinition<any>, query: string): SearchQueryBuilder<TDoc> {
    return new SearchQueryBuilder<TDoc>(definition, {
      query,
      limit: 10,
      didYouMean: false,
      boosts: {},
      strategies: definition.defaultScoringStrategies ?? ['exact', 'substring'],
    });
  }

  private clone(overrides: Partial<QueryConfig>): SearchQueryBuilder<TDoc> {
    return new SearchQueryBuilder<TDoc>(this.definition, { ...this.config, ...overrides });
  }

  fuzzy(opts?: { algorithm?: FuzzyAlgorithmName; threshold?: number }): SearchQueryBuilder<TDoc> {
    const strategies = this.config.strategies.includes('fuzzy') ? this.config.strategies : [...this.config.strategies, 'fuzzy'] as ScoringStrategyName[];
    return this.clone({
      fuzzy: { algorithm: opts?.algorithm ?? 'jaro-winkler', threshold: opts?.threshold ?? 0.7 },
      strategies,
    });
  }

  phonetic(opts?: { algorithm?: PhoneticAlgorithmName }): SearchQueryBuilder<TDoc> {
    const strategies = this.config.strategies.includes('phonetic') ? this.config.strategies : [...this.config.strategies, 'phonetic'] as ScoringStrategyName[];
    return this.clone({
      phonetic: { algorithm: opts?.algorithm ?? 'metaphone' },
      strategies,
    });
  }

  boostField(field: keyof TDoc & string, weight: number): SearchQueryBuilder<TDoc> {
    return this.clone({ boosts: { ...this.config.boosts, [field]: weight } });
  }

  didYouMean(enabled: boolean = true): SearchQueryBuilder<TDoc> {
    return this.clone({ didYouMean: enabled });
  }

  withAutocomplete(opts?: { limit?: number }): SearchQueryBuilder<TDoc> {
    return this.clone({ autocomplete: { limit: opts?.limit ?? 10 } });
  }

  limit(n: number): SearchQueryBuilder<TDoc> {
    return this.clone({ limit: n });
  }

  async execute(): Promise<SearchResult<TDoc>> {
    const startTime = Date.now();
    let metadata: SearchResult<TDoc>['metadata'] = { tookMs: 0 };
    let hits: SearchHit<TDoc>[] = [];

    if (this.config.query.length > 0) {
      const documentsRaw = await redisService.client.get(`search:${this.definition.name}:all`);
      const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
      
      if (documents && documents.length > 0) {
        const fields = this.definition.searchableFields.map(f => ({
          ...f,
          field: f.field as keyof TDoc & string,
          weight: this.config.boosts[f.field] ?? f.weight,
        }));

        // Pass 1: Primary Exact & Substring Search
        const primaryStrategies = ['exact', 'substring']
          .map(name => scoringStrategyRegistry[name as ScoringStrategyName])
          .filter(Boolean);

        const primaryPipeline = new ScoringPipeline<TDoc>(primaryStrategies, fields, this.config);
        hits = primaryPipeline.scoreAll(this.config.query, documents);

        if (hits.length > 0) {
          metadata = { ...metadata, didYouMean: undefined };
        } else {
          // Pass 2: Sequential Fallback A — Fuzzy Search (Jaro-Winkler)
          const fuzzyStrategy = scoringStrategyRegistry.fuzzy;
          const fuzzyPipeline = new ScoringPipeline<TDoc>([fuzzyStrategy], fields, {
            ...this.config,
            fuzzy: this.config.fuzzy ?? { algorithm: 'jaro-winkler', threshold: 0.65 },
          });
          const fuzzyHits = fuzzyPipeline.scoreAll(this.config.query, documents);

          if (fuzzyHits.length > 0) {
            hits = fuzzyHits;
            if (this.config.didYouMean) {
              const topDoc = fuzzyHits[0].document as Record<string, unknown>;
              const candidateValue = topDoc.title || topDoc.name || topDoc.username;
              if (typeof candidateValue === 'string' && candidateValue.toLowerCase() !== this.config.query.toLowerCase()) {
                metadata = { ...metadata, didYouMean: candidateValue };
              }
            }
          } else {
            // Pass 3: Sequential Fallback B — Phonetic Search (Metaphone)
            const phoneticStrategy = scoringStrategyRegistry.phonetic;
            const encoder = phoneticAlgorithmRegistry.metaphone;
            const queryPhoneticCode = this.config.query
              .split(/\s+/)
              .map(w => encoder.encode(w))
              .filter(Boolean)
              .join(' ');

            const phoneticPipeline = new ScoringPipeline<TDoc>([phoneticStrategy], fields, {
              ...this.config,
              phonetic: this.config.phonetic ?? { algorithm: 'metaphone' },
            });
            const phoneticHits = phoneticPipeline.scoreAll(this.config.query, documents, queryPhoneticCode);

            if (phoneticHits.length > 0) {
              hits = phoneticHits;
              if (this.config.didYouMean) {
                const topDoc = phoneticHits[0].document as Record<string, unknown>;
                const candidateValue = topDoc.title || topDoc.name || topDoc.username;
                if (typeof candidateValue === 'string' && candidateValue.toLowerCase() !== this.config.query.toLowerCase()) {
                  metadata = { ...metadata, didYouMean: candidateValue };
                }
              }
            } else {
              hits = [];
              metadata = { ...metadata, didYouMean: undefined };
            }
          }


        }

        hits = hits.slice(0, this.config.limit);
      }
    }


    metadata = { ...metadata, autocomplete: undefined };

    return {
      hits,
      metadata: { ...metadata, tookMs: Date.now() - startTime },
    };
  }

  private async computeSuggestions(query: string, hits: SearchHit<TDoc>[]): Promise<string[]> {
    const qLower = query.toLowerCase().trim();
    const cachedRelationsRaw = await redisService.client.get(`search:tag_relations:${qLower}`);
    if (typeof cachedRelationsRaw === 'string') {
      try {
        const parsed: unknown = JSON.parse(cachedRelationsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((item): item is string => typeof item === 'string');
        }
      } catch { /* ignore */ }
    }

    if (hits.length > 0) {
      const tagCounts: Record<string, number> = {};
      for (const hit of hits) {
        const doc = hit.document as Record<string, unknown>;
        const rawTags = doc.tags;
        if (Array.isArray(rawTags)) {
          for (const item of rawTags) {
            if (typeof item === 'string' && item.trim().length > 0 && !item.startsWith('module-')) {
              const norm = item.trim().toLowerCase();
              if (norm !== qLower) {
                tagCounts[norm] = (tagCounts[norm] || 0) + 1;
              }
            }
          }
        }
      }
      const extracted = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([t]) => t);
      if (extracted.length > 0) return extracted;
    }

    const key = `search:autocomplete:${this.definition.name}`;
    const suggestionsRaw = await redisService.trie.searchPrefix(key, qLower, 100);
    return Array.from(
      new Set(
        suggestionsRaw
          .filter(r => r.endsWith('*'))
          .map(r => r.slice(0, -1))
      )
    ).slice(0, 5);
  }
}


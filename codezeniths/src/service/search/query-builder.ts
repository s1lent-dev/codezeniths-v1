import type { FuzzyAlgorithmName, PhoneticAlgorithmName, QueryConfig, SearchHit, SearchResult, CollectionDefinition, ScoringStrategyName } from './types/search.types';
import { phoneticAlgorithmRegistry } from './utils/algorithms';
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

    if (this.config.autocomplete && this.config.query.length > 0) {
      const key = `search:autocomplete:${this.definition.name}`;
      const suggestionsRaw = await redisService.trie.searchPrefix(key, this.config.query.toLowerCase(), this.config.autocomplete.limit);
      const suggestions = suggestionsRaw.filter(r => r.endsWith('*')).map(r => r.slice(0, -1));
      metadata = { ...metadata, autocomplete: suggestions };
    }

    if (this.config.query.length > 0) {
      const documentsRaw = await redisService.client.get(`search:${this.definition.name}:all`);
      const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
      
      if (documents && documents.length > 0) {
        const strategies = this.config.strategies
          .map(name => scoringStrategyRegistry[name])
          .filter(Boolean);

        const fields = this.definition.searchableFields.map(f => ({
          ...f,
          field: f.field as keyof TDoc & string,
          weight: this.config.boosts[f.field] ?? f.weight,
        }));

        const pipeline = new ScoringPipeline<TDoc>(strategies, fields, this.config);

        let queryPhoneticCode: string | undefined;
        if (this.config.phonetic) {
          const encoder = phoneticAlgorithmRegistry[this.config.phonetic.algorithm];
          queryPhoneticCode = encoder.encode(this.config.query);
        }

        hits = pipeline.scoreAll(this.config.query, documents, queryPhoneticCode);
        hits = hits.slice(0, this.config.limit);

        if (this.config.didYouMean && hits.length > 0) {
          const topHit = hits[0];
          const topDoc = topHit.document as Record<string, unknown>;
          const primaryField = this.definition.searchableFields[0]?.field;
          if (primaryField) {
            const primaryValue = topDoc[primaryField];
            if (typeof primaryValue === 'string') {
              const isExact = primaryValue.toLowerCase().includes(this.config.query.toLowerCase());
              if (!isExact) {
                metadata = { ...metadata, didYouMean: primaryValue };
              }
            }
          }
        }
      }
    }

    return {
      hits,
      metadata: { ...metadata, tookMs: Date.now() - startTime },
    };
  }
}

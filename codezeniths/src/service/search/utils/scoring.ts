import type { SearchableFieldConfig, SimilarityFieldConfig, ScoringStrategyName, SearchHit, QueryConfig } from '../types/search.types';
import { fuzzyAlgorithmRegistry, phoneticAlgorithmRegistry } from './algorithms';

export interface ScoringContext<TDoc> {
  readonly query: string;
  readonly queryTokens: readonly string[];
  readonly queryPhoneticCode?: string;
  readonly document: TDoc;
  readonly fields: readonly SearchableFieldConfig<TDoc>[];
  readonly config: QueryConfig;
}

export interface ScoringStrategy {
  readonly name: ScoringStrategyName;
  score<TDoc>(ctx: ScoringContext<TDoc>): number;
}

const EXACT_MATCH_SCORE = 100;
const SUBSTRING_MATCH_SCORE = 50;
const PHONETIC_MATCH_SCORE = 40;
const MAX_FUZZY_SCORE = 30;
const EXACT_ONLY_THRESHOLD = 40;
const FUZZY_PHONETIC_THRESHOLD = 10;

function getFieldValues<TDoc>(doc: TDoc, field: keyof TDoc): string[] {
  const val = doc[field];
  if (typeof val === 'string') return [val];
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
  return [];
}

const exactMatchStrategy: ScoringStrategy = {
  name: 'exact',
  score<TDoc>(ctx: ScoringContext<TDoc>): number {
    let totalScore = 0;
    const queryLower = ctx.query.toLowerCase();
    for (const field of ctx.fields) {
      const values = getFieldValues(ctx.document, field.field);
      for (const val of values) {
        const valLower = val.toLowerCase();
        if (valLower === queryLower) {
          totalScore = Math.max(totalScore, EXACT_MATCH_SCORE * field.weight);
        } else if (valLower.startsWith(queryLower)) {
          totalScore = Math.max(totalScore, 85 * field.weight);
        } else if (valLower.split(/\s+/).some(token => token.startsWith(queryLower))) {
          totalScore = Math.max(totalScore, 75 * field.weight);
        }
      }
    }
    return totalScore;
  }
};

const substringStrategy: ScoringStrategy = {
  name: 'substring',
  score<TDoc>(ctx: ScoringContext<TDoc>): number {
    let totalScore = 0;
    const queryLower = ctx.query.toLowerCase();
    for (const field of ctx.fields) {
      const values = getFieldValues(ctx.document, field.field);
      for (const val of values) {
        const valLower = val.toLowerCase();
        if (valLower.includes(queryLower)) {
          if (valLower.startsWith(queryLower)) {
            totalScore = Math.max(totalScore, 65 * field.weight);
          } else if (valLower.split(/\s+/).some(token => token.startsWith(queryLower))) {
            totalScore = Math.max(totalScore, 55 * field.weight);
          } else {
            totalScore = Math.max(totalScore, SUBSTRING_MATCH_SCORE * field.weight);
          }
        }
      }
    }
    return totalScore;
  }
};


const fuzzyStrategy: ScoringStrategy = {
  name: 'fuzzy',
  score<TDoc>(ctx: ScoringContext<TDoc>): number {
    const algo = fuzzyAlgorithmRegistry[ctx.config.fuzzy?.algorithm || 'jaro-winkler'];
    const threshold = ctx.config.fuzzy?.threshold ?? 0.65;
    const queryLower = ctx.query.toLowerCase();
    const qTokens = ctx.queryTokens;
    let totalScore = 0;

    for (const field of ctx.fields) {
      const values = getFieldValues(ctx.document, field.field);
      for (const val of values) {
        const valLower = val.toLowerCase();
        const fullSim = algo.similarity(queryLower, valLower);
        if (fullSim >= threshold) {
          totalScore = Math.max(totalScore, fullSim * MAX_FUZZY_SCORE * field.weight);
          continue;
        }

        const valTokens = valLower.split(/\s+/).filter(Boolean);
        if (qTokens.length > 0 && valTokens.length >= qTokens.length) {
          let tokenSimSum = 0;
          let matchedCount = 0;

          for (const qToken of qTokens) {
            let maxTokenSim = 0;
            for (const vToken of valTokens) {
              const sim = algo.similarity(qToken, vToken);
              if (sim > maxTokenSim) maxTokenSim = sim;
            }
            if (maxTokenSim >= threshold) {
              tokenSimSum += maxTokenSim;
              matchedCount++;
            }
          }

          if (matchedCount === qTokens.length) {
            const avgSim = tokenSimSum / qTokens.length;
            totalScore = Math.max(totalScore, avgSim * MAX_FUZZY_SCORE * field.weight);
          }
        }
      }
    }
    return totalScore;
  }
};

const phoneticStrategy: ScoringStrategy = {
  name: 'phonetic',
  score<TDoc>(ctx: ScoringContext<TDoc>): number {
    const algo = phoneticAlgorithmRegistry[ctx.config.phonetic?.algorithm || 'metaphone'];
    const qTokens = ctx.queryTokens;
    let totalScore = 0;

    for (const field of ctx.fields) {
      const values = getFieldValues(ctx.document, field.field);
      for (const val of values) {
        const valLower = val.toLowerCase();
        const valTokens = valLower.split(/\s+/).filter(Boolean);

        if (qTokens.length > 0 && valTokens.length >= qTokens.length) {
          let tokenPhoneticMatches = 0;
          for (const qToken of qTokens) {
            const qCode = algo.encode(qToken);
            if (valTokens.some(vToken => algo.encode(vToken) === qCode)) {
              tokenPhoneticMatches++;
            }
          }

          if (tokenPhoneticMatches === qTokens.length) {
            totalScore = Math.max(totalScore, PHONETIC_MATCH_SCORE * field.weight);
          }
        }
      }
    }
    return totalScore;
  }
};

const fieldWeightStrategy: ScoringStrategy = {
  name: 'field-weight',
  score<TDoc>(ctx: ScoringContext<TDoc>): number {
    let totalScore = 0;
    for (const field of ctx.fields) {
      const values = getFieldValues(ctx.document, field.field);
      for (const val of values) {
        const valLower = val.toLowerCase();
        if (ctx.queryTokens.some(token => valLower.includes(token))) {
          totalScore += field.weight;
          break; // Score once per field
        }
      }
    }
    return totalScore;
  }
};

export const scoringStrategyRegistry: Record<ScoringStrategyName, ScoringStrategy> = {
  exact: exactMatchStrategy,
  substring: substringStrategy,
  fuzzy: fuzzyStrategy,
  phonetic: phoneticStrategy,
  'field-weight': fieldWeightStrategy,
};

export class ScoringPipeline<TDoc> {
  constructor(
    private readonly strategies: ScoringStrategy[],
    private readonly fields: SearchableFieldConfig<TDoc>[],
    private readonly config: QueryConfig
  ) {}

  scoreAll(query: string, documents: TDoc[], queryPhoneticCode?: string): SearchHit<TDoc>[] {
    const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const threshold = 10;
    
    const hits: SearchHit<TDoc>[] = [];
    
    for (const document of documents) {
      const ctx: ScoringContext<TDoc> = {
        query,
        queryTokens,
        queryPhoneticCode,
        document,
        fields: this.fields,
        config: this.config,
      };
      
      let totalScore = 0;
      const matchedStrategies: ScoringStrategyName[] = [];
      
      for (const strategy of this.strategies) {
        const score = strategy.score(ctx);
        if (score > 0) {
          totalScore += score;
          matchedStrategies.push(strategy.name);
        }
      }
      
      if (totalScore >= threshold) {
        hits.push({ document, score: totalScore, matchedStrategies });
      }
    }
    
    return hits.sort((a, b) => b.score - a.score);
  }
}


export class MoreLikeThisStrategy<TDoc> {
  constructor(
    private readonly similarityFields: readonly SimilarityFieldConfig<TDoc>[],
    private readonly idField: string
  ) {}

  findSimilar(targetId: string, documents: readonly TDoc[], limit: number = 5): TDoc[] {
    const target = documents.find(d => (d as Record<string, unknown>)[this.idField] === targetId);
    if (!target) return [];
    
    const scored = documents
      .filter(d => (d as Record<string, unknown>)[this.idField] !== targetId)
      .map(doc => {
        let score = 0;
        for (const sf of this.similarityFields) {
          const targetVal = (target as Record<string, unknown>)[sf.field];
          const docVal = (doc as Record<string, unknown>)[sf.field];
          if (targetVal == null || docVal == null) continue;
          
          if (Array.isArray(targetVal) && Array.isArray(docVal)) {
            const shared = docVal.filter(v => targetVal.includes(v)).length;
            score += shared * sf.weight;
          } else if (targetVal === docVal) {
            score += sf.weight;
          }
        }
        return { doc, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(item => item.doc);
  }
}

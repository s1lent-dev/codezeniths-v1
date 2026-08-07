import type { z } from 'zod';
import type { SearchError } from '../utils/search.errors';

export type Result<T, E = SearchError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export type FuzzyAlgorithmName = 'jaro-winkler' | 'levenshtein';
export type PhoneticAlgorithmName = 'metaphone' | 'soundex';
export type ScoringStrategyName = 'exact' | 'substring' | 'fuzzy' | 'phonetic' | 'field-weight';

export interface SearchableFieldConfig<T> {
  field: keyof T & string;
  weight: number;
}

export interface SimilarityFieldConfig<T> {
  field: keyof T & string;
  weight: number;
}

export interface CollectionDefinition<TSchema extends z.ZodTypeAny> {
  name: string;
  schema: TSchema;
  idField: keyof z.infer<TSchema> & string;
  searchableFields: SearchableFieldConfig<z.infer<TSchema>>[];
  phoneticFields?: (keyof z.infer<TSchema> & string)[];
  autocompleteFields?: (keyof z.infer<TSchema> & string)[];
  similarityFields?: SimilarityFieldConfig<z.infer<TSchema>>[];
  defaultScoringStrategies?: ScoringStrategyName[];
}

export interface QueryConfig {
  readonly query: string;
  readonly limit: number;
  readonly fuzzy?: { readonly algorithm: FuzzyAlgorithmName; readonly threshold: number };
  readonly phonetic?: { readonly algorithm: PhoneticAlgorithmName };
  readonly didYouMean: boolean;
  readonly autocomplete?: { readonly limit: number };
  readonly boosts: Readonly<Record<string, number>>;
  readonly strategies: readonly ScoringStrategyName[];
}

export interface SearchHit<TDoc> {
  readonly document: TDoc;
  readonly score: number;
  readonly matchedStrategies: readonly ScoringStrategyName[];
}

export interface SearchResult<TDoc> {
  readonly hits: readonly SearchHit<TDoc>[];
  readonly metadata: {
    readonly didYouMean?: string;
    readonly autocomplete?: readonly string[];
    readonly tookMs: number;
  };
}

export interface IndexSummary {
  readonly collection: string;
  readonly documentsIndexed: number;
  readonly autocompleteEntries: number;
  readonly phoneticEntries: number;
  readonly tookMs: number;
}

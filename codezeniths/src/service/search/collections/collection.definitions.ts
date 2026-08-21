import {
  SearchProblemIndexSchema,
  SearchTagIndexSchema,
  SearchTopicIndexSchema,
  SearchModuleIndexSchema,
  SearchProductIndexSchema,
  SearchUserIndexSchema,
} from '../types/schemas';
import { z } from 'zod';
import { CollectionDefinition } from "../types/search.types";

export function defineCollection<TSchema extends z.ZodTypeAny>(
  definition: CollectionDefinition<TSchema>
) {
  return definition;
}

export const problemsCollection = defineCollection({
  name: 'problems',
  schema: SearchProblemIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'title', weight: 100 },
    { field: 'tags', weight: 2 },
  ],
  phoneticFields: ['title'],
  autocompleteFields: ['title'],
  similarityFields: [
    { field: 'topic', weight: 30 },
    { field: 'module', weight: 20 },
    { field: 'tags', weight: 5 },
  ],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const topicsCollection = defineCollection({
  name: 'topics',
  schema: SearchTopicIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'title', weight: 100 },
    { field: 'description', weight: 5 },
  ],
  phoneticFields: ['title'],
  autocompleteFields: ['title'],
  similarityFields: [
    { field: 'module', weight: 20 },
  ],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const modulesCollection = defineCollection({
  name: 'modules',
  schema: SearchModuleIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'title', weight: 100 },
    { field: 'description', weight: 5 },
  ],
  phoneticFields: ['title'],
  autocompleteFields: ['title'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const tagsCollection = defineCollection({
  name: 'tags',
  schema: SearchTagIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'name', weight: 100 },
    { field: 'description', weight: 5 },
  ],
  phoneticFields: ['name'],
  autocompleteFields: ['name'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const productsCollection = defineCollection({
  name: 'products',
  schema: SearchProductIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'title', weight: 100 },
    { field: 'description', weight: 5 },
  ],
  phoneticFields: ['title'],
  autocompleteFields: ['title'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const usersCollection = defineCollection({
  name: 'users',
  schema: SearchUserIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'name', weight: 100 },
    { field: 'username', weight: 90 },
    { field: 'email', weight: 10 },
  ],
  phoneticFields: ['name', 'username'],
  autocompleteFields: ['name', 'username'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});



import { SearchProblemIndexSchema, SearchTagIndexSchema, SearchSkillIndexSchema } from '../types/schemas';
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
    { field: 'title', weight: 10 },
    { field: 'tags', weight: 3 },
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

export const tagsCollection = defineCollection({
  name: 'tags',
  schema: SearchTagIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'name', weight: 10 },
  ],
  phoneticFields: ['name'],
  autocompleteFields: ['name'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

export const skillsCollection = defineCollection({
  name: 'skills',
  schema: SearchSkillIndexSchema,
  idField: 'id',
  searchableFields: [
    { field: 'name', weight: 10 },
  ],
  phoneticFields: ['name'],
  autocompleteFields: ['name'],
  defaultScoringStrategies: ['exact', 'substring', 'field-weight'],
});

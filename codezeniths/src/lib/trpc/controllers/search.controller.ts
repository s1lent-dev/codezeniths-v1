import type { SearchClient } from '@codezeniths/service/search';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { TRPCContext } from '../trpc/trpc.context';
import { ISearchController } from './interfaces';
import {
  AutocompleteTRPCInputSchema,
  AutocompleteTRPCOutputSchema,
  MoreLikeThisTRPCInputSchema,
  MoreLikeThisTRPCOutputSchema,
  SearchTRPCInputSchema,
  SearchTRPCOutputSchema,
} from '@/schemas/trpc';

export class SearchController implements ISearchController {
  constructor(private readonly searchClient: SearchClient<Record<string, any>>) {}

  public async reindexAll({
    ctx,
  }: {
    ctx: TRPCContext;
  }): Promise<{ success: boolean; message: string; summaries: unknown[] }> {
    logger.info('Executing reindexAll controller');
    const loaders = {
      problems: async () => ctx.queries.search.getSearchProblems({}),
      skills: async () => ctx.queries.search.getSearchSkills({}),
      tags: async () => ctx.queries.search.getSearchTags({}),
    };

    try {
      const results = await Promise.all(
        Object.entries(loaders).map(async ([name, loader]) => {
          try {
            const collection = this.searchClient.collection(name as never);
            return await collection.reindex(loader as () => Promise<never[]>);
          } catch (error) {
            return { ok: false as const, error };
          }
        })
      );
      
      const failures = results.filter(r => !r.ok);
      if (failures.length > 0) {
        logger.warn('Reindex completed with some failures', { failures });
        return { success: false, message: `Reindex failed for ${failures.length} collection(s).`, summaries: results };
      }
      return { success: true, message: 'Successfully reindexed all collections.', summaries: results };
    } catch (error: any) {
      logger.error('Error in reindexAll controller', { error });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while reindexing all collections.',
        cause: error,
      });
    }
  }

  public async autocomplete({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input: z.infer<typeof AutocompleteTRPCInputSchema>;
  }): Promise<z.infer<typeof AutocompleteTRPCOutputSchema>> {
    logger.info('Executing autocomplete controller', { collection: input.collection, prefix: input.prefix });
    
    try {
      const validated = AutocompleteTRPCInputSchema.parse(input);
      const results = await this.searchClient.collection(validated.collection as never).autocomplete(validated.prefix, { limit: validated.limit });
      return AutocompleteTRPCOutputSchema.parse(results);
    } catch (error: any) {
      logger.error('Error in autocomplete controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong during autocomplete.',
        cause: error,
      });
    }
  }

  public async getRecommendations({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input: z.infer<typeof MoreLikeThisTRPCInputSchema>;
  }): Promise<z.infer<typeof MoreLikeThisTRPCOutputSchema>> {
    logger.info('Executing getRecommendations controller', { collection: input.collection, id: input.id });
    
    try {
      const validated = MoreLikeThisTRPCInputSchema.parse(input);
      const results = await this.searchClient.collection(validated.collection as never).moreLikeThis(validated.id, { limit: validated.limit });
      return MoreLikeThisTRPCOutputSchema.parse(results);
    } catch (error: any) {
      logger.error('Error in getRecommendations controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong fetching recommendations.',
        cause: error,
      });
    }
  }

  public async searchQuery({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input: z.infer<typeof SearchTRPCInputSchema>;
  }): Promise<z.infer<typeof SearchTRPCOutputSchema>> {
    logger.info('Executing searchQuery controller', { collection: input.collection, query: input.query });

    try {
      const validated = SearchTRPCInputSchema.parse(input);
      let builder = this.searchClient.collection(validated.collection as never).query(validated.query);
      if (validated.fuzzy) builder = builder.fuzzy(validated.fuzzy);
      if (validated.phonetic) builder = builder.phonetic(validated.phonetic);
      if (validated.didYouMean) builder = builder.didYouMean();
      if (validated.autocomplete) builder = builder.withAutocomplete(validated.autocomplete);
      builder = builder.limit(validated.limit);
      
      const results = await builder.execute();
      return SearchTRPCOutputSchema.parse(results);
    } catch (error: any) {
      logger.error('Error in searchQuery controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong during search.',
        cause: error,
      });
    }
  }
}

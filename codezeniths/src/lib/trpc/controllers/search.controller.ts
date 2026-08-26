import type { SearchClient } from '@codezeniths/service/search';
import { fuzzyAlgorithmRegistry } from '@/service/search/utils/algorithms';
import { formatUserProfile, formatUserProfiles } from '@/utils/user.formatter';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { TRPCContext } from '../trpc/trpc.context';

import { ISearchController } from './interfaces';

import {
  SearchTRPCInputSchema,
  SearchTRPCOutputSchema,
  RecordSearchSelectionTRPCInputSchema,
  RecordSearchSelectionTRPCOutputSchema,
  GetRecentSearchHistoryTRPCInputSchema,
  GetRecentSearchHistoryTRPCOutputSchema,
  DeleteSearchHistoryItemTRPCInputSchema,
  DeleteSearchHistoryItemTRPCOutputSchema,
  ClearSearchHistoryTRPCOutputSchema,
  GetSearchHistoryInfiniteTRPCInputSchema,
  GetSearchHistoryInfiniteTRPCOutputSchema,
  GetSearchHistoryStatsTRPCInputSchema,
  GetSearchHistoryStatsTRPCOutputSchema,
} from '@/schemas/trpc';
import { searchProducer } from '@/lib/mq';


export class SearchController implements ISearchController {
  constructor(private readonly searchClient: SearchClient<Record<string, any>>) {}

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
      const targetCollName = (validated.collection || 'all').toLowerCase().trim();
      const normalizedColl = targetCollName === 'problem' ? 'problems'
        : targetCollName === 'topic' ? 'topics'
        : targetCollName === 'module' ? 'modules'
        : targetCollName === 'tag' ? 'tags'
        : targetCollName === 'product' ? 'products'
        : targetCollName === 'user' ? 'users'
        : targetCollName;

      const targetCollections = normalizedColl === 'all'
        ? this.searchClient.getAllCollectionNames()
        : [normalizedColl];


      const startTime = Date.now();
      const resultsPerCollection = await Promise.all(
        targetCollections.map(async (collName) => {
          try {
            let builder = this.searchClient.collection(collName as never).query(validated.query);
            if (validated.fuzzy) builder = builder.fuzzy(validated.fuzzy);
            if (validated.phonetic) builder = builder.phonetic(validated.phonetic);
            if (validated.didYouMean) builder = builder.didYouMean();
            if (validated.autocomplete) builder = builder.withAutocomplete(validated.autocomplete);
            builder = builder.limit(validated.limit);
            
            const searchRes = await builder.execute();
            return { collection: collName, res: searchRes };
          } catch (error) {
            logger.warn(`Failed searchQuery for collection "${collName}"`, { error });
            return { collection: collName, res: { hits: [], metadata: { tookMs: 0 } } };
          }
        })
      );

      let hits: any[] = [];
      if (validated.collection === 'all') {
        const hitsByCollection: Record<string, any[]> = {};
        for (const { collection, res } of resultsPerCollection) {
          hitsByCollection[collection] = res.hits.map((hit) => ({
            document: {
              ...(typeof hit.document === 'object' && hit.document !== null ? hit.document : { data: hit.document }),
              _collection: collection,
            },
            score: hit.score,
            matchedStrategies: hit.matchedStrategies as string[],
          }));
        }

        const interleaved: any[] = [];
        const collectionNames = Object.keys(hitsByCollection);
        let maxLen = 0;
        for (const coll of collectionNames) {
          maxLen = Math.max(maxLen, hitsByCollection[coll].length);
        }

        for (let i = 0; i < maxLen; i++) {
          for (const coll of collectionNames) {
            if (i < hitsByCollection[coll].length) {
              interleaved.push(hitsByCollection[coll][i]);
            }
          }
        }

        interleaved.sort((a, b) => b.score - a.score);
        hits = interleaved.slice(0, validated.limit);
      } else {
        const allHits = resultsPerCollection.flatMap(({ collection, res }) =>
          res.hits.map((hit) => ({
            document: {
              ...(typeof hit.document === 'object' && hit.document !== null ? hit.document : { data: hit.document }),
              _collection: collection,
            },
            score: hit.score,
            matchedStrategies: hit.matchedStrategies as string[],
          }))
        );

        allHits.sort((a, b) => b.score - a.score);
        hits = allHits.slice(0, validated.limit);
      }


      const aggregatedAutocomplete = Array.from(
        new Set(resultsPerCollection.flatMap(({ res }) => res.metadata.autocomplete ?? []))
      );

      // Check if primary exact/substring search found hits in ANY collection
      const hasPrimaryHits = resultsPerCollection.some(({ res }) =>
        res.hits.some(h =>
          h.matchedStrategies.includes('exact') || h.matchedStrategies.includes('substring')
        )
      );

      let topDidYouMean: string | undefined;
      // didYouMean is ONLY computed if NO primary search hits exist (i.e. fuzzy/phonetic fallback triggered)
      if (!hasPrimaryHits) {
        const didYouMeanCandidates = resultsPerCollection
          .map(({ res }) => res.metadata.didYouMean)
          .filter((val): val is string => Boolean(val));

        if (didYouMeanCandidates.length > 0) {
          const qLower = validated.query.toLowerCase();
          didYouMeanCandidates.sort((a, b) => {
            const simA = fuzzyAlgorithmRegistry['jaro-winkler'].similarity(qLower, a.toLowerCase());
            const simB = fuzzyAlgorithmRegistry['jaro-winkler'].similarity(qLower, b.toLowerCase());
            return simB - simA;
          });
          topDidYouMean = didYouMeanCandidates[0];
        }
      }

      // Dynamically format user profile URLs for user search hits
      const userHits = hits.filter(
        (h) => h.document._collection === 'users' || h.document._collection === 'user'
      );

      if (userHits.length > 0) {
        const formattedUsers = await formatUserProfiles(userHits.map((h) => h.document));
        for (let i = 0; i < userHits.length; i++) {
          userHits[i].document = {
            ...userHits[i].document,
            ...formattedUsers[i],
          };
        }
      }

      const output = {
        hits,
        metadata: {
          tookMs: Date.now() - startTime,
          didYouMean: topDidYouMean,
          autocomplete: aggregatedAutocomplete.length > 0 ? aggregatedAutocomplete : undefined,
        },
      };

      return SearchTRPCOutputSchema.parse(output);
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

  public async recordSelection({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input: z.infer<typeof RecordSearchSelectionTRPCInputSchema>;
  }): Promise<z.infer<typeof RecordSearchSelectionTRPCOutputSchema>> {
    logger.info('Executing recordSelection controller', { userId: ctx.user?.id, collection: input.collection });

    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required to save search history.',
      });
    }

    try {
      const validated = RecordSearchSelectionTRPCInputSchema.parse(input);

      let docToSave = validated.document;
      if (validated.collection === 'user') {
        const rawUser = await prisma.user.findUnique({
          where: { id: validated.resultId },
          select: { image: true, name: true, username: true, userType: true },
        });
        if (rawUser) {
          docToSave = {
            ...(docToSave || {}),
            image: rawUser.image, // Pristine raw S3 key
            name: rawUser.name,
            username: rawUser.username,
            userType: rawUser.userType,
          };
        }
      }

      await searchProducer.publishRecordSearchHistory({
        userId: ctx.user.id,
        collection: validated.collection,
        resultId: validated.resultId,
        title: validated.title,
        slug: validated.slug ?? null,
        document: docToSave,
      });

      return { success: true };
    } catch (error: any) {
      logger.error('Error in recordSelection controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while recording search history.',
        cause: error,
      });
    }
  }

  public async getRecentHistory({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input?: z.infer<typeof GetRecentSearchHistoryTRPCInputSchema>;
  }): Promise<z.infer<typeof GetRecentSearchHistoryTRPCOutputSchema>> {
    logger.info('Executing getRecentHistory controller', { userId: ctx.user?.id });

    if (!ctx.user?.id) {
      return [];
    }

    try {
      const limit = input?.limit ?? 10;
      const results = await ctx.queries.search.getRecentSearchHistory({
        userId: ctx.user.id,
        limit,
      });

      // 1. Collect all distinct user IDs from user history items
      const userHistoryItems = results.filter((item) => item.collection === 'user');
      const userIds = [...new Set(userHistoryItems.map((item) => item.resultId).filter(Boolean))];

      // 2. Fetch fresh user records in bulk to obtain the raw storage key and up-to-date user info
      let userMap = new Map<string, { id: string; name: string; username: string | null; image: string | null; userType: string | null }>();
      if (userIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, username: true, image: true, userType: true },
        });
        userMap = new Map(users.map((u) => [u.id, u]));
      }

      // 3. Format user profiles with signed URLs using formatUserProfile
      const formattedResults = await Promise.all(
        results.map(async (item) => {
          if (item.collection === 'user') {
            const rawUser = userMap.get(item.resultId);
            if (rawUser) {
              const formattedUser = await formatUserProfile(rawUser);
              return {
                ...item,
                title: formattedUser.name || item.title,
                slug: formattedUser.username || item.slug,
                metadata: {
                  ...(item.metadata || {}),
                  id: formattedUser.id,
                  name: formattedUser.name,
                  username: formattedUser.username,
                  image: formattedUser.image, // Newly generated & cached presigned URL
                  userType: formattedUser.userType,
                },
              };
            }
          }

          // Fallback for other items that may have a raw storage key in metadata.image
          if (item.metadata?.image && typeof item.metadata.image === 'string' && !item.metadata.image.startsWith('http')) {
            const formatted = await formatUserProfile({ image: item.metadata.image });
            return {
              ...item,
              metadata: {
                ...(item.metadata || {}),
                image: formatted?.image ?? item.metadata.image,
              },
            };
          }

          return item;
        })
      );

      return GetRecentSearchHistoryTRPCOutputSchema.parse(formattedResults);
    } catch (error: any) {
      logger.error('Error in getRecentHistory controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while retrieving search history.',
        cause: error,
      });
    }
  }

  public async getSearchHistoryInfinite({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input?: z.infer<typeof GetSearchHistoryInfiniteTRPCInputSchema>;
  }): Promise<z.infer<typeof GetSearchHistoryInfiniteTRPCOutputSchema>> {
    logger.info('Executing getSearchHistoryInfinite controller', { userId: ctx.user?.id, input });

    if (!ctx.user?.id) {
      return {
        items: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: 0,
      };
    }

    try {
      const limit = input?.limit ?? 6;
      const result = await ctx.queries.search.getSearchHistoryInfinite({
        userId: ctx.user.id,
        cursor: input?.cursor,
        limit,
        collection: input?.collection,
        search: input?.search,
      });

      // Format user items with presigned avatars
      const userHistoryItems = result.items.filter((item) => item.collection === 'user');
      const userIds = [...new Set(userHistoryItems.map((item) => item.resultId).filter(Boolean))];

      let userMap = new Map<string, { id: string; name: string; username: string | null; image: string | null; userType: string | null }>();
      if (userIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, username: true, image: true, userType: true },
        });
        userMap = new Map(users.map((u) => [u.id, u]));
      }

      const formattedItems = await Promise.all(
        result.items.map(async (item) => {
          if (item.collection === 'user') {
            const rawUser = userMap.get(item.resultId);
            if (rawUser) {
              const formattedUser = await formatUserProfile(rawUser);
              return {
                ...item,
                title: formattedUser.name || item.title,
                slug: formattedUser.username || item.slug,
                metadata: {
                  ...(item.metadata || {}),
                  id: formattedUser.id,
                  name: formattedUser.name,
                  username: formattedUser.username,
                  image: formattedUser.image,
                  userType: formattedUser.userType,
                },
              };
            }
          }

          if (item.metadata?.image && typeof item.metadata.image === 'string' && !item.metadata.image.startsWith('http')) {
            const formatted = await formatUserProfile({ image: item.metadata.image });
            return {
              ...item,
              metadata: {
                ...(item.metadata || {}),
                image: formatted?.image ?? item.metadata.image,
              },
            };
          }

          return item;
        })
      );

      return GetSearchHistoryInfiniteTRPCOutputSchema.parse({
        items: formattedItems,
        nextCursor: result.nextCursor,
        hasNextPage: result.hasNextPage,
        totalCount: result.totalCount,
      });
    } catch (error: any) {
      logger.error('Error in getSearchHistoryInfinite controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while retrieving search history.',
        cause: error,
      });
    }
  }

  public async getSearchHistoryStats({
    ctx,
  }: {
    ctx: TRPCContext;
    input?: z.infer<typeof GetSearchHistoryStatsTRPCInputSchema>;
  }): Promise<z.infer<typeof GetSearchHistoryStatsTRPCOutputSchema>> {
    logger.info('Executing getSearchHistoryStats controller', { userId: ctx.user?.id });

    if (!ctx.user?.id) {
      return {
        totalSearches: 0,
        todaySearches: 0,
        topCategory: null,
      };
    }

    try {
      const stats = await ctx.queries.search.getSearchHistoryStats({
        userId: ctx.user.id,
      });

      return GetSearchHistoryStatsTRPCOutputSchema.parse(stats);
    } catch (error: any) {
      logger.error('Error in getSearchHistoryStats controller', { error });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while retrieving search history statistics.',
        cause: error,
      });
    }
  }

  public async deleteHistoryItem({
    ctx,
    input,
  }: {
    ctx: TRPCContext;
    input: z.infer<typeof DeleteSearchHistoryItemTRPCInputSchema>;
  }): Promise<z.infer<typeof DeleteSearchHistoryItemTRPCOutputSchema>> {
    logger.info('Executing deleteHistoryItem controller', { userId: ctx.user?.id, id: input.id });

    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required to delete search history.',
      });
    }

    try {
      const validated = DeleteSearchHistoryItemTRPCInputSchema.parse(input);
      const res = await ctx.queries.search.deleteSearchHistoryItem({
        id: validated.id,
        userId: ctx.user.id,
      });

      return DeleteSearchHistoryItemTRPCOutputSchema.parse(res);
    } catch (error: any) {
      logger.error('Error in deleteHistoryItem controller', { error, input });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while deleting search history item.',
        cause: error,
      });
    }
  }

  public async clearHistory({
    ctx,
  }: {
    ctx: TRPCContext;
  }): Promise<z.infer<typeof ClearSearchHistoryTRPCOutputSchema>> {
    logger.info('Executing clearHistory controller', { userId: ctx.user?.id });

    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required to clear search history.',
      });
    }

    try {
      const res = await ctx.queries.search.clearSearchHistory({
        userId: ctx.user.id,
      });

      return ClearSearchHistoryTRPCOutputSchema.parse(res);
    } catch (error: any) {
      logger.error('Error in clearHistory controller', { error });
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Something went wrong while clearing search history.',
        cause: error,
      });
    }
  }
}



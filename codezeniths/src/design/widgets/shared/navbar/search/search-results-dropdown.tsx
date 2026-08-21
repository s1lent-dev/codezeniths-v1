'use client';

import React from 'react';
import {
  Typography,
  TypographyVariant,
  TypographyAlign,
  Spinner,
  SpinnerVariant,
  ScrollArea,
} from '@codezeniths/components';
import { Card, CardContent } from '@codezeniths/modules';
import { SearchResultItem, SearchResultHit } from './search-result-item';

import { Lightbulb, History, Trash2, SearchX } from 'lucide-react';
import type { UserSearchHistory } from '@codezeniths/schemas/db';
import { cn } from '@codezeniths/design/cn';

interface SearchResultsDropdownProps {
  query: string;
  results: SearchResultHit[];
  metadata: {
    didYouMean?: string;
    autocomplete?: string[];
    tookMs?: number;
  };
  isLoading: boolean;
  isHistoryMode?: boolean;
  historyItems?: UserSearchHistory[];
  isHistoryLoading?: boolean;
  onDeleteHistoryItem?: (id: string) => void;
  onClearHistory?: () => void;
  onSelectSuggestion: (term: string) => void;
  onClose: () => void;
  align?: 'center' | 'right' | 'left';
}

export const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({
  query,
  results,
  metadata,
  isLoading,
  isHistoryMode = false,
  historyItems = [],
  isHistoryLoading = false,
  onDeleteHistoryItem,
  onClearHistory,
  onSelectSuggestion,
  onClose,
  align = 'center',
}) => {
  const isQueryEmpty = !query.trim();

  // If query is empty and not in history mode or no history, and not loading, don't show
  if (isQueryEmpty && !isHistoryMode) return null;

  const alignClass =
    align === 'right'
      ? 'right-0 left-auto w-[calc(100vw-2rem)] sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)]'
      : align === 'left'
      ? 'left-0 right-auto w-[calc(100vw-2rem)] sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)]'
      : 'left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] sm:w-[520px] md:w-[600px] max-w-[calc(100vw-1.5rem)]';

  return (
    <Card
      className={cn(
        'absolute top-full mt-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border border-foreground-light-shade3/80 dark:border-foreground-dark-shade3/80 rounded-md shadow-2xl z-9999 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-3 duration-200',
        alignClass
      )}
    >
      <CardContent className="p-0">
        <ScrollArea className="h-[65vh] max-h-120 w-full" scrollbarClassName="right-8 my-2">
          <div className="pl-3.5 pr-4 py-3.5 space-y-3">

            {/* ─── RECENT SEARCH HISTORY MODE (When search query is empty) ─── */}
            {isQueryEmpty ? (
              isHistoryLoading ? (
                <div className="flex items-center justify-center py-10 gap-3 text-muted-light dark:text-muted-dark">
                  <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-5 h-5 text-primary" />
                  <Typography variant={TypographyVariant.MUTED} align={TypographyAlign.CENTER} className="text-xs font-medium text-center">
                    Loading recent searches...
                  </Typography>
                </div>
              ) : historyItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-12 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center mb-3">
                    <History className="size-6" />
                  </div>
                  <Typography
                    variant={TypographyVariant.P}
                    align={TypographyAlign.CENTER}
                    className="text-sm font-semibold text-heading-light dark:text-heading-dark text-center"
                  >
                    No recent searches
                  </Typography>
                  <p className="text-xs text-muted-light dark:text-muted-dark mt-1 max-w-xs text-center">
                    Search for problems, topics, modules, tags, or users to build your quick access history.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1 pb-1.5 border-b border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40">
                    <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark">
                      <History className="w-3.5 h-3.5 text-primary" />
                      <Typography
                        variant={TypographyVariant.MUTED}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark"
                      >
                        Recent Searches ({historyItems.length})
                      </Typography>
                    </div>

                    {onClearHistory && (
                      <button
                        type="button"
                        onClick={onClearHistory}
                        className="flex items-center gap-1 text-[11px] font-medium text-muted-light dark:text-muted-dark hover:text-destructive transition-colors cursor-pointer p-0.5 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear all</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 pt-1">
                    {historyItems.map((item) => {
                      const doc = {
                        ...(typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {}),
                        id: item.resultId,
                        title: item.title,
                        slug: item.slug,
                        _collection: item.collection,
                      };
                      const hit: SearchResultHit = {
                        document: doc,
                        score: 1,
                        matchedStrategies: ['recent'],
                      };
                      return (
                        <SearchResultItem
                          key={item.id}
                          hit={hit}
                          onSelect={onClose}
                          isHistory={true}
                          onDeleteHistory={() => onDeleteHistoryItem?.(item.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* ─── ACTIVE SEARCH QUERY RESULTS ─── */
              <>
                {/* Did You Mean suggestion banner */}
                {metadata.didYouMean && (
                  <div
                    onClick={() => onSelectSuggestion(metadata.didYouMean!)}
                    className="flex items-center justify-between p-2.5 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 rounded-md cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/15 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-500 shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-amber-800 dark:text-amber-200 font-medium truncate">
                        Did you mean{' '}
                        <strong className="underline text-amber-600 dark:text-amber-300 group-hover:text-primary transition-colors">
                          {metadata.didYouMean}
                        </strong>?
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full shrink-0 ml-2">
                      Apply
                    </span>
                  </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-10 gap-3 text-muted-light dark:text-muted-dark">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-5 h-5 text-primary" />
                    <Typography variant={TypographyVariant.MUTED} align={TypographyAlign.CENTER} className="text-xs font-medium text-center">
                      Searching across collections...
                    </Typography>
                  </div>
                ) : results.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-12 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center mb-3">
                      <SearchX className="size-6" />
                    </div>
                    <Typography
                      variant={TypographyVariant.P}
                      align={TypographyAlign.CENTER}
                      className="text-sm font-semibold text-heading-light dark:text-heading-dark text-center"
                    >
                      No results found for &ldquo;{query}&rdquo;
                    </Typography>
                    <p className="text-xs text-muted-light dark:text-muted-dark mt-1 max-w-xs text-center">
                      Try adjusting your search terms or selecting a different collection filter.
                    </p>
                  </div>
                ) : (
                  /* Search Results List */
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40">
                      <Typography
                        variant={TypographyVariant.MUTED}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark"
                      >
                        Top Results ({results.length})
                      </Typography>
                      {metadata.tookMs !== undefined && (
                        <Typography variant={TypographyVariant.MUTED} className="text-[10px] opacity-60 font-mono">
                          {metadata.tookMs} ms
                        </Typography>
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      {results.map((hit, idx) => (
                        <SearchResultItem key={hit.document.id || idx} hit={hit} onSelect={onClose} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};



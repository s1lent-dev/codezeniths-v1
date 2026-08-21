'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { SearchResultIcon } from './search-result-icon';
import { searchQueryService } from '@/lib/tanstack/services/search.query-service';
import { useAuth } from '@/lib/auth/auth';
import { X } from 'lucide-react';
import type { SearchCollection } from '@prisma/client';

export interface SearchResultHit {
  document: any;
  score: number;
  matchedStrategies: string[];
}

interface SearchResultItemProps {
  hit: SearchResultHit;
  onSelect: () => void;
  isHistory?: boolean;
  onDeleteHistory?: () => void;
}

const userTypeLabels: Record<string, string> = {
  working_professional: 'Working Professional',
  college_student: 'College Student',
  school_student: 'School Student',
  job_seeker: 'Job Seeker',
  student: 'College Student',
  other: 'Other',
};

function formatUserType(rawType?: string | null): string {
  if (!rawType) return 'Member';
  const clean = rawType.toLowerCase().trim();
  if (userTypeLabels[clean]) return userTypeLabels[clean];
  return clean
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  hit,
  onSelect,
  isHistory = false,
  onDeleteHistory,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutate: recordSelection } = searchQueryService.recordSelection();
  const doc = hit.document;
  const rawColl: string = (doc._collection || 'problem').toString().toLowerCase();

  const collection = rawColl.endsWith('s') && rawColl !== 'status' ? rawColl.slice(0, -1) : rawColl;

  const title = doc.title || doc.name || doc.username || 'Untitled';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();

    if (isAuthenticated) {
      const validCollection: SearchCollection =
        collection === 'problem' ||
        collection === 'topic' ||
        collection === 'module' ||
        collection === 'tag' ||
        collection === 'product' ||
        collection === 'user'
          ? (collection as SearchCollection)
          : 'problem';

      recordSelection({
        collection: validCollection,
        resultId: doc.id || doc.slug || 'unknown',
        title,
        slug: doc.slug || null,
        document: doc,
      });
    }

    if (collection === 'problem') {
      router.push(`/problemset/${doc.slug}`);
    } else if (collection === 'topic') {
      const moduleSlug = doc.module ? doc.module.toLowerCase().trim().replace(/\s+/g, '-') : 'general';
      router.push(`/modules/${moduleSlug}/${doc.slug}`);
    } else if (collection === 'tag') {
      router.push(`/tags/${doc.slug}`);
    } else if (collection === 'product') {
      router.push(`/${doc.slug}`);
    } else if (collection === 'module') {
      router.push(`/modules/${doc.slug}`);
    } else if (collection === 'user') {
      router.push(`/profile/${doc.username || doc.id}`);
    } else {
      router.push(`/problemset/${doc.slug || ''}`);
    }
  };


  const getCollectionBadgeStyle = (coll: string) => {
    switch (coll) {
      case 'problem':
        return 'bg-primary/10 text-primary border-primary/25';
      case 'topic':
        return 'bg-purple/10 text-purple border-purple/25';
      case 'module':
        return 'bg-blue/10 text-blue border-blue/25';
      case 'tag':
        return 'bg-teal/10 text-teal border-teal/25';
      case 'product':
        return 'bg-azure/10 text-azure border-azure/25';
      case 'user':
        return 'bg-info/10 text-info border-info/25';
      default:
        return 'bg-primary/10 text-primary border-primary/25';
    }
  };

  const getLevelTextColor = (value?: string | null) => {
    const val = (value || 'medium').toString().toLowerCase().trim();
    if (val === 'easy' || val === 'fundamental' || val === 'beginner') {
      return 'text-teal';
    } else if (val === 'hard' || val === 'advanced') {
      return 'text-destructive';
    }
    return 'text-warning';
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-2.5 rounded-md hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent cursor-pointer group border border-transparent hover:border-foreground-light-shade3/60 dark:hover:border-foreground-dark-shade3/60 min-w-0"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <SearchResultIcon collection={collection} doc={doc} />

        <div className="flex flex-col min-w-0 flex-1">
          <Typography
            variant={TypographyVariant.P}
            className="text-xs font-semibold text-heading-light dark:text-heading-dark group-hover:text-primary transition-colors truncate"
          >
            {title}
          </Typography>

          {/* Collection-Specific Subtext */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-light dark:text-muted-dark truncate mt-0.5">
            {collection === 'problem' && (
              <>
                <span className={`capitalize ${getLevelTextColor(doc.difficulty)}`}>
                  {doc.difficulty || 'Medium'}
                </span>
                <span className="size-1 rounded-full bg-secondary" />
                <span className="truncate">{doc.topic || 'General Topic'}</span>
              </>
            )}

            {collection === 'user' && (
              <>
                <span className="font-mono text-primary/90 font-medium">@{doc.username || 'user'}</span>
                <span className="size-1 rounded-full bg-secondary" />
                <span className="truncate">{formatUserType(doc.userType)}</span>
              </>
            )}

            {collection === 'tag' && (
              <>
                <span className={`capitalize ${getLevelTextColor(doc.level)}`}>{doc.level || 'Fundamental'}</span>
                <span className="size-1 rounded-full bg-secondary" />
                <span>{doc.problemsCount ?? 0} Problems</span>
              </>
            )}

            {collection === 'topic' && (
              <>
                <span className={`capitalize ${getLevelTextColor(doc.level)}`}>{doc.level || 'Fundamental'}</span>
                <span className="size-1 rounded-full bg-secondary" />
                <span>{doc.problemsCount ?? 0} Problems</span>
              </>
            )}

            {collection === 'module' && (
              <>
                <span>{doc.topicsCount ?? 0} Topics</span>
                <span className="size-1 rounded-full bg-secondary" />
                <span>{doc.problemsCount ?? 0} Problems</span>
                <span className="size-1 rounded-full bg-secondary" />
                <span>{doc.tagsCount ?? 0} Tags</span>
              </>
            )}

            {collection === 'product' && (
              <span className="truncate">{doc.description || 'CodeZeniths Product'}</span>
            )}
          </div>
        </div>
      </div>


      <div className="flex items-center gap-2 ml-3 shrink-0">
        <span
          className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full border ${getCollectionBadgeStyle(
            collection
          )}`}
        >
          {collection.charAt(0).toUpperCase() + collection.slice(1)}
        </span>

        {isHistory && onDeleteHistory && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDeleteHistory();
            }}
            className="p-1 rounded-md text-muted-light dark:text-muted-dark hover:text-destructive hover:bg-destructive/10 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
            title="Remove from history"
            aria-label="Remove from search history"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};





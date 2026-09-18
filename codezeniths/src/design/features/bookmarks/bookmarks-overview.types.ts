import { z } from 'zod';
import {
    BookmarkedModuleItemSchema,
    BookmarkedTopicItemSchema,
    BookmarkedTagItemSchema,
} from '@codezeniths/schemas/db';

export type BookmarksTab = 'modules' | 'topics' | 'tags';

export type BookmarksSortBy = 'recent' | 'progress' | 'title' | 'problems';

export type TopicLevelFilter = 'all' | 'fundamental' | 'intermediate' | 'advanced';

export type BookmarkedModuleItem = z.infer<typeof BookmarkedModuleItemSchema>;
export type BookmarkedTopicItem = z.infer<typeof BookmarkedTopicItemSchema>;
export type BookmarkedTagItem = z.infer<typeof BookmarkedTagItemSchema>;

export interface BookmarksOverviewData {
    modules: BookmarkedModuleItem[];
    topics: BookmarkedTopicItem[];
    tags: BookmarkedTagItem[];
    totalCount: number;
}

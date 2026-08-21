import { z } from 'zod';

export const testSchema = z.any();

export type TestSchema = any;

export * from './user.schema';
export * from './module.schema';
export * from './problem.schema';
export * from './topic.schema';
export * from './tag.schema';
export * from './auth.schema';
export * from './notification.schema';
export * from './search.schema';
export * from './favourite.schema';
export * from './leaderboard.schema';
export * from './playlist.schema';


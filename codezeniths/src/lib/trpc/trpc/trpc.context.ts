import { AuthService } from '@codezeniths/lib/auth/auth.service';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import type { AuthUser, BetterAuthSession } from '@codezeniths/lib/auth/auth.types';
import type { PrismaClient } from '@prisma/client';

import { ModuleController } from '../controllers/module.controller';
import { TopicController } from '../controllers/topic.controller';
import { ProblemController } from '../controllers/problem.controller';
import { TagController } from '../controllers/tag.controller';
import { UserController } from '../controllers/user.controller';
import { NotificationController } from '../controllers/notification.controller';
import { ProductController } from '../controllers/product.controller';
import { SkillController } from '../controllers/skill.controller';
import { SearchController } from '../controllers/search.controller';
import { FavouriteController } from '../controllers/favourite.controller';
import {
    IModuleController,
    ITopicController,
    IProblemController,
    ITagController,
    IUserController,
    INotificationController,
    IProductController,
    ISkillController,
    IFavouriteController
} from '../controllers/interfaces';


import { ModuleQueries } from '@codezeniths/lib/db/queries/module.queries';
import { TopicQueries } from '@codezeniths/lib/db/queries/topic.queries';
import { ProblemQueries } from '@codezeniths/lib/db/queries/problem.queries';
import { TagQueries } from '@codezeniths/lib/db/queries/tag.queries';
import { UserQueries } from '@codezeniths/lib/db/queries/user.queries';
import { NotificationQueries } from '@codezeniths/lib/db/queries/notification.queries';
import { ProductQueries } from '@codezeniths/lib/db/queries/product.queries';
import { SkillQueries } from '@codezeniths/lib/db/queries/skill.queries';
import { SearchQueries } from '@codezeniths/lib/db/queries/search.queries';
import { FavouriteQueries } from '@codezeniths/lib/db/queries/favourite.queries';

import { IModuleQueries } from '@codezeniths/lib/db/queries/interfaces/module.queries.interface';
import { ITopicQueries } from '@codezeniths/lib/db/queries/interfaces/topic.queries.interface';
import { IProblemQueries } from '@codezeniths/lib/db/queries/interfaces/problem.queries.interface';
import { ITagQueries } from '@codezeniths/lib/db/queries/interfaces/tag.queries.interface';
import { IFavouriteQueries } from '@codezeniths/lib/db/queries/interfaces/favourite.queries.interface';
import { IUserQueries } from '@codezeniths/lib/db/queries/interfaces/user.queries.interface';
import { INotificationQueries } from '@codezeniths/lib/db/queries/interfaces/notification.queries.interface';
import { IProductQueries } from '@codezeniths/lib/db/queries/interfaces/product.queries.interface';
import { ISkillQueries } from '@codezeniths/lib/db/queries/interfaces/skill.queries.interface';
import { ISearchQueries } from '@codezeniths/lib/db/queries/interfaces/search.queries.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Base context — the raw Next.js request headers
// ─────────────────────────────────────────────────────────────────────────────
export interface BaseContext {
    headers: Headers;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Utility for Union to Intersection conversion
// ─────────────────────────────────────────────────────────────────────────────
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// ─────────────────────────────────────────────────────────────────────────────
// Context slice type
// A slice is just an async/sync function: (base: BaseContext) => Promise<object> | object
// ─────────────────────────────────────────────────────────────────────────────
type ContextSlice<T extends object> = (base: BaseContext) => Promise<T> | T;

// Infers the merged object type from a tuple of slice functions
type MergedContext<TSlices extends Array<ContextSlice<object>>> = BaseContext &
    UnionToIntersection<{ [K in keyof TSlices]: TSlices[K] extends ContextSlice<infer T> ? T : never }[number]>;

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// Pass any number of slice functions — they all receive BaseContext and their
// results are spread (in order) onto the final context object.
// ─────────────────────────────────────────────────────────────────────────────
export function createContextFactory<TSlices extends Array<ContextSlice<object>>>(
    ...slices: TSlices
) {
    return async function createContext(base: BaseContext): Promise<MergedContext<TSlices>> {
        // Run all slices in parallel
        const results = await Promise.all(slices.map((slice) => slice(base)));

        return Object.assign({}, base, ...results) as MergedContext<TSlices>;
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Definitions
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthContext {
    user: AuthUser | null;
    session: BetterAuthSession | null;
}

export async function createAuthContext({ headers }: BaseContext): Promise<AuthContext> {
    try {
        const authCtx = await AuthService.getContext(headers);
        return {
            user: authCtx.user,
            session: authCtx.session,
        };
    } catch {
        return { user: null, session: null };
    }
}

export interface PrismaContext {
    prisma: PrismaClient;
}

export function createPrismaContext(): PrismaContext {
    return { prisma };
}

export interface ControllersContext {
    controllers: {
        module: IModuleController;
        topic: ITopicController;
        problem: IProblemController;
        tag: ITagController;
        user: IUserController;
        notification: INotificationController;
        product: IProductController;
        skill: ISkillController;
        search: SearchController;
        favourite: IFavouriteController;
    };
}

const moduleController = new ModuleController();
const topicController = new TopicController();
const problemController = new ProblemController();
const tagController = new TagController();
const userController = new UserController();
const notificationController = new NotificationController();
const productController = new ProductController();
const skillController = new SkillController();
const favouriteController = new FavouriteController();
import { searchClient } from '@codezeniths/service/search';
const searchController = new SearchController(searchClient);

export function createControllersContext(): ControllersContext {
    return {
        controllers: {
            module: moduleController,
            topic: topicController,
            problem: problemController,
            tag: tagController,
            user: userController,
            notification: notificationController,
            product: productController,
            skill: skillController,
            search: searchController,
            favourite: favouriteController,
        },
    };
}

export interface QueriesContext {
    queries: {
        module: IModuleQueries;
        topic: ITopicQueries;
        problem: IProblemQueries;
        tag: ITagQueries;
        user: IUserQueries;
        notification: INotificationQueries;
        product: IProductQueries;
        skill: ISkillQueries;
        search: ISearchQueries;
        favourite: IFavouriteQueries;
    };
}

export function createQueriesContext(): QueriesContext {
    return {
        queries: {
            module: new ModuleQueries(),
            topic: new TopicQueries(),
            problem: new ProblemQueries(),
            tag: new TagQueries(),
            user: new UserQueries(),
            notification: new NotificationQueries(),
            product: new ProductQueries(),
            skill: new SkillQueries(),
            search: new SearchQueries(),
            favourite: new FavouriteQueries(),
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// TRPCContext — the fully assembled context type used across the app.
// ─────────────────────────────────────────────────────────────────────────────
export const createTRPCContext = createContextFactory(
    createAuthContext,
    createPrismaContext,
    createControllersContext,
    createQueriesContext
);

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

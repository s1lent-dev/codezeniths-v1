import { createTRPCRouter } from '../trpc';
import { productRouter } from './product.routes';
import { skillRouter } from './skill.routes';
import { moduleRouter } from './module.routes';
import { topicRouter } from './topic.routes';
import { problemRouter } from './problem.routes';
import { tagRouter } from './tag.routes';
import { userRouter } from './user.routes';
import { notificationRouter } from './notification.routes';
import { searchRouter } from './search.routes';
import { favouriteRouter } from './favourite.routes';

export const appRouter = createTRPCRouter({
    module: moduleRouter,
    topic: topicRouter,
    problem: problemRouter,
    tag: tagRouter,
    user: userRouter,
    notification: notificationRouter,
    search: searchRouter,
    product: productRouter,
    skill: skillRouter,
    favourite: favouriteRouter,
});


export type AppRouter = typeof appRouter;

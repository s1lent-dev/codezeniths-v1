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
import { leaderboardRouter } from './leaderboard.routes';
import { playlistRouter } from './playlist.routes';
import { contactRouter } from './contact.routes';

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
    leaderboard: leaderboardRouter,
    playlist: playlistRouter,
    contact: contactRouter,
});


export type AppRouter = typeof appRouter;

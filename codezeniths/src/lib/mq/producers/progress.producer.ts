/**
 * @file progress.producer.ts
 * @description Producer for algorithmic progress, problem solves, module masteries, streaks, and rank promotions.
 */

import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class ProgressProducer {
    private readonly problemSolvedProducer = createProducer('progress.problem.solved', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_PROBLEM_SOLVED,
    });

    private readonly problemUnsolvedProducer = createProducer('progress.problem.unsolved', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_PROBLEM_UNSOLVED,
    });

    private readonly moduleMasteredProducer = createProducer('progress.module.mastered', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_MODULE_MASTERED,
    });

    private readonly streakMilestoneProducer = createProducer('progress.streak.milestone', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_STREAK_MILESTONE,
    });

    private readonly weeklyDigestProducer = createProducer('progress.weekly.digest', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_WEEKLY_DIGEST,
    });

    private readonly rankPromotedProducer = createProducer('progress.rank.promoted', {
        exchange: MqExchange.PROGRESS,
        routingKey: MqRoutingKey.PROGRESS_RANK_PROMOTED,
    });

    /**
     * Publishes a problem-solved event.
     */
    async problemSolved(payload: PayloadOf<'progress.problem.solved'>): Promise<void> {
        await this.problemSolvedProducer.publish(payload);
    }

    /**
     * Publishes a problem-unsolved event.
     */
    async problemUnsolved(payload: PayloadOf<'progress.problem.unsolved'>): Promise<void> {
        await this.problemUnsolvedProducer.publish(payload);
    }

    /**
     * Publishes a module-mastered event.
     */
    async moduleMastered(payload: PayloadOf<'progress.module.mastered'>): Promise<void> {
        await this.moduleMasteredProducer.publish(payload);
    }

    /**
     * Publishes a streak-milestone event.
     */
    async streakMilestone(payload: PayloadOf<'progress.streak.milestone'>): Promise<void> {
        await this.streakMilestoneProducer.publish(payload);
    }

    /**
     * Publishes a weekly progress digest event.
     */
    async weeklyDigest(payload: PayloadOf<'progress.weekly.digest'>): Promise<void> {
        await this.weeklyDigestProducer.publish(payload);
    }

    /**
     * Publishes a leaderboard rank promotion event.
     */
    async rankPromoted(payload: PayloadOf<'progress.rank.promoted'>): Promise<void> {
        await this.rankPromotedProducer.publish(payload);
    }
}

export const progressProducer = new ProgressProducer();

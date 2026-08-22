-- DropIndex
DROP INDEX "user_global_stats_score_idx";

-- DropIndex
DROP INDEX "user_module_stats_moduleId_score_idx";

-- CreateIndex
CREATE INDEX "user_global_stats_score_updatedAt_idx" ON "user_global_stats"("score" DESC, "updatedAt" ASC);

-- CreateIndex
CREATE INDEX "user_module_stats_moduleId_score_updatedAt_idx" ON "user_module_stats"("moduleId", "score" DESC, "updatedAt" ASC);

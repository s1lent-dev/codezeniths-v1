-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('solved', 'not_solved');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('fundamental', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('student', 'early_career', 'mid_career', 'senior');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'working_professional', 'job_seeker', 'educator', 'mentor', 'recruiter', 'org_admin', 'university_rep');

-- CreateEnum
CREATE TYPE "LearningGoal" AS ENUM ('interview_prep', 'competitive_programming', 'cs_fundamentals', 'practice_dsa', 'system_design', 'machine_coding', 'structured_learning', 'reference_reading', 'visualize_concepts', 'community_engagement', 'hire_candidates', 'teach_mentor', 'explore_platform', 'career_growth');

-- CreateEnum
CREATE TYPE "LearningStyle" AS ENUM ('reading_articles', 'video_explanations', 'interactive_visualizations', 'hands_on_coding', 'timed_contests', 'structured_courses', 'peer_discussion');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('web', 'android', 'ios');

-- CreateEnum
CREATE TYPE "SearchCollection" AS ENUM ('problem', 'topic', 'module', 'tag', 'product', 'user');

-- CreateTable
CREATE TABLE "user_global_stats" (
    "userId" UUID NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "bestRank" INTEGER,
    "bestPercentile" DOUBLE PRECISION,
    "totalSolvedCount" INTEGER NOT NULL DEFAULT 0,
    "easySolved" INTEGER NOT NULL DEFAULT 0,
    "mediumSolved" INTEGER NOT NULL DEFAULT 0,
    "hardSolved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_global_stats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "user_module_stats" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "bestRank" INTEGER,
    "bestPercentile" DOUBLE PRECISION,
    "totalSolvedCount" INTEGER NOT NULL DEFAULT 0,
    "easySolved" INTEGER NOT NULL DEFAULT 0,
    "mediumSolved" INTEGER NOT NULL DEFAULT 0,
    "hardSolved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_module_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_module_bookmark" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_module_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_read" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "notificationId" UUID NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_read_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" UUID NOT NULL,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_item" (
    "id" UUID NOT NULL,
    "playlistId" UUID NOT NULL,
    "problemId" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_playlist_bookmark" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "playlistId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_playlist_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem" (
    "id" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "articleUrl" TEXT,
    "problemUrl" TEXT,
    "favouriteCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_progress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "problemId" UUID NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'not_solved',
    "revisit" BOOLEAN NOT NULL DEFAULT false,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "solvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_tag" (
    "id" UUID NOT NULL,
    "problemId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "problem_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "moduleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "proficiency" "ProficiencyLevel" NOT NULL DEFAULT 'beginner',
    "isInterested" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "level" "Level",
    "moduleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tag_bookmark" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tag_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "level" "Level",
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_topic_bookmark" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_topic_bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "resume" TEXT,
    "dob" DATE,
    "about" TEXT,
    "location" TEXT,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN,
    "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "onBoardingStep" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "experienceLevel" "ExperienceLevel",
    "userType" "UserType",
    "gender" "Gender",
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "learningGoals" "LearningGoal"[],
    "learningStyles" "LearningStyle"[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follow" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_view" (
    "id" UUID NOT NULL,
    "viewerId" UUID,
    "viewedUserId" UUID NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" UUID NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "verified" BOOLEAN DEFAULT true,

    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_social_links" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "github" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "website" TEXT,

    CONSTRAINT "user_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_token" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fid" TEXT NOT NULL,
    "platform" "DevicePlatform" NOT NULL DEFAULT 'web',
    "userAgent" TEXT,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'cpp',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "editorFontSize" INTEGER NOT NULL DEFAULT 14,
    "tabSize" INTEGER NOT NULL DEFAULT 4,
    "autosave" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'public',

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_streaks" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastProblemSolvedDate" DATE,
    "streakFreezeAvailable" INTEGER NOT NULL DEFAULT 0,
    "streakFreezeUsed" INTEGER NOT NULL DEFAULT 0,
    "totalActiveDays" INTEGER NOT NULL DEFAULT 0,
    "currentCheckInStreak" INTEGER NOT NULL DEFAULT 0,
    "longestCheckInStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_activities" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT true,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "wasFreezed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_search_histories" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "collection" "SearchCollection" NOT NULL,
    "resultId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_search_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_global_stats_score_updatedAt_idx" ON "user_global_stats"("score" DESC, "updatedAt" ASC);

-- CreateIndex
CREATE INDEX "user_module_stats_moduleId_score_updatedAt_idx" ON "user_module_stats"("moduleId", "score" DESC, "updatedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_module_stats_userId_moduleId_key" ON "user_module_stats"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "module_slug_key" ON "module"("slug");

-- CreateIndex
CREATE INDEX "user_module_bookmark_userId_idx" ON "user_module_bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_module_bookmark_userId_moduleId_key" ON "user_module_bookmark"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "notification_userId_idx" ON "notification"("userId");

-- CreateIndex
CREATE INDEX "notification_createdAt_idx" ON "notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_read_userId_notificationId_key" ON "notification_read"("userId", "notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_slug_key" ON "playlist"("slug");

-- CreateIndex
CREATE INDEX "playlist_creatorId_idx" ON "playlist"("creatorId");

-- CreateIndex
CREATE INDEX "playlist_isPublic_bookmarkCount_idx" ON "playlist"("isPublic", "bookmarkCount" DESC);

-- CreateIndex
CREATE INDEX "playlist_item_playlistId_order_idx" ON "playlist_item"("playlistId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_item_playlistId_problemId_key" ON "playlist_item"("playlistId", "problemId");

-- CreateIndex
CREATE INDEX "user_playlist_bookmark_userId_idx" ON "user_playlist_bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_playlist_bookmark_userId_playlistId_key" ON "user_playlist_bookmark"("userId", "playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_slug_key" ON "problem"("slug");

-- CreateIndex
CREATE INDEX "problem_progress_userId_status_idx" ON "problem_progress"("userId", "status");

-- CreateIndex
CREATE INDEX "problem_progress_userId_revisit_idx" ON "problem_progress"("userId", "revisit");

-- CreateIndex
CREATE INDEX "problem_progress_userId_status_solvedAt_idx" ON "problem_progress"("userId", "status", "solvedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "problem_progress_userId_problemId_key" ON "problem_progress"("userId", "problemId");

-- CreateIndex
CREATE INDEX "problem_tag_problemId_tagId_idx" ON "problem_tag"("problemId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_tag_problemId_tagId_key" ON "problem_tag"("problemId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "skill_slug_key" ON "skill"("slug");

-- CreateIndex
CREATE INDEX "user_skill_userId_idx" ON "user_skill"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_userId_skillId_key" ON "user_skill"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_slug_key" ON "tag"("slug");

-- CreateIndex
CREATE INDEX "user_tag_bookmark_userId_idx" ON "user_tag_bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tag_bookmark_userId_tagId_key" ON "user_tag_bookmark"("userId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "topic_slug_key" ON "topic"("slug");

-- CreateIndex
CREATE INDEX "user_topic_bookmark_userId_idx" ON "user_topic_bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_topic_bookmark_userId_topicId_key" ON "user_topic_bookmark"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_follow_followerId_idx" ON "user_follow"("followerId");

-- CreateIndex
CREATE INDEX "user_follow_followingId_idx" ON "user_follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "user_follow_followerId_followingId_key" ON "user_follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "profile_view_viewedUserId_viewedAt_idx" ON "profile_view"("viewedUserId", "viewedAt" DESC);

-- CreateIndex
CREATE INDEX "profile_view_viewerId_idx" ON "profile_view"("viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_token_expiresAt_idx" ON "session"("token", "expiresAt");

-- CreateIndex
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor"("secret");

-- CreateIndex
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_social_links_userId_key" ON "user_social_links"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "device_token_fid_key" ON "device_token"("fid");

-- CreateIndex
CREATE INDEX "device_token_userId_idx" ON "device_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "user_preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_userId_key" ON "user_streaks"("userId");

-- CreateIndex
CREATE INDEX "user_streaks_currentStreak_idx" ON "user_streaks"("currentStreak" DESC);

-- CreateIndex
CREATE INDEX "user_streaks_longestStreak_idx" ON "user_streaks"("longestStreak" DESC);

-- CreateIndex
CREATE INDEX "user_streaks_totalActiveDays_idx" ON "user_streaks"("totalActiveDays" DESC);

-- CreateIndex
CREATE INDEX "user_daily_activities_userId_date_idx" ON "user_daily_activities"("userId", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_activities_userId_date_key" ON "user_daily_activities"("userId", "date");

-- CreateIndex
CREATE INDEX "user_search_histories_userId_updatedAt_idx" ON "user_search_histories"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_search_histories_userId_collection_resultId_key" ON "user_search_histories"("userId", "collection", "resultId");

-- AddForeignKey
ALTER TABLE "user_global_stats" ADD CONSTRAINT "user_global_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_stats" ADD CONSTRAINT "user_module_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_stats" ADD CONSTRAINT "user_module_stats_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_bookmark" ADD CONSTRAINT "user_module_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_bookmark" ADD CONSTRAINT "user_module_bookmark_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_read" ADD CONSTRAINT "notification_read_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_read" ADD CONSTRAINT "notification_read_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_item" ADD CONSTRAINT "playlist_item_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_item" ADD CONSTRAINT "playlist_item_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_playlist_bookmark" ADD CONSTRAINT "user_playlist_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_playlist_bookmark" ADD CONSTRAINT "user_playlist_bookmark_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem" ADD CONSTRAINT "problem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_progress" ADD CONSTRAINT "problem_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_progress" ADD CONSTRAINT "problem_progress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_tag" ADD CONSTRAINT "problem_tag_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_tag" ADD CONSTRAINT "problem_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skill" ADD CONSTRAINT "user_skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tag_bookmark" ADD CONSTRAINT "user_tag_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tag_bookmark" ADD CONSTRAINT "user_tag_bookmark_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_topic_bookmark" ADD CONSTRAINT "user_topic_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_topic_bookmark" ADD CONSTRAINT "user_topic_bookmark_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_view" ADD CONSTRAINT "profile_view_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_view" ADD CONSTRAINT "profile_view_viewedUserId_fkey" FOREIGN KEY ("viewedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_social_links" ADD CONSTRAINT "user_social_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_token" ADD CONSTRAINT "device_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_activities" ADD CONSTRAINT "user_daily_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_search_histories" ADD CONSTRAINT "user_search_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

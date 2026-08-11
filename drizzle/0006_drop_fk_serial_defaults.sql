-- Foreign-key columns were originally created as `serial`, so each carries a
-- leftover `nextval(...)` default in the live database. app/db/schema.ts
-- declares them as plain `integer` references, and every route supplies the
-- value explicitly, so the defaults never fire in normal use. They are still a
-- hazard: an INSERT that omits the column would silently invent a foreign key
-- from the sequence instead of raising a not-null error, attaching the row to
-- an arbitrary (or non-existent) parent.
--
-- Dropping the default and then the orphaned sequence. Both statements are
-- idempotent, so re-running this migration is safe.
ALTER TABLE "chatMessage" ALTER COLUMN "session_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chatSession" ALTER COLUMN "user_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ALTER COLUMN "session_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "interviewSessions" ALTER COLUMN "user_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "resume" ALTER COLUMN "user_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "resumeAnalysis" ALTER COLUMN "resume_id" DROP DEFAULT;--> statement-breakpoint
DROP SEQUENCE IF EXISTS "chatMessage_session_id_seq";--> statement-breakpoint
DROP SEQUENCE IF EXISTS "chatSession_user_id_seq";--> statement-breakpoint
DROP SEQUENCE IF EXISTS "interviewQuestions_session_id_seq";--> statement-breakpoint
DROP SEQUENCE IF EXISTS "interviewSessions_user_id_seq";--> statement-breakpoint
DROP SEQUENCE IF EXISTS "resume_user_id_seq";--> statement-breakpoint
DROP SEQUENCE IF EXISTS "resumeAnalysis_resume_id_seq";

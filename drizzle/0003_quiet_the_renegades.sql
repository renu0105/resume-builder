DROP TABLE "interviewAnswers" CASCADE;--> statement-breakpoint
DROP TABLE "interviewFeedback" CASCADE;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ADD COLUMN "answer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ADD COLUMN "score" integer;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ADD COLUMN "feedback" text;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ADD COLUMN "improved_answer" text;--> statement-breakpoint
ALTER TABLE "interviewSessions" ADD COLUMN "overall_score" integer;--> statement-breakpoint
ALTER TABLE "interviewSessions" ADD COLUMN "overall_feedback" text;
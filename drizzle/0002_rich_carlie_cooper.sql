ALTER TABLE "chatMessage" ALTER COLUMN "session_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chatSession" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interviewAnswers" ALTER COLUMN "question_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interviewFeedback" ALTER COLUMN "answer_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ALTER COLUMN "session_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interviewSessions" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "resume" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "resumeAnalysis" ALTER COLUMN "resume_id" SET DATA TYPE integer;
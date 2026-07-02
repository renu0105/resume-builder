CREATE TABLE "chatMessage" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" serial NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewAnswers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" serial NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewFeedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"answer_id" serial NOT NULL,
	"feedback" text NOT NULL,
	"score" text NOT NULL,
	"improved_answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewQuestions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" serial NOT NULL,
	"question" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewSessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"role" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumeAnalysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" serial NOT NULL,
	"analysis_result" text NOT NULL,
	"score" text NOT NULL,
	"summary" text NOT NULL,
	"suggestions" text NOT NULL,
	"missing_keywords" text NOT NULL,
	"improvement_areas" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumeTemplate" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"preview_image" text NOT NULL,
	"latex_template" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chatMessage" ADD CONSTRAINT "chatMessage_session_id_chatSession_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chatSession"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatSession" ADD CONSTRAINT "chatSession_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewAnswers" ADD CONSTRAINT "interviewAnswers_question_id_interviewQuestions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."interviewQuestions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewFeedback" ADD CONSTRAINT "interviewFeedback_answer_id_interviewAnswers_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."interviewAnswers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewQuestions" ADD CONSTRAINT "interviewQuestions_session_id_interviewSessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."interviewSessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewSessions" ADD CONSTRAINT "interviewSessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumeAnalysis" ADD CONSTRAINT "resumeAnalysis_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE no action ON UPDATE no action;
-- "resumeTemplate" rows are a per-user log of which template a resume was saved
-- with, but the table had no owner column, so the dashboard's "Templates Used"
-- card counted every user's saves. Nullable because rows written before this
-- migration have no recoverable owner; they simply count for nobody.
ALTER TABLE "resumeTemplate" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "resumeTemplate" ADD CONSTRAINT "resumeTemplate_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
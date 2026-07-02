import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resumeTemplate = pgTable("resumeTemplate", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  previewImage: text("preview_image").notNull(),
  latexTemplate: text("latex_template").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resumeAnalysis = pgTable("resumeAnalysis", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id")
    .notNull()
    .references(() => resume.id),
  analysisResult: text("analysis_result").notNull(),
  score: text("score").notNull(),
  summary: text("summary").notNull(),
  suggestions: text("suggestions").notNull(),
  missingKeywords: text("missing_keywords").notNull(),
  improvementAreas: text("improvement_areas"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatSession = pgTable("chatSession", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessage = pgTable("chatMessage", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => chatSession.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const interviewSessions = pgTable("interviewSessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(),
  title: text("title").notNull(),
  overallScore: integer("overall_score"),

  overallFeedback: text("overall_feedback"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const interviewQuestions = pgTable("interviewQuestions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => interviewSessions.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  score: integer("score"),
  feedback: text("feedback"),
  improvedAnswer: text("improved_answer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  experienceLevel: text("experience_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyTasks = pgTable("study_tasks", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => studyPlans.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  isCompleted: boolean("is_completed").default(false),
  order: integer("order").notNull(),
});

export const studyPlansRelations = relations(studyPlans, ({ many }) => ({
  tasks: many(studyTasks),
}));

export const studyTasksRelations = relations(studyTasks, ({ one }) => ({
  plan: one(studyPlans, {
    fields: [studyTasks.planId],
    references: [studyPlans.id],
  }),
}));

export const insertStudyPlanSchema = createInsertSchema(studyPlans).omit({ id: true, createdAt: true });
export const insertStudyTaskSchema = createInsertSchema(studyTasks).omit({ id: true });

export type StudyPlan = typeof studyPlans.$inferSelect;
export type InsertStudyPlan = z.infer<typeof insertStudyPlanSchema>;
export type StudyTask = typeof studyTasks.$inferSelect;
export type InsertStudyTask = z.infer<typeof insertStudyTaskSchema>;

// API Request/Response Types
export type GeneratePlanRequest = {
  topic: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  goals?: string;
};

export type PlanWithTasks = StudyPlan & { tasks: StudyTask[] };

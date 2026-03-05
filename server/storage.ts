import { db } from "./db";
import { studyPlans, studyTasks, type InsertStudyPlan, type InsertStudyTask } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPlans(): Promise<(typeof studyPlans.$inferSelect)[]>;
  getPlan(id: number): Promise<typeof studyPlans.$inferSelect | undefined>;
  createPlan(plan: InsertStudyPlan): Promise<typeof studyPlans.$inferSelect>;
  deletePlan(id: number): Promise<void>;
  
  getTasksByPlanId(planId: number): Promise<(typeof studyTasks.$inferSelect)[]>;
  createTask(task: InsertStudyTask): Promise<typeof studyTasks.$inferSelect>;
  updateTask(id: number, updates: Partial<InsertStudyTask>): Promise<typeof studyTasks.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getPlans() {
    return await db.select().from(studyPlans);
  }

  async getPlan(id: number) {
    const [plan] = await db.select().from(studyPlans).where(eq(studyPlans.id, id));
    return plan;
  }

  async createPlan(plan: InsertStudyPlan) {
    const [newPlan] = await db.insert(studyPlans).values(plan).returning();
    return newPlan;
  }

  async deletePlan(id: number) {
    await db.delete(studyPlans).where(eq(studyPlans.id, id));
  }

  async getTasksByPlanId(planId: number) {
    return await db.select().from(studyTasks).where(eq(studyTasks.planId, planId)).orderBy(studyTasks.order);
  }

  async createTask(task: InsertStudyTask) {
    const [newTask] = await db.insert(studyTasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertStudyTask>) {
    const [updatedTask] = await db.update(studyTasks)
      .set(updates)
      .where(eq(studyTasks.id, id))
      .returning();
    return updatedTask;
  }
}

export const storage = new DatabaseStorage();

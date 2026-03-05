import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/image/client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.plans.list.path, async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  app.get(api.plans.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getPlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      const tasks = await storage.getTasksByPlanId(id);
      res.json({ ...plan, tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });

  app.post(api.plans.generate.path, async (req, res) => {
    try {
      const { topic, experienceLevel, goals } = api.plans.generate.input.parse(req.body);

      // Generate plan using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: "You are an expert educational curriculum designer. Create a personalized study plan with actionable tasks. Respond ONLY with valid JSON."
          },
          {
            role: "user",
            content: `Create a study plan for:
Topic: ${topic}
Experience Level: ${experienceLevel}
Goals: ${goals || "Learn the fundamentals and be able to apply them"}

Return JSON in this format:
{
  "title": "A catchy title for the plan",
  "description": "A short 1-2 sentence description of what this plan covers",
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description and resources/tips",
      "estimatedMinutes": 30
    }
  ]
}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const aiContent = response.choices[0]?.message?.content;
      if (!aiContent) {
        throw new Error("Failed to generate plan");
      }

      const generatedPlan = JSON.parse(aiContent);

      // Save to database
      const plan = await storage.createPlan({
        topic: generatedPlan.title || topic,
        description: generatedPlan.description || `Study plan for ${topic}`,
        experienceLevel,
      });

      const tasks = [];
      let order = 0;
      for (const t of generatedPlan.tasks || []) {
        const task = await storage.createTask({
          planId: plan.id,
          title: t.title || "Study Task",
          description: t.description || "Study this topic",
          estimatedMinutes: t.estimatedMinutes || 30,
          isCompleted: false,
          order: order++,
        });
        tasks.push(task);
      }

      res.status(201).json({ ...plan, tasks });
    } catch (error) {
      console.error("Error generating plan:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to generate plan. Please try again." });
      }
    }
  });

  app.delete(api.plans.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlan(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete plan" });
    }
  });

  app.patch(api.tasks.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = api.tasks.update.input.parse(req.body);
      
      const task = await storage.updateTask(id, updates);
      res.json(task);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to update task" });
      }
    }
  });

  return httpServer;
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateStudyPlan(data: {
  subject: string;
  goal: string;
  duration: string;
}) {
  const model = "gemini-3-flash-preview";
  const prompt = `Create a detailed, personalized study plan for the following:
  Subject: ${data.subject}
  Goal: ${data.goal}
  Duration: ${data.duration}

  The plan should include:
  1. A structured weekly or daily schedule.
  2. Key topics to cover.
  3. Recommended resources or study techniques.
  4. Milestones to track progress.

  Format the output in clean Markdown.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Failed to generate plan.";
}

import { storage } from "./storage";

async function seedDatabase() {
  const existingPlans = await storage.getPlans();
  if (existingPlans.length === 0) {
    const plan1 = await storage.createPlan({
      topic: "Introduction to React",
      description: "Learn the fundamentals of building user interfaces with React, including components, state, and props.",
      experienceLevel: "beginner",
    });

    await storage.createTask({
      planId: plan1.id,
      title: "React Components",
      description: "Understand how to build and compose reusable React components.",
      estimatedMinutes: 60,
      isCompleted: false,
      order: 0,
    });

    await storage.createTask({
      planId: plan1.id,
      title: "Managing State",
      description: "Learn how to use the useState hook to manage component state.",
      estimatedMinutes: 45,
      isCompleted: false,
      order: 1,
    });

    const plan2 = await storage.createPlan({
      topic: "Advanced TypeScript",
      description: "Deep dive into TypeScript's type system, including generics, utility types, and advanced patterns.",
      experienceLevel: "advanced",
    });

    await storage.createTask({
      planId: plan2.id,
      title: "Generics in TypeScript",
      description: "Master the use of generic types for flexible and reusable code.",
      estimatedMinutes: 90,
      isCompleted: false,
      order: 0,
    });
    
    console.log("Database seeded successfully");
  } else {
    console.log("Database already has data");
  }
}

seedDatabase().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

import { z } from 'zod';
import { studyPlans, studyTasks } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  plans: {
    list: {
      method: 'GET' as const,
      path: '/api/plans' as const,
      responses: {
        200: z.array(z.custom<typeof studyPlans.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/plans/:id' as const,
      responses: {
        200: z.custom<typeof studyPlans.$inferSelect & { tasks: typeof studyTasks.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/plans/generate' as const,
      input: z.object({
        topic: z.string().min(1, "Topic is required"),
        experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
        goals: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof studyPlans.$inferSelect & { tasks: typeof studyTasks.$inferSelect[] }>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/plans/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  tasks: {
    update: {
      method: 'PATCH' as const,
      path: '/api/tasks/:id' as const,
      input: z.object({
        isCompleted: z.boolean().optional(),
      }),
      responses: {
        200: z.custom<typeof studyTasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

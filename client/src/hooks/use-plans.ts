import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Helper to log Zod errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePlans() {
  return useQuery({
    queryKey: [api.plans.list.path],
    queryFn: async () => {
      const res = await fetch(api.plans.list.path);
      if (!res.ok) throw new Error("Failed to fetch plans");
      const data = await res.json();
      return parseWithLogging(api.plans.list.responses[200], data, "plans.list");
    },
  });
}

export function usePlan(id: number) {
  const path = buildUrl(api.plans.get.path, { id });
  return useQuery({
    queryKey: [api.plans.get.path, id],
    queryFn: async () => {
      const res = await fetch(path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch plan details");
      const data = await res.json();
      return parseWithLogging(api.plans.get.responses[200], data, "plans.get");
    },
    enabled: !!id && !isNaN(id),
  });
}

type GeneratePlanInput = z.infer<typeof api.plans.generate.input>;

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: GeneratePlanInput) => {
      const validated = api.plans.generate.input.parse(input);
      const res = await fetch(api.plans.generate.path, {
        method: api.plans.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate plan");
      }
      
      const data = await res.json();
      return parseWithLogging(api.plans.generate.responses[201], data, "plans.generate");
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: [api.plans.list.path] });
      toast({
        title: "Plan Generated",
        description: `Successfully created plan for: ${newPlan.topic}`,
      });
    },
    onError: (err) => {
      toast({
        title: "Generation Failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    }
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const path = buildUrl(api.plans.delete.path, { id });
      const res = await fetch(path, { method: api.plans.delete.method });
      if (!res.ok) throw new Error("Failed to delete plan");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.plans.list.path] });
      toast({
        title: "Plan Deleted",
        description: "The study plan has been removed.",
      });
    },
    onError: (err) => {
      toast({
        title: "Deletion Failed",
        description: err instanceof Error ? err.message : "Could not delete plan",
        variant: "destructive",
      });
    }
  });
}

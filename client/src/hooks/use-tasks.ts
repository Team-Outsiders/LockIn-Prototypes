import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type UpdateTaskInput = z.infer<typeof api.tasks.update.input>;

export function useUpdateTask(planId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateTaskInput) => {
      const validated = api.tasks.update.input.parse(updates);
      const path = buildUrl(api.tasks.update.path, { id });
      
      const res = await fetch(path, {
        method: api.tasks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    // Optimistic Update for a snappy checkbox experience
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: [api.plans.get.path, planId] });
      
      const previousPlan = queryClient.getQueryData([api.plans.get.path, planId]);
      
      queryClient.setQueryData([api.plans.get.path, planId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((task: any) => 
            task.id === id ? { ...task, isCompleted: isCompleted ?? task.isCompleted } : task
          )
        };
      });
      
      return { previousPlan };
    },
    onError: (err, variables, context) => {
      if (context?.previousPlan) {
        queryClient.setQueryData([api.plans.get.path, planId], context.previousPlan);
      }
      toast({
        title: "Update Failed",
        description: "Could not save task progress.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.plans.get.path, planId] });
    }
  });
}

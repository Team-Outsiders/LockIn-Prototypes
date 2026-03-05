import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";
import { usePlan, useDeletePlan } from "@/hooks/use-plans";
import { useUpdateTask } from "@/hooks/use-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function PlanDetails() {
  const { id } = useParams<{ id: string }>();
  const planId = parseInt(id, 10);
  const [, setLocation] = useLocation();

  const { data: plan, isLoading, error } = usePlan(planId);
  const deleteMutation = useDeletePlan();
  const updateTaskMutation = useUpdateTask(planId);

  if (isLoading) {
    return (
      <div className="pt-4 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-24 mb-8 bg-card" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 bg-card" />
          <Skeleton className="h-6 w-full bg-card" />
          <Skeleton className="h-6 w-5/6 bg-card" />
        </div>
        <div className="space-y-4 mt-12">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl bg-card" />)}
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="pt-20 text-center">
        <h2 className="text-2xl font-display font-semibold mb-2 text-foreground">Plan not found</h2>
        <p className="text-muted-foreground mb-6">This plan might have been deleted or doesn't exist.</p>
        <button onClick={() => setLocation("/")} className="text-primary font-medium hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const tasks = plan.tasks || [];
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const handleToggleTask = (taskId: number, currentStatus: boolean) => {
    updateTaskMutation.mutate({ id: taskId, isCompleted: !currentStatus });
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(planId);
      setLocation("/");
    } catch (e) {
      // Error handled by hook toast
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-4 max-w-4xl mx-auto pb-20"
    >
      <button 
        onClick={() => setLocation("/")}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* Header Section */}
      <div className="bg-card rounded-3xl p-8 md:p-10 border border-border/60 shadow-lg shadow-black/5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-transparent">
              <GraduationCap className="w-4 h-4 mr-2" />
              {plan.experienceLevel.charAt(0).toUpperCase() + plan.experienceLevel.slice(1)}
            </Badge>
            <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-border/60 bg-background/50">
              <Clock className="w-4 h-4 mr-2 opacity-70" />
              {hours > 0 ? `${hours}h ` : ''}{minutes}m total
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            {plan.topic}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {plan.description}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-10 px-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Your Progress
          </h3>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {completedCount} of {tasks.length} tasks
          </span>
        </div>
        <Progress value={progressPercent} className="h-3 bg-secondary/50" indicatorClassName="bg-primary" />
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.sort((a, b) => a.order - b.order).map((task) => (
          <motion.div 
            key={task.id}
            layout
            className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
              task.isCompleted 
                ? 'bg-secondary/30 border-transparent opacity-75' 
                : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
            }`}
          >
            <button 
              onClick={() => handleToggleTask(task.id, task.isCompleted || false)}
              className="mt-1 shrink-0 transition-transform active:scale-90"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-primary transition-colors" />
              ) : (
                <Circle className="w-7 h-7 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
              )}
            </button>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h4 className={`text-lg font-semibold transition-colors ${task.isCompleted ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'}`}>
                  {task.title}
                </h4>
                <span className="shrink-0 text-xs font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border/50">
                  {task.estimatedMinutes}m
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${task.isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-20 pt-8 border-t border-border flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete Plan
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border-border/60 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                This will permanently delete your study plan for "{plan.topic}" and remove all progress. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="rounded-xl h-11">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="rounded-xl h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Plan"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

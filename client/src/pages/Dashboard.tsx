import { usePlans } from "@/hooks/use-plans";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Sparkles, Calendar, ArrowRight, BookOpenText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const { data: plans, isLoading } = usePlans();

  return (
    <div className="pt-4 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-foreground tracking-tight">Your Study Plans</h1>
          <p className="text-muted-foreground mt-2 text-lg">Pick up where you left off or start something new.</p>
        </div>
        <Link 
          href="/generate"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Plan
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-card border border-border/50 shadow-sm" />
          ))}
        </div>
      ) : plans?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-card rounded-3xl border border-border border-dashed shadow-sm"
        >
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <BookOpenText className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-2xl font-display text-foreground mb-2">No active plans</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't generated any study plans yet. Create your first personalized learning path using AI to get started.
          </p>
          <Link 
            href="/generate"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Create Your First Plan
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {plans?.map((plan) => (
            <motion.div key={plan.id} variants={item}>
              <Link 
                href={`/plans/${plan.id}`}
                className="group block h-full bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="capitalize bg-secondary/50 border-secondary-foreground/10 text-xs py-1 px-3">
                      {plan.experienceLevel}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {plan.topic}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5 opacity-70" />
                      {plan.createdAt ? format(new Date(plan.createdAt), "MMM d, yyyy") : "Recently"}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

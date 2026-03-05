import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Target, Lightbulb, ArrowRight, Loader2 } from "lucide-react";
import { useGeneratePlan } from "@/hooks/use-plans";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const LOADING_STEPS = [
  "Analyzing your topic...",
  "Evaluating experience level...",
  "Structuring the curriculum...",
  "Generating actionable tasks...",
  "Finalizing your plan...",
];

export function GeneratePlan() {
  const [, setLocation] = useLocation();
  const generateMutation = useGeneratePlan();
  
  const [topic, setTopic] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [goals, setGoals] = useState("");
  
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle through loading steps while pending
  useEffect(() => {
    if (!generateMutation.isPending) return;
    
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [generateMutation.isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    try {
      const newPlan = await generateMutation.mutateAsync({
        topic,
        experienceLevel,
        goals: goals.trim() || undefined,
      });
      setLocation(`/plans/${newPlan.id}`);
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="pt-4 md:pt-10 max-w-3xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col relative">
      <AnimatePresence mode="wait">
        {generateMutation.isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
            </div>
            
            <div className="h-10 relative w-full overflow-hidden flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStepIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute text-xl font-display font-medium text-foreground"
                >
                  {LOADING_STEPS[loadingStepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-muted-foreground mt-4">AI is crafting your perfect study path...</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 text-primary mb-6 shadow-sm border border-primary/10">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-5xl font-display tracking-tight text-foreground mb-4">
                Design Your Path
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tell us what you want to learn, and our AI will build a comprehensive, step-by-step roadmap tailored to you.
              </p>
            </div>

            <Card className="p-6 md:p-8 rounded-3xl border-border/60 shadow-lg shadow-black/5 bg-background/50 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Topic Input */}
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-base flex items-center gap-2 font-medium">
                    <Target className="w-4 h-4 text-primary" /> What do you want to learn?
                  </Label>
                  <Input 
                    id="topic" 
                    placeholder="e.g. Machine Learning, Ancient Rome, React Native..." 
                    className="h-14 text-lg px-4 rounded-xl subtle-ring bg-card"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Experience Level */}
                  <div className="space-y-3">
                    <Label htmlFor="level" className="text-base flex items-center gap-2 font-medium">
                      <BrainCircuit className="w-4 h-4 text-primary" /> Current Experience
                    </Label>
                    <Select 
                      value={experienceLevel} 
                      onValueChange={(v) => setExperienceLevel(v as any)}
                    >
                      <SelectTrigger id="level" className="h-14 px-4 rounded-xl subtle-ring bg-card text-base">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 shadow-xl">
                        <SelectItem value="beginner" className="py-3 text-base cursor-pointer">Beginner - Start from scratch</SelectItem>
                        <SelectItem value="intermediate" className="py-3 text-base cursor-pointer">Intermediate - Know the basics</SelectItem>
                        <SelectItem value="advanced" className="py-3 text-base cursor-pointer">Advanced - Deep dive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-3">
                  <Label htmlFor="goals" className="text-base flex items-center gap-2 font-medium">
                    <Lightbulb className="w-4 h-4 text-primary" /> Specific Goals (Optional)
                  </Label>
                  <Textarea 
                    id="goals" 
                    placeholder="Any specific projects or outcomes you want to achieve? e.g. 'I want to build a real-time chat app'" 
                    className="min-h-[120px] text-base p-4 rounded-xl subtle-ring bg-card resize-y"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!topic.trim() || generateMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 h-14 rounded-xl font-semibold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Generate Study Plan <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

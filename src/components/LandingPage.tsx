import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Clock, Shield } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 mb-6 border border-zinc-200 dark:border-zinc-700">
                  <Sparkles size={14} className="mr-2 text-blue-500" />
                  Powered by Gemini AI
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                  Master Your Learning with AI Precision
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                  Stop guessing what to study next. Lumina AI creates personalized, 
                  data-driven study plans tailored to your goals and schedule.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={onStart}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
                  >
                    Get Started for Free
                  </button>
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-full font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    Watch Demo
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="text-blue-500" />}
                title="Personalized Paths"
                description="AI analyzes your subject and goals to build a unique roadmap just for you."
              />
              <FeatureCard
                icon={<Clock className="text-purple-500" />}
                title="Smart Scheduling"
                description="Optimize your study sessions based on your available time and energy levels."
              />
              <FeatureCard
                icon={<Shield className="text-emerald-500" />}
                title="Progress Tracking"
                description="Stay motivated with clear milestones and actionable feedback on your journey."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-xl">Lumina AI</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2024 Lumina Study AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

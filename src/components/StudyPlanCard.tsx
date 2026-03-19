import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Trash2, ChevronRight, BookOpen, Clock, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StudyPlan } from '../types';
import { format } from 'date-fns';

interface StudyPlanCardProps {
  plan: StudyPlan;
  onDelete: (id: number) => void;
}

export default function StudyPlanCard({ plan, onDelete }: StudyPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <BookOpen size={20} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plan.id);
            }}
            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-1">{plan.title}</h3>
        <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{plan.goal}</p>

        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {plan.duration}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(plan.created_at), 'MMM d, yyyy')}
          </div>
        </div>

        <div className="mt-6 flex items-center text-sm font-semibold text-blue-500 group-hover:gap-2 transition-all">
          View Details
          <ChevronRight size={16} />
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{plan.title}</h2>
                  <p className="text-zinc-500">{plan.subject} • {plan.duration}</p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="markdown-body prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{plan.content}</ReactMarkdown>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Print Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

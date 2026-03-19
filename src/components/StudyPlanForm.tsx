import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateStudyPlan } from '../lib/gemini';

interface StudyPlanFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudyPlanForm({ onClose, onSuccess }: StudyPlanFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    goal: '',
    duration: '1 week',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const content = await generateStudyPlan({
        subject: formData.subject,
        goal: formData.goal,
        duration: formData.duration,
      });

      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content,
        }),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-blue-500" size={24} />
            New Study Plan
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Plan Title</label>
            <input
              required
              type="text"
              placeholder="e.g., Quantum Physics Mastery"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Subject</label>
              <input
                required
                type="text"
                placeholder="e.g., Physics"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Duration</label>
              <select
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>3 months</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Learning Goal</label>
            <textarea
              required
              placeholder="What do you want to achieve? e.g., Understand the basics of quantum mechanics and solve Schrodinger equation."
              rows={4}
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AI is crafting your plan...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Plan
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

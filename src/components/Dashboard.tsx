import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, List, Search, Trash2, Calendar, BookText } from 'lucide-react';
import { StudyPlan } from '../types';
import StudyPlanForm from './StudyPlanForm';
import StudyPlanCard from './StudyPlanCard';

export default function Dashboard() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Study Plans</h1>
          <p className="text-zinc-500">Manage and track your personalized learning journeys.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-semibold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Create New Plan
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          type="text"
          placeholder="Search plans by title or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan) => (
              <StudyPlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookText size={32} className="text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No plans found</h3>
          <p className="text-zinc-500 mb-8">Create your first AI-powered study plan to get started.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Create Plan
          </button>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <StudyPlanForm 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchPlans();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

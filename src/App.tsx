import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setView('landing')}
            >
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Sparkles size={16} className="text-white dark:text-zinc-900" />
              </div>
              <span className="font-bold text-xl tracking-tight">Lumina AI</span>
            </div>

            <div className="flex items-center gap-4">
              {view === 'dashboard' && (
                <button
                  onClick={() => setView('landing')}
                  className="hidden md:block text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Home
                </button>
              )}
              <ThemeToggle />
              {view === 'landing' && (
                <button
                  onClick={() => setView('dashboard')}
                  className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

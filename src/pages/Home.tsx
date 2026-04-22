import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-8"
      >
        <div className="inline-flex items-center space-x-2 bg-[var(--color-dark-border)] rounded-full px-4 py-1.5 font-bold uppercase text-[10px] tracking-[0.2em] text-[var(--color-neon-blue)]">
          <Sparkles className="w-4 h-4" />
          <span>Featured Masterpiece</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          Immerse Yourself in<br />
          Captivating Novels
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Read, write, and explore the best Urdu novels in a beautifully crafted dark space. From romance to mystery, find your next obsession.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            to="/novels"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-full bg-white text-black hover:bg-gray-200"
          >
            Start Reading
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-full border border-[var(--color-dark-border)] bg-transparent text-white hover:bg-[var(--color-dark-border)]"
          >
            Join the Community
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

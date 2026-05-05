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

        <div className="flex items-center justify-center gap-4 pt-4 pb-20">
          <Link
            to="/novels"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-full bg-white text-black hover:bg-gray-200"
          >
            Start Reading
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-full border border-zinc-800 bg-transparent text-white hover:bg-zinc-800"
          >
            Join the Community
          </Link>
        </div>

        {/* Featured Novel Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-left bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 md:p-12 mt-12 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen className="w-40 h-40" />
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                Our Pick
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Featured Story</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Experience a journey of profound emotion and literary beauty. Our curated masterpiece takes you through the depths of love and the echoes of time.
              </p>
              <div className="pt-4">
                <Link 
                  to="/novels" 
                  className="text-white font-bold text-xs uppercase tracking-widest border-b-2 border-white pb-1 hover:border-purple-500 hover:text-purple-400 transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
            
            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6 transform group-hover:translate-y--2 transition-transform duration-500">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold urdu-text" dir="rtl">وفا کی آخری لکیر</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Romantic Drama</p>
              </div>
              <p className="text-zinc-400 urdu-text text-sm line-clamp-3 leading-relaxed" dir="rtl">
                ایک ایسی داستانِ محبت جو وقت کی حدود سے پرے، روح کی گہرائیوں میں لکھی گئی۔ یہ کہانی ہے ان خاموش جذبوں کی جو کبھی بیان نہ ہو سکے، مگر ان کی تپش نے دو زندگیوں کو ہمیشہ کے لیے بدل دیا۔
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 pt-4 border-t border-zinc-900">
                <span>By System Author</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 524 Likes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Star, ArrowRight, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Bio Atmospheric Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-12"
        >
          <div className="inline-flex items-center space-x-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 font-bold uppercase text-[10px] tracking-[0.3em] text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>Discover Urdu Literature</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              Where Stories <br />
              <span className="text-purple-500 italic font-serif">Touch Your Soul</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Experience the art of Urdu storytelling in a revolutionary reading space. 
              Escape into worlds of love, longing, and unforgettable memories.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <Link
              to="/novels"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-full bg-white text-black hover:pr-14 overflow-hidden"
            >
              <span className="relative z-10">Browse Library</span>
              <ArrowRight className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 w-5 h-5 translate-x-4 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-full border border-zinc-800 bg-transparent text-white hover:bg-zinc-800/50"
            >
              Join the Community
            </Link>
          </div>

          {/* Featured Collections */}
          <div className="grid md:grid-cols-2 gap-8 pt-24 text-left">
            {/* Wafa ki Aakhri Lakeer */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group p-8 bg-zinc-900/30 border border-zinc-800 rounded-[40px] hover:bg-zinc-900/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 ring-4 ring-purple-600/5">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Romance</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Masterpiece</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold urdu-text mb-4" dir="rtl">وفا کی آخری لکیر</h3>
              <p className="text-zinc-400 urdu-text text-lg line-clamp-3 leading-relaxed mb-6" dir="rtl">
                ایک ایسی داستانِ محبت جو وقت کی حدود سے پرے، روح کی گہرائیوں میں لکھی گئی۔ یہ کہانی ہے ان خاموش جذبوں کی جو کبھی بیان نہ ہو سکے...
              </p>
              <Link to="/novels" className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Read the Book <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Tanhai ka Safar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group p-8 bg-zinc-900/30 border border-zinc-800 rounded-[40px] hover:bg-zinc-900/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 ring-4 ring-blue-600/5">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tragedy</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Sad & Lovely</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold urdu-text mb-4" dir="rtl">تنہائی کا سفر</h3>
              <p className="text-zinc-400 urdu-text text-lg line-clamp-3 leading-relaxed mb-6" dir="rtl">
                ایک ایسی کہانی جو تنہائی اور اداسی کے گہرے رنگوں میں ڈوبی ہوئی ہے۔ یہ سفر ہے ان خوابوں کا جو کبھی شرمندہ تعبیر نہ ہو سکے...
              </p>
              <Link to="/novels" className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Read the Book <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <footer className="max-w-7xl mx-auto px-4 py-20 border-t border-zinc-800/50 mt-20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <span className="font-bold tracking-widest text-xs uppercase">Shab-e-Firaq</span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Pure Urdu Literature Experience</p>
      </footer>
    </div>
  );
}

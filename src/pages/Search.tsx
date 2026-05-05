import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search as SearchIcon, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Basic title search (Firestore limitations: startAt/endAt or just fetch and filter)
      // For simplicity and better UX here, we'll fetch all and filter client-side for "like" matching
      // In a real large app, Algolia or similar would be used.
      const q = query(collection(db, 'novels'), where('status', '==', 'published'));
      const snap = await getDocs(q);
      const allNovels = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filtered = allNovels.filter((n: any) => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 lg:py-24">
      <div className="relative mb-12">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" />
        <input
          autoFocus
          type="text"
          placeholder="Search for novels, authors, or stories..."
          className="w-full h-20 pl-16 pr-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6"
          >
            {results.map((novel) => (
              <motion.div
                layout
                key={novel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 bg-zinc-900/40 border border-zinc-800 hover:border-purple-500/50 rounded-3xl transition-all duration-300"
              >
                <Link to={`/novels/${novel.id}`} className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-44 bg-zinc-800 rounded-2xl overflow-hidden shrink-0">
                    {novel.coverImage ? (
                      <img src={novel.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-zinc-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold urdu-text" dir="rtl">{novel.title}</h3>
                        <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest">{novel.category}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-full leading-none">
                        {novel.likesCount} Likes
                      </span>
                    </div>
                    <p className="text-zinc-400 urdu-text text-lg line-clamp-2" dir="rtl">
                      {novel.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                       <span className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full text-xs font-bold text-zinc-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                         Read Now <ArrowRight className="w-4 h-4" />
                       </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : searchTerm.trim().length > 2 && !loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-zinc-500">No novels found matching "{searchTerm}"</p>
          </motion.div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <SearchIcon className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-zinc-600 font-medium tracking-tight">Enter at least 3 characters to start searching...</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

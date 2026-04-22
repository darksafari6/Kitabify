import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export default function NovelList() {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    loadNovels();
  }, [categoryFilter]);

  const loadNovels = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'novels'), where('status', '==', 'published'));
      if (categoryFilter !== 'All') {
        q = query(collection(db, 'novels'), where('status', '==', 'published'), where('category', '==', categoryFilter));
      }
      
      const snapshot = await getDocs(q);
      setNovels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Romantic', 'Islamic', 'Horror', 'Mystery', 'Historical'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">The Library</h1>
        <p className="text-zinc-400">Discover your next favorite Urdu novel.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
              categoryFilter === cat 
              ? 'bg-zinc-100 text-zinc-950' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading novels...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {novels.map((novel, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={novel.id} 
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-48 bg-zinc-800 rounded-xl mb-4 overflow-hidden relative">
                {novel.coverImage ? (
                   <img src={novel.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={novel.title}/>
                ) : (
                   <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col justify-end p-6 border border-zinc-800/50">
                     <h3 className="font-bold text-2xl urdu-text text-white drop-shadow-md relative z-10" dir="rtl">{novel.title}</h3>
                   </div>
                )}
              </div>
              <div className="flex-1 flex flex-col px-1">
                {novel.coverImage && <h3 className="font-bold text-xl mb-2 urdu-text truncate" dir="rtl">{novel.title}</h3>}
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                   <span className="truncate max-w-[120px]">{novel.description?.slice(0,25) || "Novel"}...</span>
                   <span className="text-blue-400">{novel.category}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                   <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{novel.likesCount || 0}</span>
                   </div>
                   <Link 
                     to={`/novels/${novel.id}`}
                     className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-purple-400 transition-colors flex items-center gap-1"
                   >
                     Read <BookOpen className="w-3 h-3" />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {novels.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-2xl">
              No novels found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

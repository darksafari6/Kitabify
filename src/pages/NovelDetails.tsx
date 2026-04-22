import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Heart, BookmarkPlus, BookmarkCheck, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function NovelDetails() {
  const { id } = useParams<{id: string}>();
  const { user } = useAuth();
  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadNovel();
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkBookmark();
    }
  }, [user, id]);

  const loadNovel = async () => {
    try {
      const nDoc = await getDoc(doc(db, 'novels', id!));
      if (nDoc.exists()) {
        setNovel({ id: nDoc.id, ...nDoc.data() });
      }

      const cQuery = query(collection(db, 'chapters'), where('novelId', '==', id));
      const cSnap = await getDocs(cQuery);
      setChapters(cSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', user!.uid), where('novelId', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setIsBookmarked(true);
        setBookmarkId(snap.docs[0].id);
      }
    } catch(e) { console.error(e); }
  };

  const toggleBookmark = async () => {
    if (!user) return alert("Please sign in to bookmark.");
    try {
      if (isBookmarked && bookmarkId) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId));
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const d = await addDoc(collection(db, 'bookmarks'), {
          userId: user.uid,
          novelId: id,
          createdAt: serverTimestamp()
        });
        setIsBookmarked(true);
        setBookmarkId(d.id);
      }
    } catch(e) { console.error(e); }
  };

  if (loading) return <div>Loading...</div>;
  if (!novel) return <div>Novel not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 aspect-[2/3] bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center p-6 text-center overflow-hidden relative group">
           {novel.coverImage ? (
              <img src={novel.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={novel.title} />
           ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col items-center justify-center text-6xl">📖</div>
           )}
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <span className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              {novel.category}
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold urdu-text tracking-tight pb-2" dir="rtl">{novel.title}</h1>
          </div>
          
          <p className="text-zinc-400 leading-relaxed text-sm pb-6 border-b border-zinc-800">
            {novel.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            {chapters.length > 0 && (
              <Link 
                to={`/read/${id}/${chapters[0].id}`}
                className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Read Now
              </Link>
            )}
            
            <button 
              onClick={toggleBookmark}
              className={`bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4"/> : <BookmarkPlus className="w-4 h-4"/>}
              {isBookmarked ? 'Bookmarked' : 'Add to Bookmark'}
            </button>
            
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Table of Contents</h2>
          <span className="text-xs text-purple-500 font-bold uppercase tracking-widest">{chapters.length} Chapters</span>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl divide-y divide-zinc-800 overflow-hidden">
          {chapters.map((ch, idx) => (
             <Link 
               to={`/read/${id}/${ch.id}`} 
               key={ch.id}
               className="flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors group"
             >
                <div className="flex items-center gap-5">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold transition-colors">
                     {ch.order}
                   </div>
                   <span className="font-bold urdu-text text-lg" dir="rtl">{ch.title}</span>
                </div>
                <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-neon-blue)] transition-colors"/>
             </Link>
          ))}
          {chapters.length === 0 && (
             <div className="p-6 text-center text-gray-500">Chapters are being written...</div>
          )}
        </div>
      </div>
    </div>
  );
}

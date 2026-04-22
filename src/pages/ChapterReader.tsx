import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChapterReader() {
  const { novelId, chapterId } = useParams<{novelId: string, chapterId: string}>();
  const [novel, setNovel] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (novelId && chapterId) {
      loadReader();
    }
  }, [novelId, chapterId]);

  const loadReader = async () => {
    setLoading(true);
    try {
      const nDoc = await getDoc(doc(db, 'novels', novelId!));
      if (nDoc.exists()) setNovel({ id: nDoc.id, ...nDoc.data() });

      const cDoc = await getDoc(doc(db, 'chapters', chapterId!));
      if (cDoc.exists()) setChapter({ id: cDoc.id, ...cDoc.data() });

      const cQuery = query(collection(db, 'chapters'), where('novelId', '==', novelId));
      const cSnap = await getDocs(cQuery);
      setChapters(cSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading chapter...</div>;
  if (!chapter) return <div className="text-center py-20 text-gray-500">Chapter not found.</div>;

  const currentIndex = chapters.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Reader Header */}
      <div className="sticky top-[64px] z-40 bg-[#09090b]/90 backdrop-blur-sm border-b border-zinc-800 py-4 mb-8">
         <div className="flex justify-between items-center px-4">
            <Link to={`/novels/${novelId}`} className="text-zinc-400 hover:text-white flex items-center text-sm font-bold uppercase tracking-widest transition-colors">
              <List className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{novel?.title}</span>
            </Link>
            <div className="flex items-center gap-4">
              {prevChapter ? (
                <Link to={`/read/${novelId}/${prevChapter.id}`} className="text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full flex items-center transition-colors text-xs font-bold uppercase tracking-widest">
                   <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Link>
              ) : <div className="w-24" />}
              
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Ch. {chapter.order}</span>

              {nextChapter ? (
                <Link to={`/read/${novelId}/${nextChapter.id}`} className="text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full flex items-center transition-colors text-xs font-bold uppercase tracking-widest">
                   Next <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              ) : <div className="w-24" />}
            </div>
         </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={chapter.id}
        className="space-y-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold urdu-text text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" dir="rtl">
          {chapter.title}
        </h1>
        
        <div 
          className="urdu-text text-2xl sm:text-3xl leading-[2.5] sm:leading-[2.8] text-gray-200 whitespace-pre-wrap select-text px-4" 
          dir="rtl"
        >
          {chapter.content}
        </div>
      </motion.div>

      {/* Reader Footer Controls */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
         {prevChapter ? (
            <Link to={`/read/${novelId}/${prevChapter.id}`} className="w-full sm:w-auto flex-1 flex justify-center py-4 px-6 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all font-bold text-sm uppercase tracking-widest">
               <span className="flex items-center gap-2"><ChevronLeft className="w-5 h-5"/> Previous</span>
            </Link>
         ) : <div className="flex-1 hidden sm:block" />}
         
         {nextChapter ? (
            <Link to={`/read/${novelId}/${nextChapter.id}`} className="w-full sm:w-auto flex-1 flex justify-center py-4 px-6 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all font-bold text-sm uppercase tracking-widest">
               <span className="flex items-center gap-2">Next <ChevronRight className="w-5 h-5"/></span>
            </Link>
         ) : (
            <div className="w-full sm:w-auto flex-1 flex justify-center py-4 px-6 text-purple-400 font-bold text-sm uppercase tracking-widest bg-purple-500/10 rounded-full">
               To be continued...
            </div>
         )}
      </div>
    </div>
  );
}

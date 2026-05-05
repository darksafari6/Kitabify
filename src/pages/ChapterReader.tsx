import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Settings, 
  Search, 
  Type, 
  Moon, 
  Sun, 
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2,
  X,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Theme = 'dark' | 'light' | 'sepia';

export default function ChapterReader() {
  const { novelId, chapterId } = useParams<{novelId: string, chapterId: string}>();
  const [novel, setNovel] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reader Settings
  const [fontSize, setFontSize] = useState(22); // Start slightly smaller as requested
  const [theme, setTheme] = useState<Theme>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGoTo, setShowGoTo] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Page calculation
  const PAGE_SIZE = 3000; // chars per page
  const totalPages = Math.ceil((chapter?.content?.length || 0) / PAGE_SIZE) || 1;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedContent = useMemo(() => {
    if (!chapter?.content) return '';
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    let content = chapter.content.slice(start, end);
    
    // Search highlight in paginated view
    if (searchQuery) {
      const parts = content.split(new RegExp(`(${searchQuery})`, 'gi'));
      content = parts.map((part: string) => 
        part.toLowerCase() === searchQuery.toLowerCase() 
          ? `<mark class="bg-yellow-500/50 text-white rounded px-0.5">${part}</mark>` 
          : part
      ).join('');
    }
    return content;
  }, [chapter?.content, currentPage, searchQuery]);

  const handlePageJump = (p: number) => {
    const page = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (!chapter) return <div className="text-center py-20 text-gray-500">Chapter not found.</div>;

  const currentIndex = chapters.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const themes: Record<Theme, string> = {
    dark: 'bg-[#09090b] text-gray-200',
    light: 'bg-stone-50 text-zinc-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]'
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500", themes[theme])}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-zinc-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Tools Trigger */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="w-12 h-12 rounded-full bg-purple-600 text-white shadow-xl flex items-center justify-center hover:bg-purple-500 transition-colors"
        >
          {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6"
          >
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Type className="w-4 h-4" /> Text Size: {fontSize}px
              </label>
              <input 
                type="range" 
                min="16" 
                max="48" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Sun className="w-4 h-4" /> Reading Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'sepia', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "py-2 rounded-lg text-xs font-bold capitalize border transition-all",
                      theme === t 
                        ? "bg-purple-600 border-purple-500 text-white" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setShowSearch(!showSearch); setShowSettings(false); }}
                className="flex items-center justify-center gap-2 py-3 bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <Search className="w-4 h-4" /> Search
              </button>
              <button 
                onClick={() => { setShowGoTo(!showGoTo); setShowSettings(false); }}
                className="flex items-center justify-center gap-2 py-3 bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Chapters
              </button>
            </div>

            {totalPages > 1 && (
              <div className="pt-4 border-t border-zinc-800 space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Go to Page: {currentPage} / {totalPages}</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageJump(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <input 
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => handlePageJump(parseInt(e.target.value))}
                    className="flex-1 bg-zinc-800 border-none rounded-lg text-center font-bold"
                  />
                  <button 
                    onClick={() => handlePageJump(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 w-full z-[70] p-4 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800"
          >
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <Search className="w-5 h-5 text-zinc-500" />
              <input 
                autoFocus
                placeholder="Search in this chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white text-lg urdu-text"
                dir="rtl"
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-2 text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Go To Page / Chapter Overlay */}
      <AnimatePresence>
        {showGoTo && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Navigation</h3>
                <button onClick={() => setShowGoTo(false)} className="text-zinc-500 hover:text-white"><X/></button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {chapters.map((ch) => (
                  <Link
                    key={ch.id}
                    to={`/read/${novelId}/${ch.id}`}
                    onClick={() => setShowGoTo(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl transition-all group",
                      ch.id === chapterId ? "bg-purple-600/20 text-purple-400" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    )}
                  >
                    <span className="urdu-text text-lg">{ch.title}</span>
                    <span className="text-xs font-mono opacity-50"># {ch.order}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 flex justify-center items-center gap-4">
          <div className="h-px bg-zinc-800 flex-1 hidden sm:block" />
          <Link to={`/novels/${novelId}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-purple-400 transition-colors">
            <BookOpen className="w-4 h-4" />
            {novel?.title}
          </Link>
          <div className="h-px bg-zinc-800 flex-1 hidden sm:block" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={chapter.id}
          className="space-y-16"
        >
          <header className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-[0.2em]"
            >
              Chapter {chapter.order}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold urdu-text leading-tight bg-clip-text text-transparent bg-gradient-to-b from-current to-current/60" dir="rtl">
              {chapter.title}
            </h1>
          </header>
          
          <div 
            ref={contentRef}
            className="urdu-text transition-all duration-300" 
            dir="rtl"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: 2.2,
              letterSpacing: '0.01em'
            }}
            dangerouslySetInnerHTML={{ __html: paginatedContent }}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 py-8">
              <button 
                onClick={() => handlePageJump(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Page</p>
                <p className="text-xl font-bold font-mono tracking-tighter">{currentPage} <span className="opacity-30">/</span> {totalPages}</p>
              </div>
              <button 
                onClick={() => handlePageJump(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="pt-24 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-8">
            {prevChapter ? (
              <Link 
                to={`/read/${novelId}/${prevChapter.id}`}
                className="group flex flex-col items-end w-full sm:w-auto"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 group-hover:text-purple-400">Previous Chapter</span>
                <span className="urdu-text text-2xl group-hover:translate-x-[-8px] transition-transform flex items-center gap-3">
                  <ChevronRight className="w-6 h-6 text-purple-400" /> {prevChapter.title}
                </span>
              </Link>
            ) : <div className="hidden sm:block flex-1" />}

            <div className="w-12 h-px bg-zinc-800 sm:rotate-90" />

            {nextChapter ? (
              <Link 
                to={`/read/${novelId}/${nextChapter.id}`}
                className="group flex flex-col items-start w-full sm:w-auto"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 group-hover:text-purple-400">Next Chapter</span>
                <span className="urdu-text text-2xl group-hover:translate-x-[8px] transition-transform flex items-center gap-3">
                  {nextChapter.title} <ChevronLeft className="w-6 h-6 text-purple-400" />
                </span>
              </Link>
            ) : (
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-500 block mb-2">The End</span>
                <span className="urdu-text text-2xl opacity-50">To be continued...</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Footer Meta */}
      <footer className="pb-12 text-center opacity-30 select-none pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest">Shab-e-Firaq Reading Experience</p>
      </footer>
    </div>
  );
}

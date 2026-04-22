import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

export default function WriterNovelManager() {
  const { id } = useParams<{id: string}>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chContent, setChContent] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    loadManager();
  }, [user, id]);

  const loadManager = async () => {
    try {
      const nDoc = await getDoc(doc(db, 'novels', id!));
      if (!nDoc.exists() || nDoc.data().authorId !== user?.uid) {
        navigate('/writer');
        return;
      }
      setNovel({ id: nDoc.id, ...nDoc.data() });

      const cQuery = query(collection(db, 'chapters'), where('novelId', '==', id));
      const cSnap = await getDocs(cQuery);
      setChapters(cSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'chapters'), {
        novelId: id,
        title: chTitle,
        content: chContent,
        order: chapters.length + 1,
        createdAt: serverTimestamp()
      });
      setIsAddingChapter(false);
      setChTitle('');
      setChContent('');
      loadManager();
    } catch(e) {
      console.error(e);
      alert('Error adding chapter');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight pb-2 urdu-text" dir="rtl">{novel?.title}</h1>
          <p className="text-zinc-400 mt-2 line-clamp-2">{novel?.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold">Chapters</h2>
        <button onClick={()=>setIsAddingChapter(!isAddingChapter)} className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 font-bold text-xs uppercase tracking-widest rounded-full transition-colors">
          Add Chapter
        </button>
      </div>

      {isAddingChapter && (
        <form onSubmit={handleAddChapter} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Chapter Title</label>
            <input required value={chTitle} onChange={e=>setChTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:ring-1 focus:ring-purple-500 rounded-full px-5 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Content (Urdu)</label>
            <textarea required value={chContent} onChange={e=>setChContent(e.target.value)} 
              dir="rtl"
              className="urdu-text w-full bg-zinc-950 border border-zinc-800 focus:ring-1 focus:ring-purple-500 rounded-3xl px-5 py-4 text-white h-64 outline-none resize-none" />
          </div>
          <div className="flex gap-4 pt-2">
             <button type="submit" className="bg-purple-600 text-white px-8 py-3 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-purple-700 transition-colors">Save Chapter</button>
             <button type="button" onClick={() => setIsAddingChapter(false)} className="text-zinc-500 px-8 py-3 font-bold text-xs uppercase tracking-widest rounded-full hover:text-white transition-colors border border-transparent hover:border-zinc-800">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {chapters.map((ch, idx) => (
          <div key={ch.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                {ch.order}
              </div>
              <h3 className="font-bold urdu-text text-lg" dir="rtl">{ch.title}</h3>
            </div>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold hidden sm:block">
               {ch.createdAt ? new Date(ch.createdAt.toDate()).toLocaleDateString() : 'Just now'}
            </span>
          </div>
        ))}
        {chapters.length === 0 && !isAddingChapter && (
          <div className="text-center text-zinc-500 font-bold uppercase tracking-widest py-12 border border-dashed border-zinc-800 rounded-3xl">No chapters yet.</div>
        )}
      </div>
    </div>
  );
}

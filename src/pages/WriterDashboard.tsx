import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Settings, BookOpen } from 'lucide-react';

export default function WriterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Romantic');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadMyNovels();
  }, [user, navigate]);

  const loadMyNovels = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'novels'), where('authorId', '==', user.uid));
      const snapshot = await getDocs(q);
      setNovels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'novels'), {
        title,
        authorId: user.uid,
        category,
        description,
        status: 'draft',
        createdAt: serverTimestamp(),
        likesCount: 0 // Initialize at 0
      });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      loadMyNovels();
    } catch(err) {
      console.error(err);
      alert("Failed to create novel.");
    }
  };

  const publishNovel = async (id: string) => {
    try {
      await updateDoc(doc(db, 'novels', id), {
        status: 'published',
        updatedAt: serverTimestamp()
      });
      loadMyNovels();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Writer Dashboard</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 flex items-center gap-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> New Novel
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateDraft} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold mb-4">Create New Draft</h2>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Title</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:ring-1 focus:ring-purple-500 rounded-full px-5 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:ring-1 focus:ring-purple-500 rounded-full px-5 py-3 text-white outline-none">
              {['Romantic', 'Islamic', 'Horror', 'Mystery', 'Historical'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description (Synopsis)</label>
            <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:ring-1 focus:ring-purple-500 rounded-3xl px-5 py-4 text-white h-32 outline-none resize-none" />
          </div>
          <div className="flex gap-4 pt-2">
             <button type="submit" className="bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors">Save Draft</button>
             <button type="button" onClick={() => setIsCreating(false)} className="text-zinc-500 px-8 py-3 font-bold text-xs uppercase tracking-widest rounded-full hover:text-white transition-colors border border-transparent hover:border-zinc-800">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {novels.map(novel => (
          <div key={novel.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4 hover:border-purple-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl urdu-text truncate pb-1" dir="rtl">{novel.title}</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-800 px-2.5 py-1 rounded text-blue-400">{novel.category}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded ${novel.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                {novel.status}
              </span>
            </div>
            
            <p className="text-sm text-zinc-400 line-clamp-3">{novel.description}</p>
            
            <div className="pt-6 flex gap-3 border-t border-zinc-800/50">
              <Link to={`/writer/novel/${novel.id}`} className="flex-1 flex justify-center items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-full transition-colors">
                <Settings className="w-4 h-4"/> Manage
              </Link>
              {novel.status === 'draft' && (
                <button onClick={() => publishNovel(novel.id)} className="flex-1 text-xs font-bold uppercase tracking-widest bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors py-3 rounded-full border border-purple-600/20 hover:border-transparent">
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

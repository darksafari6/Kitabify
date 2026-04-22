import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadBookmarks();
  }, [user, navigate]);

  const loadBookmarks = async () => {
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', user!.uid));
      const snapshot = await getDocs(q);
      
      const bks: any[] = [];
      for (const docSnap of snapshot.docs) {
        const bkData = docSnap.data();
        const novelDoc = await getDoc(doc(db, 'novels', bkData.novelId));
        if (novelDoc.exists()) {
           bks.push({ id: docSnap.id, novelId: novelDoc.id, ...novelDoc.data() });
        }
      }
      setBookmarks(bks);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-zinc-400 mt-2 text-sm">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors font-medium text-sm">Log out</button>
       </div>

       <div>
          <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
            Bookmarked Novels
            <span className="text-xs text-purple-500 font-bold uppercase tracking-widest">{bookmarks.length} Active</span>
          </h2>
          {bookmarks.length === 0 ? (
             <div className="text-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12 space-y-4">
                <BookOpen className="w-12 h-12 text-zinc-500 mx-auto" />
                <p className="text-zinc-400">You haven't bookmarked any novels yet.</p>
                <Link to="/novels" className="inline-block mt-4 text-purple-400 font-bold hover:underline">Explore the Library</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map((novel) => (
                <Link 
                  to={`/novels/${novel.novelId}`}
                  key={novel.id} 
                  className="group flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all p-4"
                >
                  <div className="h-40 bg-zinc-800 rounded-xl overflow-hidden relative mb-4">
                    {novel.coverImage ? (
                       <img src={novel.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={novel.title}/>
                    ) : (
                       <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col justify-end p-4 border border-zinc-800/50">
                         <h3 className="font-bold text-xl urdu-text text-white drop-shadow-md relative z-10" dir="rtl">{novel.title}</h3>
                       </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {novel.coverImage && <h3 className="font-bold text-lg urdu-text truncate pb-2" dir="rtl">{novel.title}</h3>}
                  </div>
                </Link>
              ))}
            </div>
          )}
       </div>
    </div>
  );
}

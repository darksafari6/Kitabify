import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { WAFA_CHAPTERS, TANHAI_CHAPTERS } from '../lib/storyData';

export default function Bootstrap() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email !== 'darksafari6@gmail.com') return;

    const checkAndSeed = async () => {
      try {
        // Handle Tanhai ka Safar
        const q2 = query(collection(db, 'novels'), where('title', '==', 'Tanhai ka Safar'));
        const snap2 = await getDocs(q2);
        let tanhaiId = '';

        if (snap2.empty) {
          console.log('Seeding second sad novel...');
          const novelRef = await addDoc(collection(db, 'novels'), {
            title: 'Tanhai ka Safar',
            authorId: 'shab-e-firaq-original',
            category: 'Tragedy',
            description: 'ایک ایسی کہانی جو تنہائی اور اداسی کے گہرے رنگوں میں ڈوبی ہوئی ہے۔ یہ سفر ہے ان خوابوں کا جو کبھی شرمندہ تعبیر نہ ہو سکے اور ان یادوں کا جو سینے میں سلگتی رہیں۔ درد و محبت کی ایک لازوال داستان۔',
            status: 'published',
            likesCount: 312,
            createdAt: serverTimestamp(),
          });
          tanhaiId = novelRef.id;
        } else {
          tanhaiId = snap2.docs[0].id;
        }

        // Seed missing chapters for Tanhai ka Safar
        const chSnap2 = await getDocs(query(collection(db, 'chapters'), where('novelId', '==', tanhaiId)));
        const existingOrders2 = chSnap2.docs.map(d => d.data().order);
        
        for (const ch of TANHAI_CHAPTERS) {
          if (!existingOrders2.includes(ch.order)) {
            console.log(`Seeding Tanhai Ch ${ch.order}...`);
            await addDoc(collection(db, 'chapters'), {
              ...ch,
              novelId: tanhaiId,
              createdAt: serverTimestamp()
            });
          }
        }

        // Handle Wafa ki Aakhri Lakeer
        const q = query(collection(db, 'novels'), where('title', '==', 'Wafa ki Aakhri Lakeer'));
        const snap = await getDocs(q);
        let wafaId = '';
        
        if (snap.empty) {
          console.log('Admin detected. Seeding featured novel...');
          const novelRef = await addDoc(collection(db, 'novels'), {
            title: 'Wafa ki Aakhri Lakeer',
            authorId: 'shab-e-firaq-original',
            category: 'Romance',
            description: 'ایک ایسی داستانِ محبت جو وقت کی حدود سے پرے، روح کی گہرائیوں میں لکھی گئی۔ یہ کہانی ہے ان خاموش جذبوں کی جو کبھی بیان نہ ہو سکے، مگر ان کی تپش نے دو زندگیوں کو ہمیشہ کے لیے بدل دیا۔',
            status: 'published',
            likesCount: 524,
            createdAt: serverTimestamp(),
          });
          wafaId = novelRef.id;
        } else {
          wafaId = snap.docs[0].id;
        }

        // Seed missing chapters for Wafa ki Aakhri Lakeer
        const chSnap = await getDocs(query(collection(db, 'chapters'), where('novelId', '==', wafaId)));
        const existingOrders = chSnap.docs.map(d => d.data().order);
        
        for (const ch of WAFA_CHAPTERS) {
          if (!existingOrders.includes(ch.order)) {
            console.log(`Seeding Wafa Ch ${ch.order}...`);
            await addDoc(collection(db, 'chapters'), {
              ...ch,
              novelId: wafaId,
              createdAt: serverTimestamp()
            });
          }
        }

        console.log('Seeding process checked.');
      } catch (err) {
        console.error('Bootstrap error:', err);
      }
    };
    checkAndSeed();
  }, [user]);

  return null;
}

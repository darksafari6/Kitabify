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
            category: 'Romantic',
            description: 'ایک ایسی داستانِ محبت جو وقت کی حدود سے پرے، روح کی گہرائیوں میں لکھی گئی۔ یہ کہانی ہے ان خاموش جذبوں کی جو کبھی بیان نہ ہو سکے، مگر ان کی تپش نے دو زندگیوں کو ہمیشہ کے لیے بدل دیا۔ محبت، ہجر، وصال اور قربانی کے انوکھے رنگوں سے سجی ایک شاہکار تحریر۔',
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
�وم رہے ہیں۔ اس کی دھڑکنیں ایک انوکھے تال پر رقص کرنے لگی تھیں، جیسے کسی بھولی بسری دعا کا پہلا بول مل گیا ہو ۔ محبت کا یہ سحر ابدی تھا۔`,
              order: 1
            },
            {
              title: 'ہجر کی دہلیز پر',
              content: `وقت نے کروٹ بدلی اور وہ لمحے مٹھی سے ریت کی طرح پھسل گئے۔ جس سے ابدی تعلق کی امید تھی، وہی آج اجنبی بن چکا تھا۔ ہجر کی وہ راتیں جب تارے بھی گواہ تھے کہ کس طرح آنکھوں نے نیند سے ناطہ توڑ لیا تھا۔
              
"جدائی موت نہیں ہوتی، مگر یہ جینے کا سلیقہ چھین لیتی ہے،" اس نے اپنی ڈائری کے خالی صفحات پر لکھا۔ قلم کانپ رہا تھا اور کاغذ پر گرے آنسوؤں کے نشان اس کی سچی محبت کا ثبوت تھے۔
              
محبت میں سب سے مشکل کام انتظار ہوتا ہے۔ وہ انتظار جو شاید کبھی ختم نہ ہو، مگر دل ہے کہ مانتا ہی نہیں۔ وہ ہر آہٹ پر دروازے کی طرف دیکھتی، یہ جانتے ہوئے بھی کہ آنے والا کوئی نہیں۔ تنہائی کا زہر اب اس کی رگوں میں اتر چکا تھا، مگر امید کی ایک رمق اب بھی باقی تھی جو اسے زندہ رکھے ہوئے تھی۔`,
              order: 2
            },
            {
              title: 'وصالِ یار: ابدی مسرت',
              content: `برسوں بعد جب پھر سے بہار آئی، تو فضاؤں میں وہی پرانی خوشبو رچی ہوئی تھی۔ وہ منظر جو کبھی ادھورا رہ گیا تھا، آج مکمل ہو رہا تھا۔
              
سامنے وہ کھڑا تھا، وہی مسکراہٹ، وہی انداز، لیکن آنکھوں میں اب وہ گہرائی تھی جو صرف دکھوں کی بھٹی سے گزرنے کے بعد حاصل ہوتی ہے۔
              
"میں نے کہا تھا نہ، جہاں رشتہ سچا ہو، وہاں فاصلے کبھی جیت نہیں سکتے،" اس نے اس کا ہاتھ تھامتے ہوئے کہا۔ اس پل ساری دنیا تھم گئی تھی۔ تپتی دھوپ میں ٹھنڈی چھاؤں کا وہ احساس، وہ وصال جس کی تمنا اس نے ہر دعا میں کی تھی۔ ان کے دلوں کی خاموشی اب ہزاروں لفظوں سے بڑھ کر تھی، یہ ایک نئے جنم کی نوید تھی، ایک ایسا رشتہ جو زمان و مکان کی قید سے آزاد ہو چکا تھا۔ یہ وفا کی وہ آخری لکیر تھی جسے اب کوئی نہیں مٹا سکتا تھا۔`,
              order: 3
            }
          ];

          for (const ch of chapters) {
            await addDoc(collection(db, 'chapters'), {
              ...ch,
              novelId: novelRef.id,
              createdAt: serverTimestamp()
            });
          }
          console.log('Seeding finished.');
        }
      } catch (err) {
        console.error('Bootstrap error:', err);
      }
    };
    checkAndSeed();
  }, [user]);

  return null;
}

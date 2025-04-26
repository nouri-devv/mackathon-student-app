'use client';
import { useStudent } from '@/hooks/useStudent';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function CreditPoints() {
  const { student } = useStudent();
  const [points, setPoints] = useState(0);
  
  useEffect(() => {
    const fetchAndEnsurePoints = async () => {
      if (!student?.id) return;
      
      const docRef = doc(db, 'studentUsers', student.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { creditPoints: 0 }, { merge: true });
        setPoints(0);
      } else {
        const data = docSnap.data();
        setPoints(parseInt(data.creditPoints) || 0);
      }
    };
    
    fetchAndEnsurePoints();
  }, [student?.id]);
  
  return points;
}
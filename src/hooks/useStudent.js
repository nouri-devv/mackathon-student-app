'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useStudent(requireAuth = true) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const studentData = localStorage.getItem('studentUser');
    
    if (studentData) {
      setStudent(JSON.parse(studentData));
      setLoading(false);
    } else if (requireAuth) {
      router.push('/signup');
    } else {
      setLoading(false);
    }
  }, [requireAuth, router]);

  const logout = () => {
    localStorage.removeItem('studentUser');
    setStudent(null);
    router.push('/signup');
  };

  return { student, loading, logout };
}
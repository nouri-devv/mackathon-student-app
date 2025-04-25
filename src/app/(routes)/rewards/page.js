'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '../../../hooks/useStudent';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../../lib/firebase';
import { StarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';

export default function Rewards() {
  const router = useRouter();
  const { student, loading } = useStudent();
  const [events, eventsLoading] = useCollection(
    collection(db, "events"),
    {}
  );

  // Calculate total points and build event history with useMemo
  const { total, history, availableRewards } = useMemo(() => {
    if (!events?.docs || !student) return { total: 0, history: [], availableRewards: [] };
    
    const history = events.docs
      .filter(doc => doc.data().attendees?.includes(student.id))
      .map(doc => {
        const event = doc.data();
        return {
          event: event.title,
          points: event.creditPoints || 0,
          date: new Date(event.date?.seconds * 1000),
          formattedDate: new Date(event.date?.seconds * 1000).toLocaleDateString()
        };
      })
      // Sort by date (most recent first)
      .sort((a, b) => b.date - a.date);

    const total = history.reduce((sum, event) => sum + event.points, 0);
    
    // Sample rewards data - this would typically come from Firestore
    const availableRewards = [
      {
        id: 'reward1',
        title: '$5 GYG Voucher',
        location: 'Sponsored by Guzman y Gomez',
        pointsCost: 50
      },
      {
        id: 'reward2',
        title: 'Free Regular Coffee',
        location: 'University Cafe',
        pointsCost: 25
      },
      {
        id: 'reward3',
        title: '$10 Uber Eats Voucher',
        location: 'Sponsored by Student Union',
        pointsCost: 75
      },
      {
        id: 'reward4',
        title: 'Free Movie Ticket',
        location: 'Campus Cinema',
        pointsCost: 100
      },
      {
        id: 'reward5',
        title: '50% Off Course Textbook',
        location: 'University Bookstore',
        pointsCost: 200
      },
      {
        id: 'reward6',
        title: 'Printing Credit (100 pages)',
        location: 'University Library',
        pointsCost: 40
      }
    ];
    
    return { total, history, availableRewards };
  }, [events, student]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !student) {
      router.push('/login');
    }
  }, [loading, student, router]);

  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </Link>
          </div>

          {/* Total Points Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Total Points Earned</h2>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{total} Points</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Available Rewards Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Rewards</h2>
            <div className="space-y-4">
              {availableRewards.length > 0 ? (
                availableRewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{reward.title}</h3>
                      <p className="text-sm text-gray-500">{reward.location}</p>
                    </div>
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{reward.pointsCost} Points</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No rewards available yet</p>
              )}
            </div>
          </div>

          {/* Event History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Event History</h2>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((event, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{event.event}</h3>
                      <p className="text-sm text-gray-500">{event.formattedDate}</p>
                    </div>
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-sm font-medium">{event.points} Points</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No events attended yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
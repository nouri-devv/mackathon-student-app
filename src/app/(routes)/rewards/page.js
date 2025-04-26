'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '../../../hooks/useStudent';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../../lib/firebase';
import { StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import CreditPoints from '@/components/CreditPoint';

export default function Rewards() {
  const router = useRouter();
  const { student, loading } = useStudent();
  const [events, eventsLoading] = useCollection(
    collection(db, "events"),
    {}
  );

  // Build event history
  const getEventHistory = () => {
    if (!events?.docs || !student) return [];
    return events.docs
      .filter(doc => doc.data().attendees?.includes(student.id))
      .map(doc => {
        const event = doc.data();
        return {
          event: event.title,
          points: event.creditPoints || 0,
          date: new Date(event.date?.seconds * 1000).toLocaleDateString()
        };
      });
  };

  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const history = getEventHistory();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
          </div>
          
          {/* Total Points Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Total Points Earned</h2>
                <div className="text-3xl font-bold text-indigo-600 mt-2">
                  <CreditPoints />
                </div>
              </div>
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
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <StarIcon className="h-4 w-4 mr-1" />
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
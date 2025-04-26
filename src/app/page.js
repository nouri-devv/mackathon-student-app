'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '../hooks/useStudent';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../lib/firebase';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import { StarIcon, Bars3Icon as MenuIcon } from '@heroicons/react/24/outline';
import CreditPoints from '@/components/CreditPoint';

export default function Home() {
  const router = useRouter();
  const { student, loading } = useStudent(false);
  const [events, eventsLoading] = useCollection(
    collection(db, "events"),
    {}
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Calculate total points from registered events
  const calculateTotalPoints = () => {
    if (!events?.docs) return 0;
    
    return events.docs.reduce((total, doc) => {
      const event = doc.data();
      if (event.attendees?.includes(student?.id)) {
        return total + (event.creditPoints || 0);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    if (!loading && !student) {
      router.push('/signup');
    }
  }, [student, loading, router]);

  if (loading || !student || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 fixed top-4 left-4 z-20 rounded-md bg-white shadow-sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-10 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setIsSidebarOpen(false)} />
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {student?.firstName}!
            </h1>
            <div className="flex items-center bg-indigo-50 px-4 py-2 rounded-full">
              <StarIcon className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-600 font-medium">
                {<CreditPoints />} Total Points
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Total Events Attended</h3>
              <p className="text-2xl font-bold text-gray-900">
                {events?.docs.filter(doc => doc.data().attendees?.includes(student?.id)).length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Available Credits</h3>
              <p className="text-2xl font-bold text-indigo-600"><CreditPoints /></p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Rewards Redeemed</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events?.docs.slice(0, 3).map((doc) => {
                const event = doc.data();
                return (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/events/${doc.id}`)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{event.creditPoints || 0} Points</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link 
              href="/events"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
            >
              View all events
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events?.docs
                .filter(doc => !doc.data().attendees?.includes(student?.id))
                .slice(0, 2)
                .map((doc) => {
                  const event = doc.data();
                  return (
                    <div 
                      key={doc.id}
                      className="border rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer"
                      onClick={() => router.push(`/events/${doc.id}`)}
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-indigo-600">
                        <StarIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{event.creditPoints || 0} Points</span>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Browse Events</h3>
              <p className="text-indigo-100 mb-4">Discover upcoming events and earn credits</p>
              <Link href="/events" className="text-sm text-white hover:underline">
                View All Events →
              </Link>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-purple-100 mb-4">Use your credits to claim exciting rewards</p>
              <Link href="/rewards" className="text-sm text-white hover:underline">
                View Rewards →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
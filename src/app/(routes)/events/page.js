'use client';

import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/navigation';
import { CalendarIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { useStudent } from '../../../hooks/useStudent';
import Sidebar from '../../../components/Sidebar';

// Add formatDate helper function
const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function Events() {
  const { student, logout } = useStudent();
  const router = useRouter();
  const [events, eventsLoading, eventsError] = useCollection(
    collection(db, "events"),
    {}
  );

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600">Welcome, {student?.firstName}</p>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events?.docs.map((doc) => {
              const event = doc.data();
              return (
                <div 
                  key={doc.id} 
                  className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/events/${doc.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{event.creditPoints || 0} Points</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.tags && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
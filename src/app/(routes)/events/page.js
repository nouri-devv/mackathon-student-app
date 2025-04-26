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
  const { student } = useStudent();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, eventsLoading, eventsError] = useCollection(
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
  
  const history = getEventHistory();
  
  // Get upcoming events (not in history)
  const getUpcomingEvents = () => {
    if (!events?.docs || !student) return [];
    const attendedEventIds = history.map(h => h.id);
    const now = new Date();
    
    return events.docs
      .filter(doc => {
        const eventDate = doc.data().date?.seconds ? new Date(doc.data().date.seconds * 1000) : null;
        return eventDate && eventDate >= now && !attendedEventIds.includes(doc.id);
      })
      .map(doc => doc);
  };
  
  const upcomingEvents = getUpcomingEvents();

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600">Welcome, {student?.firstName}</p>
            </div>
            
            {/* Simple Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-1 border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    activeTab === 'upcoming' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    activeTab === 'history' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Event History
                </button>
              </div>
            </div>
          </div>
          
          {/* Conditional Content Based on Tab */}
          {activeTab === 'upcoming' ? (
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
          ) : (
            /* Event History */
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
          )}
        </div>
      </div>
    </div>
  );
}
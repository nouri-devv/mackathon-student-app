'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { CalendarIcon, MapPinIcon, ArrowLeftIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useStudent } from '../../../../hooks/useStudent';
import Sidebar from '../../../../components/Sidebar';

export default function EventPage({ params }) {
  const { student } = useStudent();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', resolvedParams.id));
        if (eventDoc.exists()) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() };
          setEvent(eventData);
          setIsRegistered(eventData.attendees?.includes(student?.id) || false);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchEvent();
    }
  }, [resolvedParams.id, student]);

  const handleRegistration = async () => {
    if (!student) return;
    setRegistering(true);

    try {
      const eventRef = doc(db, 'events', resolvedParams.id);
      
      if (isRegistered) {
        await updateDoc(eventRef, {
          attendees: arrayRemove(student.id)
        });
        setIsRegistered(false);
      } else {
        await updateDoc(eventRef, {
          attendees: arrayUnion(student.id)
        });
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error updating registration:', error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700">Event not found</h2>
      <Link href="/events" className="mt-4 text-indigo-600 hover:text-indigo-800">
        Return to events
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <Link 
            href="/events" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                    <StarIcon className="h-5 w-5 text-white mr-2" />
                    <span className="text-white font-medium">
                      {event.creditPoints || 0} Credit Points
                    </span>
                  </div>
                  {event.attendees && (
                    <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                      <UserGroupIcon className="h-5 w-5 text-white mr-2" />
                      <span className="text-white font-medium">
                        {event.attendees.length} Registered
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="text-gray-900">
                      {new Date(event.date?.seconds * 1000).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t pt-8">
                <button
                  onClick={handleRegistration}
                  disabled={registering}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isRegistered 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {registering 
                    ? 'Processing...' 
                    : isRegistered 
                      ? 'Cancel Registration' 
                      : 'Register for Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
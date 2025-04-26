'use client';
import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/navigation';
import { GiftIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useStudent } from '../../../hooks/useStudent';
import Sidebar from '../../../components/Sidebar';
import CreditPoints from '@/components/CreditPoint';

export default function Rewards() {
  const { student } = useStudent();
  const router = useRouter();
  const [rewards, rewardsLoading, rewardsError] = useCollection(
    collection(db, "rewards"),
    {}
  );

  if (rewardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (rewardsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading rewards.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Credit Points</h2>
            <div className="text-indigo-600 text-2xl font-bold">
              <CurrencyDollarIcon className="h-6 w-6 inline-block mr-1 align-middle" />
              <CreditPoints />
            </div>
            <p className="text-gray-600 text-sm mt-1">Redeem your points for exciting rewards!</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Rewards</h1>
              <p className="text-gray-600">Browse the rewards you can redeem with your credit points</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rewards?.docs.map((doc) => {
              const reward = doc.data();
              return (
                <div
                  key={doc.id}
                  className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/rewards/${doc.id}`)}
                >
                  {reward.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=Reward+Image";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold">{reward.title}</h2>
                      <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{reward.creditCost || 0} Credits</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{reward.description}</p>
                    <div className="space-y-2 mb-4">
                      {reward.category && (
                        <div className="flex items-center text-gray-500">
                          <TagIcon className="h-5 w-5 mr-2" />
                          <span className="capitalize">{reward.category}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <GiftIcon className="h-5 w-5 mr-2" />
                        <span>{reward.quantity} Available</span>
                      </div>
                    </div>
                    {reward.tags && reward.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reward.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {reward.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{reward.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {rewards?.docs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <GiftIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No rewards available yet</h3>
              <p className="text-gray-500">Stay tuned for new exciting rewards!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
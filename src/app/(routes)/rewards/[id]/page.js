'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import updateDoc
import { GiftIcon, TagIcon, CurrencyDollarIcon, CalendarIcon, ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudent } from '../../../../hooks/useStudent';
import Sidebar from '../../../../components/Sidebar';
import { useParams } from 'next/navigation';

export default function RewardPage() {
  const { student } = useStudent();
  const router = useRouter();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redemptions, setRedemptions] = useState([]);
  const params = useParams();
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const rewardDoc = await getDoc(doc(db, 'rewards', params.id));
        if (rewardDoc.exists()) {
          const rewardData = { id: rewardDoc.id, ...rewardDoc.data() };
          setReward(rewardData);

          if (rewardData.redeemedBy && rewardData.redeemedBy.length > 0) {
            await fetchRedemptionDetails(rewardData.redeemedBy);
          }
        }
      } catch (error) {
        console.error('Error fetching reward:', error);
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchReward();
    }
  }, [params.id, student]);

  const fetchRedemptionDetails = async (userIds) => {
    try {
      const redemptionData = [];
      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'studentUsers', userId));
        if (userDoc.exists()) {
          redemptionData.push({
            id: userDoc.id,
            ...userDoc.data(),
            redeemed: true
          });
        }
      }
      setRedemptions(redemptionData);
    } catch (error) {
      console.error('Error fetching redemption details:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'No expiry date';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRedeem = async () => {
    if (!student) return;
    setIsRedeeming(true);
    // Implement your redemption logic here
    try {
      console.log('Redeem button clicked for reward:', reward.id);
      const rewardRef = doc(db, 'rewards', reward.id);
      await updateDoc(rewardRef, { // Ensure updateDoc is imported
        redeemedBy: arrayUnion(student.id)
      });
      setReward(prevReward => ({
        ...prevReward,
        redeemedBy: [...(prevReward?.redeemedBy || []), student.id]
      }));
      alert('Reward redeemed successfully! (Simulated)');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward.');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!reward) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700">Reward not found</h2>
      <Link href="/rewards" className="mt-4 text-indigo-600 hover:text-indigo-800">
        Return to rewards
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <Link
            href="/rewards"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Rewards
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {reward.imageUrl && (
              <img
                src={reward.imageUrl}
                alt={reward.title}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{reward.title}</h1>
              <p className="text-gray-700 mb-4">{reward.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  <span>Cost: {reward.creditCost} credits</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <GiftIcon className="h-5 w-5 mr-2" />
                  <span>Available: {reward.quantity}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Expires: {formatDate(reward.expiryDate)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <TagIcon className="h-5 w-5 mr-2" />
                  <span>Category: {reward.category}</span>
                </div>
              </div>

              {reward.tags?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {reward.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t pt-8">
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming || reward.quantity <= 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    reward.quantity <= 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isRedeeming
                        ? 'bg-indigo-300 text-white cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isRedeeming
                    ? 'Redeeming...'
                    : reward.quantity <= 0
                      ? 'Out of Stock'
                      : 'Redeem Now'}
                </button>
              </div>
            </div>
          </div>

          {redemptions.length > 0 && (
            <div className="bg-white rounded-xl shadow mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Redeemed By</h3>
              <ul className="space-y-2">
                {redemptions.map((student) => (
                  <li key={student.id} className="flex items-center space-x-3">
                    <UserCircleIcon className="h-6 w-6 text-gray-500" />
                    <span>{student.name || 'Unknown Student'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client'

import TimeDisplay from '@/components/TimeDisplay';
import HomeComponent from '@/components/home';
import Rewards from '@/components/rewards';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main>
        <TimeDisplay />
        <HomeComponent />
        <Rewards />
      </main>
    </div>
  );
}
import Link from 'next/link';
import { CalendarIcon, StarIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Portal</h2>
      </div>
      <nav className="mt-2">
        <Link 
          href="/"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          Home
        </Link>
        <Link 
          href="/events"  // This should work as Next.js handles route groups
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <CalendarIcon className="h-5 w-5 mr-3" />
          Events
        </Link>
        <Link 
          href="/profile"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <UserIcon className="h-5 w-5 mr-3" />
          Profile
        </Link>
        <Link 
          href="/rewards"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <StarIcon className="h-5 w-5 mr-3" />
          Rewards
        </Link>
      </nav>
    </div>
  );
}
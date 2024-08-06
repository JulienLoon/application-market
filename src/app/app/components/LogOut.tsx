// app/components/LogOut.tsx

import React from 'react';
import { useRouter } from 'next/navigation';

const LogOut: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <button
      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogOut;

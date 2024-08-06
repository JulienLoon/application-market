// /app/components/Sidebar.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTachometerAlt, faPlus, faCog, faUsers, faBox } from '@fortawesome/free-solid-svg-icons';
import { useMetadata } from '../context/MetadataContext';
import LogOut from './LogOut'; // Importeer het LogOut component

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ username: string | null, first_name: string | null, last_name: string | null } | null>(null);
  const { author, version } = useMetadata();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:3002/api/auth/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo({
          username: response.data.username,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserData();
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 6) return 'Good Night';
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    if (hours < 22) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="fixed top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {userInfo ? `${getGreeting()},` : 'Loading...'}
        </h1>
        {userInfo && (
          <p className="text-xl font-semibold mt-2">
            {userInfo.first_name} {userInfo.last_name}
          </p>
        )}
      </div>
      <nav className="mt-4 flex-grow">
        <ul>
          <li className="py-3 px-5 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => router.push('/backend/')}>
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" fixedWidth />
            <span>Dashboard</span>
          </li>
          <li className="py-3 px-5 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => router.push('/backend/create-app')}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" fixedWidth />
            <span>Create App</span>
          </li>
          <li className="py-3 px-5 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => router.push('/backend/manage-apps')}>
            <FontAwesomeIcon icon={faBox} className="mr-2" fixedWidth />
            <span>Manage Apps</span>
          </li>
          <li className="py-3 px-5 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => router.push('/backend/manage-users')}>
            <FontAwesomeIcon icon={faUsers} className="mr-2" fixedWidth />
            <span>Manage Users</span>
          </li>
          <li className="py-3 px-5 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => router.push('/backend/settings')}>
            <FontAwesomeIcon icon={faCog} className="mr-2" fixedWidth />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
      <div className="flex items-center cursor-pointer mt-auto p-4 border-t hover:bg-gray-700 border-gray-700" onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" fixedWidth />
        <span>Back to Frontend</span>
      </div>
      <div className="mt-auto p-4 border-t border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Profile</h2>
        {userInfo && (
          <>
            <p className="text-sm mb-2">Username: {userInfo.username}</p>
            <p className="text-sm mb-4">Name: {userInfo.first_name} {userInfo.last_name}</p>
          </>
        )}
        <LogOut /> {/* Gebruik het LogOut component */}
      </div>
      <div className="mt-auto p-4 border-t border-gray-700 flex justify-between">
        <span className="text-sm text-gray-400">© {author}</span>
        <span className="text-sm text-gray-400">v {version}</span>
      </div>
    </div>
  );
};

export default Sidebar;

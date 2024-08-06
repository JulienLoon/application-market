// /app/backend/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getAppsBackend, getRegisteredUsersCount, getAppsCount } from '../../services/api';
import Notification from '../../components/Notification';
import RequireAuth from '../../components/RequireAuth'; // Importeer het RequireAuth component

interface App {
    id: number;
    name: string;
    description: string;
    download_url: string;
    image_url: string;
    created_at: string;
    created_by: number; 
    created_by_username: string;
}

const Dashboard: React.FC = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [appsCount, setAppsCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appsData = await getAppsBackend();
                setApps(appsData);

                const usersCountData = await getRegisteredUsersCount();
                setUsersCount(usersCountData);

                const appsCountData = await getAppsCount();
                setAppsCount(appsCountData);
            } catch (err) {
                setError('Error fetching data');
                setNotification('Error fetching data');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const latestApps = apps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

    return (
        <RequireAuth>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>
                {notification && (
                    <Notification
                        message={notification}
                        type="error"
                        onClose={() => {
                            setNotification(null);
                            setError(null); // Reset error when notification is closed
                        }}
                    />
                )}
                {!notification && error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Registered Users</h2>
                        <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{usersCount}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Windows Apps</h2>
                        <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{appsCount}</p>
                    </div>
                </div>
                <div className="mt-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Latest Windows Apps</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <ul>
                            {latestApps.map((app) => (
                                <li key={app.id} className="border-b py-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{app.name}</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{app.description}</p>
                                    <a href={app.download_url} className="text-blue-500">{app.download_url}</a>
                                    {app.image_url && (
                                        <div className="mt-2">
                                            <img src={app.image_url} alt={`${app.name} image`} className="max-w-full h-auto max-w-360 max-h-360 object-cover" />
                                        </div>
                                    )}
                                    <p className="text-gray-600 dark:text-gray-400">Created by: {app.created_by_username} ({app.created_by}) on {new Date(app.created_at).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
};

export default Dashboard;

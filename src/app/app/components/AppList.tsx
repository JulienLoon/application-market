// /app/components/AppList.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { getAppsFrontend } from '../services/api';
import AppCard from '../components/AppCard';

interface App {
    id: number;
    name: string;
    description: string;
    download_url: string;
    image_url: string;
}

const AppList: React.FC = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false); // State for dark mode

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getAppsFrontend();
                setApps(data);
            } catch (error) {
                setError('Failed to fetch apps');
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={`container mx-auto ${darkMode ? 'dark' : ''}`}>
            <h1 className="text-2xl font-bold mt-8 mb-4">App List</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {apps.map(app => (
                    <AppCard
                        key={app.id}
                        name={app.name}
                        description={app.description}
                        downloadUrl={app.download_url}
                        imageUrl={app.image_url}
                        darkMode={darkMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default AppList;

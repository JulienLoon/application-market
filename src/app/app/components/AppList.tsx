// /app/components/AppList.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { getAppsFrontend } from '../services/api';
import AppCard from '../components/AppCard';
import AppListItem from '../components/AppListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList } from '@fortawesome/free-solid-svg-icons';

interface App {
    id: number;
    name: string;
    description: string;
    download_url: string;
    image_url: string;
}

interface AppListProps {
    searchTerm: string;
}

const AppList: React.FC<AppListProps> = ({ searchTerm }) => {
    const [apps, setApps] = useState<App[]>([]);
    const [filteredApps, setFilteredApps] = useState<App[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getAppsFrontend();
                setApps(data);
                setFilteredApps(data);
            } catch (error) {
                setError('Failed to fetch apps');
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredApps(apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredApps(apps);
        }
    }, [searchTerm, apps]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 p-8`}>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">App List</h1>
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-l-md flex items-center`}
                        onClick={() => setViewMode('grid')}
                    >
                        <FontAwesomeIcon icon={faTh} className="mr-2" />
                        Grid View
                    </button>
                    <button
                        className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-r-md flex items-center`}
                        onClick={() => setViewMode('list')}
                    >
                        <FontAwesomeIcon icon={faList} className="mr-2" />
                        List View
                    </button>
                </div>
            </div>
            {viewMode === 'grid' ? (
            filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredApps.map(app => (
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
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No Apps</p>
            )
            ) : (
            filteredApps.length > 0 ? (
                <div className="space-y-4">
                {filteredApps.map(app => (
                    <AppListItem
                    key={app.id}
                    name={app.name}
                    description={app.description}
                    downloadUrl={app.download_url}
                    imageUrl={app.image_url}
                    darkMode={darkMode}
                    />
                ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No Apps</p>
            )
            )}
        </div>
    );
};

export default AppList;

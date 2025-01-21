// /app/components/AppCard.tsx

import React from 'react';

interface AppCardProps {
    name: string;
    description: string;
    downloadUrl: string;
    imageUrl?: string;
    darkMode: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ name, description, downloadUrl, imageUrl, darkMode }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-gray-900 dark:text-white`}>
            {imageUrl && (
                <img src={imageUrl} alt={name} className="w-full h-32 object-cover object-center" />
            )}
            <div className="p-4">
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
                <div className="mt-4">
                    <a href={downloadUrl} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block">Download</a>
                </div>
            </div>
        </div>
    );
};

export default AppCard;

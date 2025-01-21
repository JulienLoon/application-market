// /app/components/AppListItem.tsx

import React from 'react';

interface AppListItemProps {
    name: string;
    description: string;
    downloadUrl: string;
    imageUrl?: string;
    darkMode: boolean;
}

const AppListItem: React.FC<AppListItemProps> = ({ name, description, downloadUrl, imageUrl, darkMode }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-gray-900 dark:text-white flex flex-row-reverse`}>
            {imageUrl && (
                <img src={imageUrl} alt={name} className="w-32 h-32 object-cover object-center" />
            )}
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
                </div>
                <div className="mt-4">
                    <a href={downloadUrl} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block">Download</a>
                </div>
            </div>
        </div>
    );
};

export default AppListItem;

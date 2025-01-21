// /app/components/FrontendFooter.tsx

'use client';

import React from 'react';
import { useMetadata } from '../context/MetadataContext';

const FrontendFooter: React.FC = () => {
    const { author, version } = useMetadata();

    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 text-center">
            <div className="container mx-auto">
                <p className="text-sm">
                    Version: {version} | © {new Date().getFullYear()} {author}
                </p>
            </div>
        </footer>
    );
};

export default FrontendFooter;

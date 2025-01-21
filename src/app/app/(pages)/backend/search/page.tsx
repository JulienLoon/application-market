// /app/app/(pages)/backend/search/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SearchResults: React.FC = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query'); // Haal zoekterm uit URL
    const [results, setResults] = useState<any[]>([]);
    
    useEffect(() => {
        if (query && query.length > 2) {
            const fetchSearchResults = async () => {
                try {
                    const response = await fetch(`http://localhost:3002/api/apps/windows-apps?search=${query}`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data);
                    } else {
                        console.error("Failed to fetch search results");
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            };
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>
            {results.length > 0 ? (
                <ul>
                    {results.map((app) => (
                        <li key={app.id} className="p-4 border-b border-gray-300 dark:border-gray-600">
                            <p className="font-semibold">{app.name}</p>
                            <p className="text-sm">{app.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResults;

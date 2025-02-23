// /app/components/BackendNavBar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faRightToBracket, faInfoCircle, faTimesCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useMetadata } from '../context/MetadataContext';

const BackendNavBar: React.FC = () => {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [tooltip, setTooltip] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const { author, version } = useMetadata();

    useEffect(() => {
        setIsMounted(true);
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(userPrefersDark);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [darkMode, isMounted]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.length > 2) {
            router.push(`/backend/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <nav className="fixed w-full top-0 bg-white dark:bg-gray-800 shadow z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {isMounted && (
                        <img
                            src={darkMode ? "/images/Long-LOGO_Application-Market_Dark-Mode.png" : "/images/Long-LOGO_Application-Market_Light-Mode.png"}
                            alt="Backend Market Logo"
                            className="h-8 cursor-pointer"
                            onClick={() => router.push('/backend')}
                        />
                    )}
                </div>
                <div className="relative flex items-center space-x-4">
                    {/* Search Input and Button */}
                    <div className="flex items-center bg-gray-200 dark:bg-gray-600 rounded-full relative">
                        {isSearchVisible && (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown} // Voeg onKeyDown toe
                                placeholder="Search apps..."
                                className="bg-transparent text-gray-800 dark:text-white rounded-full px-4 py-2 transition-all duration-300"
                            />
                        )}
                        <button
                            onClick={toggleSearch}
                            className="text-gray-800 dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        {isSearchVisible && (
                            <button
                                onClick={handleSearchSubmit}
                                className="text-gray-800 dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
                            >
                                Search
                            </button>
                        )}
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            onMouseEnter={() => setTooltip('Toggle Dark Mode')}
                            onMouseLeave={() => setTooltip(null)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                        </button>
                        {tooltip === 'Toggle Dark Mode' && (
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                Toggle Dark Mode
                            </div>
                        )}
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            onMouseEnter={() => setTooltip('Information')}
                            onMouseLeave={() => setTooltip(null)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                        {tooltip === 'Information' && (
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                Information
                            </div>
                        )}
                    </div>
                    <div className="relative group">
                        <button
                            onClick={handleLogout}
                            onMouseEnter={() => setTooltip('Logout')}
                            onMouseLeave={() => setTooltip(null)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faRightToBracket} />
                        </button>
                        {tooltip === 'Logout' && (
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                Logout
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showInfo && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-8 rounded-lg shadow-lg relative max-w-2xl mx-auto border-2 border-gray-300 dark:border-gray-600">
                        <button
                            onClick={() => setShowInfo(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} size="2x" />
                        </button>
                        <h2 className="text-lg font-bold mb-4">Information</h2>
                        <p>
                            Welcome to the Backend Application Market! Here you can manage the latest Windows Apps and view statistics about registered users.
                            Use the navigation buttons to browse through the dashboard, create or manage apps, and more.
                        </p>
                        <div className="mt-4">
                            <p className="text-sm font-semibold">Version: {version}</p>
                            <p className="text-sm font-semibold">
                                <span className="mr-1">©</span>{author}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default BackendNavBar;

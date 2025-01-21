// /app/components/FrontendNavBar.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faRightToBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface FrontendNavBarProps {
    onSearch: (searchTerm: string) => void;
}

const FrontendNavBar: React.FC<FrontendNavBarProps> = ({ onSearch }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const [searchTooltip, setSearchTooltip] = useState<string | null>(null);
    const [darkModeTooltip, setDarkModeTooltip] = useState<string | null>(null);
    const [loginTooltip, setLoginTooltip] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(userPrefersDark);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value); // Call the onSearch function passed as a prop
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        setSearchTooltip(!isSearchVisible ? 'Hide Search' : 'Search');
    };

    if (!isMounted) {
        return (
            <nav className="bg-white shadow">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="text-lg font-bold text-gray-900">
                        <a href="/">Frontend Market</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2">
                            <FontAwesomeIcon icon={faSun} />
                        </button>
                        <a href="/login" className="bg-gray-200 text-gray-800 rounded-full px-4 py-2">
                            <FontAwesomeIcon icon={faRightToBracket} />
                        </a>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white dark:bg-gray-800 shadow">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <a href="/" className="h-8">
                        <img
                            src={darkMode ? "/images/Long-LOGO_Application-Market_Dark-Mode.png" : "/images/Long-LOGO_Application-Market_Light-Mode.png"}
                            alt="Frontend Market Logo"
                            className="h-8 cursor-pointer"
                        />
                    </a>
                </div>
                <div className="relative flex items-center space-x-4">
                    {/* Search Input with Button */}
                    <div className="flex items-center bg-gray-200 dark:bg-gray-600 rounded-full relative">
                        {isSearchVisible && (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search apps..."
                                className="bg-transparent text-gray-800 dark:text-white rounded-full px-4 py-2 transition-all duration-300"
                            />
                        )}
                        <div className="relative">
                            <button
                                onClick={toggleSearch}
                                onMouseEnter={() => setSearchTooltip(isSearchVisible ? 'Hide Search' : 'Search')}
                                onMouseLeave={() => setSearchTooltip(null)}
                                className="text-gray-800 dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            {searchTooltip && (
                                <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                    {searchTooltip}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            onMouseEnter={() => setDarkModeTooltip('Toggle Dark Mode')}
                            onMouseLeave={() => setDarkModeTooltip(null)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                        </button>
                        {darkModeTooltip && (
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                {darkModeTooltip}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <a
                            href="/login"
                            onMouseEnter={() => setLoginTooltip('Login')}
                            onMouseLeave={() => setLoginTooltip(null)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faRightToBracket} />
                        </a>
                        {loginTooltip && (
                            <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                {loginTooltip}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default FrontendNavBar;

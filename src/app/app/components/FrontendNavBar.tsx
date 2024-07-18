// /app/components/FrontendNavBar.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const FrontendNavBar: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);  // Mark component as mounted
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
                <div className="flex items-center space-x-2" >
                    <img
                        src={darkMode ? "/images/Long-LOGO_Application-Market_Dark-Mode.png" : "/images/Long-LOGO_Application-Market_Light-Mode.png"}
                        alt="Frontend Market Logo"
                        className="h-8"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                    </button>
                    <a
                        href="/login"
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2"
                    >
                        <FontAwesomeIcon icon={faRightToBracket} />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default FrontendNavBar;
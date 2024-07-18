// /app/components/BackendNavBar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faRightToBracket, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const BackendNavBar: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);  // Mark component as mounted
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

    return (
        <nav className="fixed w-full top-0 bg-white dark:bg-gray-800 shadow z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {isMounted && (
                        <img
                            src={darkMode ? "/images/Long-LOGO_Application-Market_Dark-Mode.png" : "/images/Long-LOGO_Application-Market_Light-Mode.png"}
                            alt="Backend Market Logo"
                            className="h-8"
                        />
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                    </button>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <a
                        href="/backend/login"
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full px-4 py-2"
                    >
                        <FontAwesomeIcon icon={faRightToBracket} />
                    </a>
                </div>
            </div>
            {showInfo && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div> {/* Faded background */}
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
                    </div>
                </div>
            )}
        </nav>
    );
};

export default BackendNavBar;

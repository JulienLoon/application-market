// pages/not-found.jsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Gebruik useRouter van 'next/navigation' voor Server Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
    const router = useRouter(); // Gebruik useRouter van next/navigation

    const handleBackToFrontend = () => {
        router.push('/'); // Gebruik router.push om terug te gaan naar de frontend pagina
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: 'url(/images/404-Not-Found_Application-Market.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <button
                onClick={handleBackToFrontend}
                className="absolute top-10 right-7 text-white bg-gray-800 hover:bg-gray-700 hover:text-white py-2 px-4 rounded-lg focus:outline-none flex items-center"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Frontend
            </button>
        </div>
    );
};

export default NotFound;

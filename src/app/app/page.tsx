// /app/page.tsx

'use client'

import React, { useState } from 'react';
import AppList from './components/AppList';
import FrontendNavBar from './components/FrontendNavBar';
import FrontendFooter from './components/FrontendFooter';

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    return (
        <div className="flex flex-col min-h-screen">
            <FrontendNavBar onSearch={setSearchTerm} />
            <main className="flex-grow">
                <AppList searchTerm={searchTerm} />
            </main>
            <FrontendFooter />
        </div>
    );
};

export default Home;
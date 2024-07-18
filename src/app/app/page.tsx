import React from 'react';
import AppList from './components/AppList';
import FrontendNavBar from './components/FrontendNavBar';

const Home: React.FC = () => {
    return (
        <div>
            <FrontendNavBar />
            <AppList />
        </div>
    );
};

export default Home;

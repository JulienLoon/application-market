// /app/backend/layout.tsx

'use client';

import React from 'react';
import Head from 'next/head';
import BackendNavBar from '../../components/BackendNavBar';
import Sidebar from '../../components/SideBar';
import RequireAuth from '../../components/RequireAuth'; // Import the RequireAuth component

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const BackendLayout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || 'Backend | Application Market'}</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <BackendNavBar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 mt-16 ml-64">
            <RequireAuth>
              {children}
            </RequireAuth>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackendLayout;

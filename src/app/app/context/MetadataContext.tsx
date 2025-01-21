// /app/context/MetadataContext.tsx

'use client';

import React, { createContext, useContext, useState } from 'react';

interface Metadata {
    author: string;
    version: string;
}

const MetadataContext = createContext<Metadata | undefined>(undefined);

export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [metadata] = useState<Metadata>({
        author: 'Julian Loontjens',
        version: '0.10.4',
        });

    return (
        <MetadataContext.Provider value={metadata}>
            {children}
        </MetadataContext.Provider>
    );
};

export const useMetadata = () => {
    const context = useContext(MetadataContext);
    if (!context) {
        throw new Error('useMetadata must be used within a MetadataProvider');
    }
    return context;
};

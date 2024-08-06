// /app/components/RequireAuth.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notification from './Notification'; // Ensure you have a Notification component

interface RequireAuthProps {
    children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setNotification("Woah there, it seems like you're not logged in. Redirecting to login...");
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
                return;
            }

            try {
                const response = await fetch('http://localhost:3002/api/auth/checkToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok && result.valid) {
                    setIsLoading(false);
                } else {
                    localStorage.removeItem('token');
                    setNotification("Session expired or invalid token. Redirecting to login...");
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error checking token:', error);
                localStorage.removeItem('token');
                setNotification("An error occurred. Redirecting to login...");
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>; // Or another loading indicator
    }

    if (notification) {
        return (
            <Notification
                message={notification}
                type="error"
                onClose={() => setNotification(null)}
            />
        );
    }

    return <>{children}</>;
};

export default RequireAuth;

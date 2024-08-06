// /login/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Notification from '../components/Notification';
import { getRegistrationStatus } from '../services/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/backend');
      }

      const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(userPrefersDark);

      const fetchRegistrationStatus = async () => {
        try {
          const status = await getRegistrationStatus();
          setRegistrationEnabled(status);
        } catch (error) {
          console.error('Failed to fetch registration status:', error);
        }
      };

      fetchRegistrationStatus();
    }
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
        setError('Please enter both username and password.');
        setSuccessMessage(null);
        return;
    }

    try {
        const response = await axios.post('http://localhost:3002/api/auth/login', {
            username,
            password,
        });

        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id.toString()); // Convert to string
            setSuccessMessage('Login successful! Redirecting...');
            setError(null);
            setTimeout(() => {
                router.push('/backend');
            }, 2000);
        }
    } catch (err: any) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data;
        if (typeof errorMessage === 'string') {
            setError(errorMessage);
        } else if (typeof errorMessage === 'object') {
            setError('Login failed: wrong username or password');
        } else {
            setError('Login failed: API not available.');
        }
        setSuccessMessage(null);
    }
};

  const handleBackToFrontend = () => {
    router.push('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/images/Login-Sceen_Application-Market.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Login</h2>
          <button
            onClick={handleBackToFrontend}
            className="text-blue-500 hover:underline focus:outline-none flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Frontend
          </button>
        </div>
        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
        {successMessage && (
          <Notification
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage(null)}
          />
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
          >
            Login
          </button>
        </form>
        {registrationEnabled && (
          <div className="mt-4 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Don't have an account yet?{' '}
              <button onClick={handleRegister} className="text-blue-500 hover:underline focus:outline-none">
                Register here.
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
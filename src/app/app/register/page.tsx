// /register/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Notification from '../components/Notification';
import { getRegistrationStatus } from '../services/api';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email_address, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(userPrefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const enabled = await getRegistrationStatus();
        setRegistrationEnabled(enabled);
      } catch (error) {
        console.error('Error fetching registration status:', error);
        setRegistrationEnabled(false);
      }
    };

    fetchRegistrationStatus();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email_address)) {
      setWarningMessage('Invalid email format');
      setSuccessMessage(null);
      setError(null);
      return;
    }

    if (password !== confirmPassword) {
      setWarningMessage('Passwords do not match');
      setSuccessMessage(null);
      setError(null);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/api/auth/register', {
        username,
        password,
        email_address,
        first_name,
        last_name,
        isEnabled: true,
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setError(null);
        setWarningMessage(null);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data;
      if (err.response?.status === 400 && errorMessage === 'Username or Email already exists') {
        setWarningMessage('Username or Email already exists');
      } else if (typeof errorMessage === 'string') {
        setError(errorMessage);
      } else if (typeof errorMessage === 'object') {
        setError(errorMessage.message || 'Registration failed: unknown error');
      } else {
        setError('Registration failed: API not available.');
      }
      setSuccessMessage(null);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/images/Register-Sceen_Application-Market.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Register</h2>
          <button
            onClick={handleBackToLogin}
            className="text-blue-500 hover:underline focus:outline-none flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Login
          </button>
        </div>
        {!registrationEnabled ? (
          <p className="text-red-500">Registration is currently disabled.</p>
        ) : (
          <>
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
            {warningMessage && (
              <Notification
                message={warningMessage}
                type="warning"
                onClose={() => setWarningMessage(null)}
              />
            )}
            <form onSubmit={handleRegister} className="space-y-4">
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
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email_address">
                  Email
                </label>
                <input
                  id="email_address"
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
                  value={email_address}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Register
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;

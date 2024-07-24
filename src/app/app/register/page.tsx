// /register/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Notification from '../components/Notification';  // Zorg ervoor dat dit de juiste import is

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

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
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setError(null);
        setWarningMessage(null);
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Wait for 2 seconds before redirecting
      }
    } catch (err: any) {
      const errorMessage = err.response?.data;
      if (err.response?.status === 400 && errorMessage === 'Username already exists') {
        setWarningMessage('Username already exists');
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
      </div>
    </div>
  );
};

export default RegisterPage;

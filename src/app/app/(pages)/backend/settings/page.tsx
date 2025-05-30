// /app/backend/settings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';

const SettingsPage: React.FC = () => {
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [newRegistrationEnabled, setNewRegistrationEnabled] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Retrieve token from local storage or context
  const token = localStorage.getItem('token'); // Adjust as necessary

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        setNotification({ message: 'No token found, please log in.', type: 'error' });
        return;
      }

      try {
        const response = await axios.get('http://localhost:3002/api/settings/registration', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setRegistrationEnabled(response.data.registration_enabled);
        setNewRegistrationEnabled(response.data.registration_enabled);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setNotification({ message: 'Failed to load settings', type: 'error' });
      }
    };

    fetchSettings();
  }, [token]);

  const handleCheckboxChange = () => {
    setNewRegistrationEnabled(!newRegistrationEnabled);
  };

  const handleSaveSettings = async () => {
    if (!token) {
      setNotification({ message: 'No token found, please log in.', type: 'error' });
      return;
    }

    try {
      await axios.put('http://localhost:3002/api/settings/registration', {
        registration_enabled: newRegistrationEnabled,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setRegistrationEnabled(newRegistrationEnabled);
      setNotification({ message: 'Registration setting updated', type: 'success' });
    } catch (error) {
      console.error('Error updating registration setting:', error);
      setNotification({ message: 'Failed to update setting', type: 'error' });
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Registration</h2>
        <div className="flex items-center">
          <label className="text-gray-700 dark:text-gray-300 mr-2">Enable Registration:</label>
          <input
            type="checkbox"
            checked={newRegistrationEnabled}
            onChange={handleCheckboxChange}
            className="form-checkbox"
          />
        </div>
        <button
          onClick={handleSaveSettings}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

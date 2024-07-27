// /create-app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';

const CreateAppPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setImagePreview(imageUrl);
  }, [imageUrl]);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('user_id');

      if (!user_id) {
        console.error('User ID not found.');
        return;
      }

      const newApp = {
        name,
        description,
        download_url: downloadUrl,
        image_url: imageUrl,
        created_by: user_id,
        last_modified_by: user_id,
      };

      await axios.post('http://localhost:3002/api/apps/windows-apps', newApp, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setName('');
      setDescription('');
      setDownloadUrl('');
      setImageUrl('');
      setImagePreview(null);
      setSuccessMessage('App successfully created!');
      setErrorMessage(null);
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage('Error creating app');
      console.error('Error creating app:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New App</h1>
        {successMessage && (
          <Notification
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {errorMessage && (
          <Notification
            message={errorMessage}
            type="error"
            onClose={() => setErrorMessage(null)}
          />
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Download URL
          </label>
          <input
            type="text"
            id="downloadUrl"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-100">Image Preview:</p>
              <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-auto"/>
            </div>
          )}
        </div>
        <button
          onClick={handleCreate}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
        >
          Create App
        </button>
      </div>
    </div>
  );
};

export default CreateAppPage;

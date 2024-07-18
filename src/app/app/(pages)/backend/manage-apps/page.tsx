// /manage-apps/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';

interface App {
  id: number;
  name: string;
  description: string;
  download_url: string;
  image_url: string;
  last_modified_by: string;
}

const ManageAppsPage: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/apps/windows-apps');
        setApps(response.data);
      } catch (err) {
        console.error('Error fetching apps:', err);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    setImagePreview(newImageUrl);
  }, [newImageUrl]);

  const handleUpdate = async () => {
    if (editingApp) {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');

        if (!user_id) {
          console.error('User ID not found.');
          return;
        }

        const updatedApp: App = {
          ...editingApp,
          name: newName,
          description: newDescription,
          download_url: newDownloadUrl,
          image_url: newImageUrl,
          last_modified_by: user_id,
        };

        await axios.put(`http://localhost:8080/api/apps/windows-apps/${editingApp.id}`, updatedApp, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setApps(apps.map(app => (app.id === editingApp.id ? updatedApp : app)));
        setEditingApp(null);
        setNewName('');
        setNewDescription('');
        setNewDownloadUrl('');
        setNewImageUrl('');
        setImagePreview(null);
        setSuccessMessage('App successfully updated!');
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage('Error updating app');
        setSuccessMessage(null);
        console.error('Error updating app:', err);
      }
    }
  };

  const handleEditClick = (app: App) => {
    setEditingApp(app);
    setNewName(app.name);
    setNewDescription(app.description);
    setNewDownloadUrl(app.download_url);
    setNewImageUrl(app.image_url);
    setImagePreview(app.image_url);
  };

  const handleCancelEdit = () => {
    setEditingApp(null);
    setNewName('');
    setNewDescription('');
    setNewDownloadUrl('');
    setNewImageUrl('');
    setImagePreview(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/apps/windows-apps/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApps(apps.filter(app => app.id !== id));
      setSuccessMessage('App successfully deleted!');
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('Error deleting app');
      setSuccessMessage(null);
      console.error('Error deleting app:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-3xl"> {/* Increased max-width to max-w-3xl */}
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Apps</h1>
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
        {apps.map((app: App) => (
          <div key={app.id} className="mb-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{app.name}</h2>
            <p className="text-gray-700 dark:text-gray-300">{app.description}</p>
            <p className="text-gray-700 dark:text-gray-300 truncate">Download URL: {app.download_url}</p>
            <p className="text-gray-700 dark:text-gray-300 truncate">Image URL: {app.image_url}</p>
            {app.image_url && (
              <div className="mt-2">
                <img src={app.image_url} alt={`${app.name} image`} className="max-w-full h-auto" />
              </div>
            )}
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEditClick(app)}
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(app.id)}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {editingApp && (
          <div className="mt-6 bg-gray-200 dark:bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit App</h2>
            <div className="mb-4">
              <label htmlFor="newName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                New Name
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newDescription" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                New Description
              </label>
              <textarea
                id="newDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newDownloadUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                New Download URL
              </label>
              <input
                type="text"
                id="newDownloadUrl"
                value={newDownloadUrl}
                onChange={(e) => setNewDownloadUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newImageUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                New Image URL
              </label>
              <input
                type="text"
                id="newImageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-100">Image Preview:</p>
                  <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-auto"/>
                </div>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
              >
                Update App
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppsPage;
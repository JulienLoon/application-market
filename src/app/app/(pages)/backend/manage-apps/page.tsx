// /manage-apps/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList } from '@fortawesome/free-solid-svg-icons';

interface App {
  id: number;
  name: string;
  description: string;
  download_url: string;
  image_url: string;
  last_modified_by: string;
  last_modified_by_username: string;
  created_at: string;
  created_by: number;
  created_by_username: string;
  updated_at: string;
}

const ManageAppsPage: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    downloadUrl: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [confirmDeleteAppId, setConfirmDeleteAppId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/apps/windows-apps');
        setApps(response.data);
        setFilteredApps(response.data); // Set filtered apps initially to all apps
      } catch (err) {
        console.error('Error fetching apps:', err);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    setImagePreview(formValues.imageUrl);
  }, [formValues.imageUrl]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredApps(apps);
    } else {
      setFilteredApps(
        apps.filter(app =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, apps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [id]: value }));
  };

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
          name: formValues.name,
          description: formValues.description,
          download_url: formValues.downloadUrl,
          image_url: formValues.imageUrl,
          last_modified_by: user_id,
        };

        await axios.put(`http://localhost:3002/api/apps/windows-apps/${editingApp.id}`, updatedApp, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setApps(apps.map(app => (app.id === editingApp.id ? updatedApp : app)));
        resetForm();
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
    setFormValues({
      name: app.name,
      description: app.description,
      downloadUrl: app.download_url,
      imageUrl: app.image_url
    });
    setImagePreview(app.image_url);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingApp(null);
    setFormValues({ name: '', description: '', downloadUrl: '', imageUrl: '' });
    setImagePreview(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/apps/windows-apps/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApps(apps.filter(app => app.id !== id));
      setFilteredApps(filteredApps.filter(app => app.id !== id)); // Update filtered apps
      setSuccessMessage('App successfully deleted!');
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('Error deleting app');
      setSuccessMessage(null);
      console.error('Error deleting app:', err);
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteAppId(id);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/apps/windows-apps/${confirmDeleteAppId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApps(apps.filter(app => app.id !== confirmDeleteAppId));
      setFilteredApps(filteredApps.filter(app => app.id !== confirmDeleteAppId)); // Update filtered apps
      setSuccessMessage('App successfully deleted!');
      setErrorMessage(null);
      setConfirmDeleteAppId(null);
    } catch (err) {
      setErrorMessage('Error deleting app');
      setSuccessMessage(null);
      console.error('Error deleting app:', err);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDeleteAppId(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Apps</h1>
          <div className="flex items-center flex-grow">
            <div className="w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-l-md flex items-center`}
                onClick={() => setViewMode('grid')}
              >
                <FontAwesomeIcon icon={faTh} className="mr-2" />
                Grid View
              </button>
              <button
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-r-md flex items-center`}
                onClick={() => setViewMode('list')}
              >
                <FontAwesomeIcon icon={faList} className="mr-2" />
                List View
              </button>
            </div>
          </div>
        </div>
        {/* Notifications Component */}
        <Notifications
          successMessage={successMessage}
          errorMessage={errorMessage}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />
        {/* Grid or List View */}
        {viewMode === 'grid' ? (
          filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app: App) => (
                <div key={app.id}>
                  <AppCard app={app} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                  {editingApp && editingApp.id === app.id && (
                    <AppForm
                      formValues={formValues}
                      onInputChange={handleInputChange}
                      onUpdate={handleUpdate}
                      onCancel={handleCancelEdit}
                      imagePreview={imagePreview}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No Apps</p>
          )
        ) : (
          filteredApps.length > 0 ? (
            <div className="space-y-4">
              {filteredApps.map((app: App) => (
                <div key={app.id}>
                  <AppCard app={app} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                  {editingApp && editingApp.id === app.id && (
                    <AppForm
                      formValues={formValues}
                      onInputChange={handleInputChange}
                      onUpdate={handleUpdate}
                      onCancel={handleCancelEdit}
                      imagePreview={imagePreview}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No Apps</p>
          )
        )}
        {/* Confirm Delete Modal */}
        {confirmDeleteAppId !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this app?</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  className="ml-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AppCard: React.FC<{ app: App, onEditClick: (app: App) => void, onDeleteClick: (id: number) => void }> = ({ app, onEditClick, onDeleteClick }) => (
  <div className="p-4 border rounded bg-gray-100 dark:bg-gray-700">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{app.name}</h2>
    <p className="text-gray-700 dark:text-gray-300">{app.description}</p>
    <p className="text-gray-700 dark:text-gray-300 truncate">Download URL: {app.download_url}</p>
    <p className="text-gray-700 dark:text-gray-300 truncate">Image URL: {app.image_url}</p>
    {app.image_url && (
      <div className="mt-2">
        <img src={app.image_url} alt={`${app.name} image`} className="max-w-full h-auto" />
      </div>
    )}
    <p className="text-gray-600 dark:text-gray-400">
      Created by: {app.created_by_username} ({app.created_by}) on {new Date(app.created_at).toLocaleString()}
    </p>
    <p className="text-gray-600 dark:text-gray-400">
      Last modified by: {app.last_modified_by_username} ({app.last_modified_by}) on {new Date(app.updated_at).toLocaleString()}
    </p>
    <div className="mt-2 space-x-2">
      <button onClick={() => onEditClick(app)} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">Edit</button>
      <button onClick={() => onDeleteClick(app.id)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Delete</button>
    </div>
  </div>
);

const AppForm: React.FC<{ formValues: any, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, onUpdate: () => void, onCancel: () => void, imagePreview: string | null }> = ({ formValues, onInputChange, onUpdate, onCancel, imagePreview }) => (
  <div className="mt-4 bg-gray-200 dark:bg-gray-700 p-4 rounded">
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit App</h2>
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">Name</label>
      <input type="text" id="name" value={formValues.name} onChange={onInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100" />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
      <textarea id="description" value={formValues.description} onChange={onInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100" />
    </div>
    <div className="mb-4">
      <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-100">Download URL</label>
      <input type="text" id="downloadUrl" value={formValues.downloadUrl} onChange={onInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100" />
    </div>
    <div className="mb-4">
      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-100">New Image URL</label>
      <input type="text" id="imageUrl" value={formValues.imageUrl} onChange={onInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:text-gray-100" />
      {imagePreview && (
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-100">Image Preview:</p>
          <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-auto" />
        </div>
      )}
    </div>
    <div className="space-x-2">
      <button onClick={onUpdate} className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">Update App</button>
      <button onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
    </div>
  </div>
);

const Notifications: React.FC<{ successMessage: string | null, errorMessage: string | null, setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>, setErrorMessage: React.Dispatch<React.SetStateAction<string | null>> }> = ({ successMessage, errorMessage, setSuccessMessage, setErrorMessage }) => (
  <>
    {successMessage && <Notification message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
    {errorMessage && <Notification message={errorMessage} type="error" onClose={() => setErrorMessage(null)} />}
  </>
);

export default ManageAppsPage;

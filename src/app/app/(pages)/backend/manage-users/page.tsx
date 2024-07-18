// /backend/manage-users/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    }
  };

  const addUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.post('http://localhost:8080/api/users', newUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers([...users, response.data]);
      setNewUser({ username: '', email: '' });
      setSuccessMessage('User successfully added!');
      setError(null);
    } catch (err) {
      setError('Error creating user');
      setSuccessMessage(null);
      console.error('Error creating user:', err);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage('User successfully deleted!');
      setError(null);
      if (expandedUserId === userId) {
        setExpandedUserId(null);
      }
    } catch (err) {
      setError('Error deleting user');
      setSuccessMessage(null);
      console.error('Error deleting user:', err);
    }
  };

  const toggleDetails = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Manage Users</h1>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl">
        <form className="mb-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="button"
            onClick={addUser}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
        <ul>
          {users.map(user => (
            <li key={user.id} className="flex flex-col border-b py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 mt-2"
                onClick={() => toggleDetails(user.id)}
              >
                {expandedUserId === user.id ? 'Hide Details' : 'Show Details'}
              </button>
              {expandedUserId === user.id && (
                <div className="mt-2 p-4 bg-gray-200 dark:bg-gray-700 rounded">
                  <p className="text-gray-900 dark:text-gray-100">User ID: {user.id}</p>
                  {/* Voeg hier meer details toe die je wilt weergeven */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsersPage;
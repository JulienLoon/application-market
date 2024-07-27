// /pages/backend/manage-users/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../../../components/Notification';

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email_address: '',
    isEnabled: true
  });
  const [editUser, setEditUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost:3002/api/users', {
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

      const response = await axios.post('http://localhost:3002/api/auth/register', newUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers([...users, response.data]);
      setNewUser({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email_address: '',
        isEnabled: true
      });
      setSuccessMessage('User successfully added!');
      setError(null);
    } catch (err) {
      setError('Error creating user');
      setSuccessMessage(null);
      console.error('Error creating user:', err);
    }
  };

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      if (!editUser || !editUser.id) {
        throw new Error('No user selected for editing');
      }

      await axios.put(`http://localhost:3002/api/users/${editUser.id}`, editUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
      setEditUser(null);
      setSuccessMessage('User successfully updated!');
      setError(null);
    } catch (err) {
      setError('Error updating user');
      setSuccessMessage(null);
      console.error('Error updating user:', err);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      await axios.delete(`http://localhost:3002/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage('User successfully deleted!');
      setError(null);
      setConfirmDeleteUserId(null);
      if (expandedUserId === userId) {
        setExpandedUserId(null);
      }
    } catch (err) {
      setError('Error deleting user');
      setSuccessMessage(null);
      console.error('Error deleting user:', err);
    }
  };

  const handleConfirmDelete = (userId: number) => {
    setConfirmDeleteUserId(userId);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteUserId(null);
  };

  const toggleDetails = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  const handleEditClick = (user: any) => {
    setEditUser(user);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditUser({
      ...editUser,
      [name]: newValue
    });
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
              name="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email_address" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Email
            </label>
            <input
              type="email"
              id="email_address"
              name="email_address"
              value={newUser.email_address}
              onChange={(e) => setNewUser({ ...newUser, email_address: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="isEnabled" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Enabled
            </label>
            <input
              type="checkbox"
              id="isEnabled"
              name="isEnabled"
              checked={newUser.isEnabled}
              onChange={(e) => setNewUser({ ...newUser, isEnabled: e.target.checked })}
              className="mt-1 block w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="button"
            onClick={addUser}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add User
          </button>
        </form>
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enabled
              </th>
              <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-700 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.isEnabled ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-4 text-red-600 hover:text-red-900"
                      onClick={() => handleConfirmDelete(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="ml-4 text-gray-600 hover:text-gray-900"
                      onClick={() => toggleDetails(user.id)}
                    >
                      {expandedUserId === user.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                {expandedUserId === user.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <p><strong>First Name:</strong> {user.first_name}</p>
                        <p><strong>Last Name:</strong> {user.last_name}</p>
                        <p><strong>Email:</strong> {user.email_address}</p>
                        <p><strong>Enabled:</strong> {user.isEnabled ? 'Yes' : 'No'}</p>
                        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {confirmDeleteUserId !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this user?</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => deleteUser(confirmDeleteUserId)}
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
        {editUser && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-4 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit User</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="editUsername" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Username
                </label>
                <input
                  type="text"
                  id="editUsername"
                  name="username"
                  value={editUser.username}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editPassword" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Password
                </label>
                <input
                  type="password"
                  id="editPassword"
                  name="password"
                  value={editUser.password}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editFirstName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  First Name
                </label>
                <input
                  type="text"
                  id="editFirstName"
                  name="first_name"
                  value={editUser.first_name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editLastName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Last Name
                </label>
                <input
                  type="text"
                  id="editLastName"
                  name="last_name"
                  value={editUser.last_name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editEmail" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email_address"
                  value={editUser.email_address}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editIsEnabled" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Enabled
                </label>
                <input
                  type="checkbox"
                  id="editIsEnabled"
                  name="isEnabled"
                  checked={editUser.isEnabled}
                  onChange={handleEditChange}
                  className="mt-1 block w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <button
                type="button"
                onClick={updateUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="ml-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;

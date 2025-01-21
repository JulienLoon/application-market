// /pages/backend/manage-users/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Notification from '../../../components/Notification';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<number | null>(null);
  const [secondConfirm, setSecondConfirm] = useState(false);
  const currentUserId = Number(localStorage.getItem('user_id'));  // Stel het ID van de huidige gebruiker vast
  const router = useRouter();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showEditPassword, setShowEditPassword] = useState<boolean>(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost:3002/api/admin/users', {
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

  const validateUserFields = (user: any, isEdit = false) => {
    const { username, password, first_name, last_name, email_address } = user;
    if (!username || !first_name || !last_name || !email_address) {
      return 'All fields are required.';
    }
    if (!isEdit && !password) {
      return 'Password is required.';
    }
    return null;
  };  

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      if (!email.includes('@')) {
        return 'Email address must contain @';
      } else if (!email.includes('.')) {
        return 'Email address must contain a domain';
      } else {
        return 'Invalid email address';
      }
    }
    return null;
  }; 

  const addUser = async () => {
    const fieldError = validateUserFields(newUser);
    const emailError = validateEmail(newUser.email_address);

    if (fieldError) {
        setWarningMessage(fieldError);
        return;
    }

    if (emailError) {
        setWarningMessage(`Faulty email address entered: ${emailError}`);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        const response = await axios.post('http://localhost:3002/api/admin/users', newUser, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSuccessMessage('User successfully added!');
        setError(null);
        fetchUsers();
        setNewUser({
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            email_address: '',
            isEnabled: true
        });
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const response = err.response as { data: { field?: string, message?: string } };
            if (response.data.field === 'username') {
                setWarningMessage('Username already exists');
            } else if (response.data.field === 'email_address') {
                setWarningMessage('Email address already exists');
            } else {
                setError(response.data.message || 'Error creating user');
            }
        } else {
            setError('Error creating user');
        }
        setSuccessMessage(null);
        console.error('Error creating user:', err);
    }
};  

const updateUser = async () => {
    const emailError = validateEmail(editUser.email_address);
    const fieldError = validateUserFields(editUser, true);

    if (emailError) {
        setWarningMessage(`Faulty email address entered: ${emailError}`);
        return;
    }

    if (fieldError) {
        setWarningMessage(fieldError);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        if (!editUser || !editUser.id) {
            throw new Error('No user selected for editing');
        }

        const userToUpdate = { ...editUser, isEnabled: editUser.isEnabled ? 1 : 0 };
        if (!userToUpdate.password) {
            delete userToUpdate.password;
        }

        const response = await axios.put(`http://localhost:3002/api/admin/users/${editUser.id}`, userToUpdate, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSuccessMessage('User successfully updated!');
        setError(null);
        fetchUsers();
        setEditUser(null);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const response = err.response as { data: { field?: string, message?: string } };
            if (response.data.field === 'username') {
                setWarningMessage('Username already exists');
            } else if (response.data.field === 'email_address') {
                setWarningMessage('Email address already exists');
            } else {
                setError(response.data.message || 'Error updating user');
            }
        } else {
            setError('Error updating user');
        }
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

        await axios.delete(`http://localhost:3002/api/admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        fetchUsers();
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

const handleSecondConfirmDelete = () => {
    setSecondConfirm(true);
};

const handleFinalDelete = () => {
  deleteUser(confirmDeleteUserId!);  // Voer de verwijderactie definitief uit
  setSecondConfirm(false);
  setConfirmDeleteUserId(null);
  if (confirmDeleteUserId === currentUserId) {
    localStorage.removeItem('token');
    setWarningMessage('You have been logged out. Redirecting to login...');
    setTimeout(() => {
        router.push('/login');
    }, 2000);
}
};

const handleCancelDelete = () => {
    setConfirmDeleteUserId(null);
    setSecondConfirm(false);
};

  const toggleDetails = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  const handleEditClick = (user: any) => {
    setEditUser({ ...user, password: '' });
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
      {warningMessage && (
        <Notification
          message={warningMessage}
          type="warning"
          onClose={() => setWarningMessage(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add User</h2>
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
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Users</h2>
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
        {confirmDeleteUserId !== null && !secondConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this user?</p>
                  <div className="flex justify-end">
                      <button
                          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                              if (confirmDeleteUserId === currentUserId) {
                                  handleSecondConfirmDelete();  // Eerste bevestiging voor eigen account
                              } else {
                                  handleFinalDelete();  // Directe verwijdering voor andere gebruikers
                              }
                          }}
                      >
                          {confirmDeleteUserId === currentUserId ? 'Confirm' : 'Delete'}
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
        {secondConfirm && confirmDeleteUserId === currentUserId && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Final Confirmation</h2>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">This action is irreversible. Are you sure you want to delete your own account?</p>
                  <div className="flex justify-end">
                      <button
                          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={handleFinalDelete}  // Tweede bevestiging en definitieve verwijdering
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
              <div className="mb-4 relative">
                <label
                  htmlFor="editPassword"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="editPassword"
                    name="password"
                    value={editUser.password}
                    onChange={handleEditChange}
                    placeholder="Leave blank to keep current password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Leave blank to keep current password.
                </p>
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

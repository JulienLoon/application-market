// /services/api.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

interface AppData {
    name: string;
    description: string;
    download_url: string;
    image_url: string;
    created_by: string;
    last_modified_by: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not found');
    }
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

// User Info API function
export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/userinfo`, getAuthHeaders());
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                throw new Error(data.message);
            }
        }
        throw new Error('An error occurred while fetching user info');
    }
};

// Apps API functions
export const getAppsBackend = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/apps/windows-apps`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching apps:', error);
        throw error;
    }
};

export const getAppsFrontend = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/apps/windows-apps`);
        return response.data;
    } catch (error) {
        console.error('Error fetching apps:', error);
        throw error;
    }
};

export const createApp = async (appData: AppData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/apps/windows-apps`, appData, getAuthHeaders());
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating app:', error.response?.data);
        } else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
};

export const updateApp = async (appId: number, appData: AppData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/apps/windows-apps/${appId}`, appData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating app:', error);
        throw error;
    }
};

export const deleteApp = async (appId: number) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/apps/windows-apps/${appId}`, getAuthHeaders());
    } catch (error) {
        console.error('Error deleting app:', error);
        throw error;
    }
};

// Users API functions
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (userData: { username: string; email: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/users`, userData, getAuthHeaders());
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating user:', error.response?.data);
        } else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
};

export const updateUser = async (userId: number, userData: { username: string; email: string }) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, userData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId: number) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`, getAuthHeaders());
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Count API functions
export const getRegisteredUsersCount = async () => {
    try {
        const response = await axios.get<{ count: number }>(`${API_BASE_URL}/api/users/count`, getAuthHeaders());
        return response.data.count;
    } catch (error) {
        console.error('Error fetching registered users count:', error);
        throw error;
    }
};

export const getAppsCount = async () => {
    try {
        const response = await axios.get<{ count: number }>(`${API_BASE_URL}/api/apps/windows-apps/count`, getAuthHeaders());
        return response.data.count;
    } catch (error) {
        console.error('Error fetching apps count:', error);
        throw error;
    }
};

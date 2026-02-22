import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://avtar-register.preview.emergentagent.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface JobCategory {
  id: string;
  name_en: string;
  name_hi: string;
  icon: string;
}

export interface Location {
  id: string;
  city_en: string;
  city_hi: string;
  state_en: string;
  state_hi: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  job_category: string;
  location: string;
  is_verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary_min: number;
  salary_max: number;
  employer_name: string;
  employer_mobile: string;
  is_active: boolean;
  created_at: string;
}

// API Functions
export const sendOTP = async (mobile: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/send-otp', { mobile });
  return response.data;
};

export const verifyOTP = async (mobile: string, otp: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/verify-otp', { mobile, otp });
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  mobile: string;
  job_category: string;
  location: string;
}): Promise<User> => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const getJobCategories = async (): Promise<JobCategory[]> => {
  const response = await api.get('/job-categories');
  return response.data;
};

export const getLocations = async (): Promise<Location[]> => {
  const response = await api.get('/locations');
  return response.data;
};

export const getJobs = async (params?: { category?: string; location?: string }): Promise<Job[]> => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const getUsers = async (params?: { category?: string; location?: string }): Promise<User[]> => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getStats = async (): Promise<{
  total_users: number;
  total_jobs: number;
  users_by_category: Record<string, number>;
  users_by_location: Record<string, number>;
}> => {
  const response = await api.get('/stats');
  return response.data;
};

export const createJob = async (jobData: {
  title: string;
  description: string;
  category: string;
  location: string;
  salary_min: number;
  salary_max: number;
  employer_name: string;
  employer_mobile: string;
}): Promise<Job> => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export default api;

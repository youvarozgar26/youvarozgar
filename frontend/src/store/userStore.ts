import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  // User data
  name: string;
  mobile: string;
  jobCategory: string;
  location: string;
  isRegistered: boolean;
  userId: string | null;
  
  // Actions
  setName: (name: string) => void;
  setMobile: (mobile: string) => void;
  setJobCategory: (category: string) => void;
  setLocation: (location: string) => void;
  setRegistered: (registered: boolean, userId?: string) => void;
  loadUserFromStorage: () => Promise<void>;
  saveUserToStorage: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  name: '',
  mobile: '',
  jobCategory: '',
  location: '',
  isRegistered: false,
  userId: null,
  
  setName: (name) => set({ name }),
  setMobile: (mobile) => set({ mobile }),
  setJobCategory: (category) => set({ jobCategory: category }),
  setLocation: (location) => set({ location }),
  
  setRegistered: (registered, userId) => {
    set({ isRegistered: registered, userId: userId || null });
    get().saveUserToStorage();
  },
  
  loadUserFromStorage: async () => {
    try {
      const userData = await AsyncStorage.getItem('youvarozgar_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        set(parsed);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  },
  
  saveUserToStorage: async () => {
    try {
      const { name, mobile, jobCategory, location, isRegistered, userId } = get();
      await AsyncStorage.setItem('youvarozgar_user', JSON.stringify({
        name, mobile, jobCategory, location, isRegistered, userId
      }));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  },
  
  clearUser: () => {
    set({
      name: '',
      mobile: '',
      jobCategory: '',
      location: '',
      isRegistered: false,
      userId: null,
    });
    AsyncStorage.removeItem('youvarozgar_user');
  },
}));

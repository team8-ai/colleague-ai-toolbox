import { User } from '@/types/auth'; // Use our User type
import { authAPI } from './api';

// Functions related to authentication API calls are now in api.ts
// Functions related to managing auth state are in AuthContext.tsx

// This file might still be useful for helper functions related to auth 
// (e.g., getting user data from localStorage, validating token format, etc.)
// but the core logic has moved.

export const getCurrentUserFromStorage = (): User | null => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // Clear corrupted data
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      return null;
    }
  }
  return null;
};

// The `signOut` function logic is now within AuthContext and authAPI
// The `onAuthStateChanged` is effectively handled by the useEffect in AuthContext


import { User } from "firebase/auth"; // Keep this for type compatibility
import { authAPI } from "./api";

// Mock auth methods since we're bypassing authentication
export const signInWithGoogle = async () => {
  console.log('Authentication bypassed');
  return null;
};

export const bypassLogin = async () => {
  console.log('Authentication bypassed');
  const result = await authAPI.bypassLogin();
  if (result.token) {
    localStorage.setItem('authToken', result.token);
  }
  return result.user;
};

export const signOut = async () => {
  console.log('Sign out');
  await authAPI.logout();
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  // No-op function in this implementation
  // In a real app, you might want to check localStorage for token
  // and validate it with the backend
  return () => {};
};

export const getCurrentUser = () => {
  // In a real implementation, you'd validate the token and get user info
  // For now, return mock user if token exists
  const token = localStorage.getItem('authToken');
  if (token) {
    return {
      uid: 'mock-user-id',
      email: 'mock@example.com',
      displayName: 'Development User',
      photoURL: null,
    };
  }
  return null;
};


import { User } from "firebase/auth";

// Mock auth methods since we're bypassing authentication
export const signInWithGoogle = async () => {
  console.log('Authentication bypassed');
  return null;
};

export const bypassLogin = async () => {
  console.log('Authentication bypassed');
  return null;
};

export const signOut = async () => {
  console.log('Sign out bypassed');
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  // No-op function
  return () => {};
};

export const getCurrentUser = () => {
  return null;
};

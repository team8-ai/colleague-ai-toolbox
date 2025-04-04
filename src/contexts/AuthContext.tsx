
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth'; // Keep for type compatibility
import { toast } from '@/hooks/use-toast';
import { bypassLogin, signOut as authSignOut } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  bypassAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

// Mock user for bypass authentication
const mockUser = {
  uid: 'mock-user-id',
  email: 'mock@example.com',
  displayName: 'Development User',
  photoURL: null,
  emailVerified: true,
} as User;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, validate the token with your backend
      setUser(mockUser);
    }
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      // In development mode, just use the mock user
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-token-for-development');
      toast({
        title: "Development mode",
        description: "Successfully signed in as mock user",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bypassAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await bypassLogin();
      setUser(user || mockUser);
      toast({
        title: "Development mode",
        description: "Bypassed authentication successfully",
      });
    } catch (error: any) {
      console.error("Bypass login error:", error);
      setError(error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to bypass authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authSignOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error);
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, bypassAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

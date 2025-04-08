import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast'; // Ensure correct import path for use-toast
import { authAPI } from '@/lib/api';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check auth status
  const [error, setError] = useState<Error | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // You might want to add a backend endpoint like /api/auth/me 
          // to validate the token and get fresh user data.
          // For now, just trust the stored data.
          const userData = localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // If no user data is found but token exists, clear token
            localStorage.removeItem('authToken');
          }
        } catch (err) {
          // If parsing fails or token is invalid, clear storage
          console.error("Error verifying auth status:", err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password); // Call the updated API
      
      console.log('Login response received:', { 
        hasAccessToken: !!response.access_token,
        tokenType: response.token_type,
        userInfo: !!response.user
      });
      
      // Store token and user data - handle different possible token formats
      const token = response.access_token || response.token || response.accessToken;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      console.log('Token and user data stored in localStorage');
      
      // Update state
      setUser(response.user);
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in",
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err);
      toast({
        title: "Authentication error",
        description: err.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout(); // Call the updated API
      
      // State is updated via localStorage removal in api.ts
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err);
      toast({
        title: "Error signing out",
        description: err.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithEmail, logout }}>
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

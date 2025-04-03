
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, loading, login } = useAuth();

  // If the user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">AI</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold">AI Tool Hub</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access the AI tools collection for your organization.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={login}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            * Only users with email addresses from your organization can sign in
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

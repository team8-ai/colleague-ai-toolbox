
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, loading, bypassAuth } = useAuth();

  // If the user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleBypass = () => {
    bypassAuth();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">AI</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold">AI Tool Hub</h1>
          <p className="mt-2 text-muted-foreground">
            Development version - No authentication required
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleBypass}
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
                Enter AI Tool Hub (Dev Mode)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

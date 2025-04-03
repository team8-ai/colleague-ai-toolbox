
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container py-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
              <AvatarFallback className="text-3xl">{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{user?.displayName || "Not provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{user?.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
              <p className="text-lg">
                {user?.email?.split('@')[1] || "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;

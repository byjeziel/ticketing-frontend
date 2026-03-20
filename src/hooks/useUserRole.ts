import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export type UserRole = 'admin' | 'producer' | 'client';

interface UserProfile {
  auth0Id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export function useUserRole() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!isAuthenticated || !user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        // POST /users/sync auto-creates the user on first login and returns their profile
        const response = await axios.post(
          'http://localhost:3000/users/sync',
          { email: user.email, name: user.name },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUserProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to sync user profile');
      } finally {
        setLoading(false);
      }
    };

    syncUserProfile();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return userProfile ? roles.includes(userProfile.role) : false;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isProducer = (): boolean => hasRole('producer');
  const isClient = (): boolean => hasRole('client');

  return {
    userProfile,
    loading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isProducer,
    isClient,
  };
}

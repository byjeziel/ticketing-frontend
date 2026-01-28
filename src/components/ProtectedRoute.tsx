import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../hooks/useUserRole';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { hasAnyRole, loading } = useUserRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles as any)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '@/services/authApi';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const hasToken = !!localStorage.getItem('access_token');
  const { isLoading, isError } = useGetMeQuery(undefined, {
    skip: !hasToken
  });

  if (isLoading && hasToken) {
    return <div>Loading...</div>;
  }

  // If there's no token or there was an error, redirect to login
  if (!hasToken || isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '@/services/authApi';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner
  }

  if (!user) {
    // Redirect to /login, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

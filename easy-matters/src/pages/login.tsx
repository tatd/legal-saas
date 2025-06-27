import { LoginForm } from '@/components/login-form';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '@/services/authApi';

export function Login() {
  const location = useLocation();
  const { data: user, isError } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('access_token'),
  });

  // If user is already logged in, redirect to the home page
  if (!isError && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <LoginForm className="w-full max-w-md mx-8" />
    </div>
  );
}

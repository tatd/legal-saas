import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from '@/pages/home';
import { Login } from '@/pages/login';
import { ProtectedRoute } from '@/components/protected-route';
import { useGetMeQuery, authApi } from '@/services/authApi';
import { useState } from 'react';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Only run the query if we're not on the login page and there's a token
  const { data: user, isError } = useGetMeQuery(undefined, {
    skip: isLoginPage || !localStorage.getItem('access_token')
  });

  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Clear the token and reset the API state
      localStorage.removeItem('access_token');
      // Reset the API state
      authApi.util.resetApiState();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hasToken = !!localStorage.getItem('access_token');
  const isLoggedIn = !isError && !!user && hasToken;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm h-16 flex items-center px-8">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          Easy Matters
        </Link>
        <div className="ml-auto flex space-x-4">
          {hasToken && isLoggedIn && (
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="min-w-[100px]"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          )}
          {!hasToken && !isLoggedIn && !isLoginPage && (
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="p-8">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

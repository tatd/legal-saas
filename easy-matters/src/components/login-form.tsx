import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useSignUpMutation } from '@/services/authApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = LoginFormData & {
  firmName: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>();
  const signUpForm = useForm<SignupFormData>();

  const isLoading = isLoginLoading || isSignUpLoading;

  const onLogin = async (data: LoginFormData) => {
    setFormError(null);
    try {
      const response = await login(data).unwrap();
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        navigate('/');
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      setFormError(
        'Login failed. Please check your credentials and try again.'
      );
      console.error('Login error:', err);
    }
  };

  const onSignUp = async (data: SignupFormData) => {
    setFormError(null);

    try {
      await signUp(data).unwrap();
      setFormSuccess('Registration successful! Please log in.');
      setIsSignUp(false);
      signUpForm.reset();
    } catch (err: unknown) {
      const errorMessage =
        (err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : 'Registration failed. Please try again.') ||
        'Registration failed. Please try again.';
      setFormError(errorMessage);
      console.error('Signup error:', err);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormError(null);
    setFormSuccess(null);
  };
  const renderLoginForm = () => (
    <>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginForm.handleSubmit(onLogin)}>
          <div className="flex flex-col gap-6">
            {formError && (
              <div className="text-red-500 text-sm text-center">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="text-green-500 text-sm text-center">
                {formSuccess}
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...loginForm.register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-xs">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...loginForm.register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-xs">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={toggleForm}
            className="font-medium text-primary underline underline-offset-4 hover:no-underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={signUpForm.handleSubmit(onSignUp)}>
          <div className="flex flex-col gap-6">
            {formError && (
              <div className="text-red-500 text-sm text-center">
                {formError}
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="firmName">Firm Name</Label>
              <Input
                id="firmName"
                placeholder="Your Law Firm"
                required
                {...signUpForm.register('firmName', {
                  required: 'Firm name is required'
                })}
              />
              {signUpForm.formState.errors.firmName && (
                <p className="text-red-500 text-xs">
                  {signUpForm.formState.errors.firmName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="m@example.com"
                required
                {...signUpForm.register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-red-500 text-xs">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                required
                {...signUpForm.register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-red-500 text-xs">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={toggleForm}
            className="font-medium text-primary underline underline-offset-4 hover:no-underline cursor-pointer"
          >
            Log in
          </button>
        </p>
      </CardFooter>
    </>
  );

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>{isSignUp ? renderSignUpForm() : renderLoginForm()}</Card>
    </div>
  );
}

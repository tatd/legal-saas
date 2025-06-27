import { useGetMeQuery, type User } from '@/services/authApi';

type ApiResponse = {
  user: User;
};

export function Home() {
  const { data: response } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const user = (response as unknown as ApiResponse)?.user;

  if (!user) {
    return <div>Invalid user data format</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {user.firmName}!</h1>
      <p className="text-gray-600">You are now logged in to your account.</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold">User Details:</h2>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>
      </div>
    </div>
  );
}

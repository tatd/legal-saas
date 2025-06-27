import { CustomersList } from '@/components/customers-list';
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
      <div className="text-2xl font-bold">Welcome, {user.firmName}!</div>
      <div className="text-gray-600">
        You are now logged in to your account.
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="font-semibold">User Details:</div>
        <div>Email: {user.email}</div>
        <div>User ID: {user.id}</div>
      </div>
      <hr />
      <div className="text-2xl font-bold">Customers</div>
      <CustomersList />
    </div>
  );
}

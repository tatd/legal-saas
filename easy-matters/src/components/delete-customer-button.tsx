import type { Customer } from '@/services/customersApi';
import { Button } from './ui/button';
import {
  useDeleteCustomerMutation,
  useUpdateCustomerMutation
} from '@/services/customersApi';

export function DeleteCustomerButton({ customer }: { customer: Customer }) {
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const isLoading = isDeleting || isUpdating;

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(customer.id.toString()).unwrap();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleRestoreCustomer = async () => {
    try {
      await updateCustomer({
        id: customer.id.toString(),
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        isActive: true
      } as { id: string; isActive: boolean } & Partial<Customer>).unwrap();
    } catch (error) {
      console.error('Failed to restore customer:', error);
    }
  };

  return (
    <>
      {customer.isActive && (
        <Button
          variant="destructive"
          onClick={handleDeleteCustomer}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      )}
      {!customer.isActive && (
        <Button
          variant="outline"
          onClick={handleRestoreCustomer}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading ? 'Restoring...' : 'Restore'}
        </Button>
      )}
    </>
  );
}

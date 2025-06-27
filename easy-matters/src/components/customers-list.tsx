import { useGetCustomersQuery, type Customer, useGetMattersQuery } from '@/services/customersApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Helper function to display phone number in the list
function formatPhoneDisplay(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format as (###) ###-####
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

import { useState } from 'react';
import { useCreateCustomerMutation } from '@/services/customersApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MattersList } from './matters-list';

function CreateCustomerForm() {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Format phone number for input display
  const formatPhoneInput = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as (###) ###-####
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const [, p1, p2, p3] = match;
      return `${p1 ? `(${p1}` : ''}${p2 ? `) ${p2}` : ''}${p3 ? `-${p3}` : ''}`;
    }
    return phone;
  };

  // AI-generated helper function to handle phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the input value and cursor position
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');

    // Update the form state with raw numbers
    setFormData((prev) => ({
      ...prev,
      phoneNumber: cleaned
    }));

    // Format the display value
    const formatted = formatPhoneInput(cleaned);

    // Update the input's display value
    e.target.value = formatted;

    // Adjust cursor position
    const addedChars = formatted.length - input.length;
    const newCursorPosition = Math.max(0, cursorPosition + addedChars);

    // Set cursor position after state update
    setTimeout(() => {
      e.target.selectionStart = newCursorPosition;
      e.target.selectionEnd = newCursorPosition;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createCustomer({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        isActive: true
      }).unwrap();

      // Reset form on success
      setFormData({
        name: '',
        phoneNumber: ''
      });
    } catch (err) {
      setError('Failed to create customer. Please try again.');
      console.error('Error creating customer:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
      <div className="font-medium text-lg mb-3">Create New Customer</div>
      {error && (
        <div className="mb-3 p-2 text-red-600 text-sm bg-red-50 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </div>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer name"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </div>
          <Input
            type="text"
            name="phoneNumber"
            value={formatPhoneInput(formData.phoneNumber)}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
            disabled={isLoading}
            maxLength={14}
            required
          />
        </div>
        <div className="pt-1">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CustomerItem({ customer }: { customer: Customer }) {
  const { data: matters } = useGetMattersQuery(customer.id);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={customer.id.toString()}
        className="border rounded-lg mb-2 overflow-hidden"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180 cursor-pointer">
          <div className="flex items-center justify-between w-full pr-2">
            <div className="text-left">
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-600">
                {formatPhoneDisplay(customer.phoneNumber)}
              </div>
              <div className="text-sm text-gray-600">
                Status: {customer.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3 pt-0">
          <MattersList matters={matters || []} customerId={customer.id} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function CustomersList() {
  const { data: customers } = useGetCustomersQuery();

  return (
    <>
      <CreateCustomerForm />
      {customers && (
        <div className="space-y-2">
          {customers.map((customer) => (
            <CustomerItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </>
  );
}

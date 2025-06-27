import db from 'db';
import { CreateCustomerData, Customer } from 'types';

export async function getCustomers(): Promise<Customer[]> {
  const customersRaw = await db
    .knex()('customers')
    .select('name', 'phone_number', 'is_active');

  const customers: Customer[] = [];
  for (let raw of customersRaw) {
    customers.push({
      id: raw.id,
      name: raw.name,
      phoneNumber: raw.phone_number,
      isActive: raw.isActive
    });
  }
  return customers;
}

export async function createCustomer(
  createCustomerData: CreateCustomerData
): Promise<Customer> {
  const { name, phoneNumber } = createCustomerData;
  const [customer] = await db
    .knex()('customers')
    .insert({
      name,
      phone_number: phoneNumber,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return {
    id: customer.id,
    name: customer.name,
    phoneNumber: customer.phone_number,
    isActive: customer.isActive
  };
}

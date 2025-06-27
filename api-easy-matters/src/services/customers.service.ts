import db from 'db';
import { CreateCustomerData, Customer } from 'types';

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  const customersRaw = await db
    .knex()('customers')
    .select('id', 'name', 'phone_number', 'is_active')
    .orderBy('is_active', 'name');

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

// Create customer
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

// Get a single customer
export async function getCustomer(id: number): Promise<Customer> {
  const customerRaw = await db
    .knex()('customers')
    .select('id', 'name', 'phone_number', 'is_active')
    .where({ id })
    .first();

  if (!customerRaw) {
    throw new Error('Customer not found');
  } else {
    return {
      id: customerRaw.id,
      name: customerRaw.name,
      phoneNumber: customerRaw.phone_number,
      isActive: customerRaw.is_active
    };
  }
}

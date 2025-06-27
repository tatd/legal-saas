import db from 'db';
import { CreateCustomerData, Customer } from 'types';

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  const customersRaw = await db
    .knex()('customers')
    .select('id', 'name', 'phone_number', 'is_active')
    .orderBy('is_active', 'desc')
    .orderBy('name');

  const customers: Customer[] = [];
  for (let raw of customersRaw) {
    customers.push({
      id: raw.id,
      name: raw.name,
      phoneNumber: raw.phone_number,
      isActive: raw.is_active
    });
  }
  return customers;
}

// Create customer
export async function createCustomer(
  createCustomerData: CreateCustomerData
): Promise<Customer> {
  const { name, phoneNumber } = createCustomerData;
  const [customerRaw] = await db
    .knex()('customers')
    .insert({
      name,
      phone_number: phoneNumber
    })
    .returning('*');

  return {
    id: customerRaw.id,
    name: customerRaw.name,
    phoneNumber: customerRaw.phone_number,
    isActive: customerRaw.isActive
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
  }
  return {
    id: customerRaw.id,
    name: customerRaw.name,
    phoneNumber: customerRaw.phone_number,
    isActive: customerRaw.is_active
  };
}

// Update a single customer
export async function updateCustomer(
  id: number,
  updateCustomerData: Customer
): Promise<Customer> {
  const [customerRaw] = await db
    .knex()('customers')
    .update({
      name: updateCustomerData.name,
      phone_number: updateCustomerData.phoneNumber,
      is_active: updateCustomerData.isActive,
      updated_at: new Date()
    })
    .where({ id })
    .returning('*');

  //TODO handle specific case where customer id doesn't exist
  if (!customerRaw) {
    throw new Error('Error updating customer');
  }
  return {
    id: customerRaw.id,
    name: customerRaw.name,
    phoneNumber: customerRaw.phone_number,
    isActive: customerRaw.is_active
  };
}

// Delete a customer
// Set is_active to false
export async function deleteCustomer(id: number): Promise<Customer> {
  const [customerRaw] = await db
    .knex()('customers')
    .update({
      is_active: false,
      updated_at: new Date()
    })
    .where({ id })
    .returning('*');

  //TODO handle specific case where customer id doesn't exist
  if (!customerRaw) {
    throw new Error('Error deleting customer');
  }
  return {
    id: customerRaw.id,
    name: customerRaw.name,
    phoneNumber: customerRaw.phone_number,
    isActive: customerRaw.is_active
  };
}

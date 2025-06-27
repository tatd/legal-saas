import db from 'db';

export type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

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

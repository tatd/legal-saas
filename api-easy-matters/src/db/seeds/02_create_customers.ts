import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('customers').del();

  // Inserts seed entries
  await knex('customers').insert([
    { name: 'Abby', phone_number: '1111111111' },
    { name: 'Gaba', phone_number: '2222222222' }
  ]);
}

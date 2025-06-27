import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('matters').del();

  // Reset auto-increment counter
  await knex.raw('ALTER SEQUENCE matters_id_seq RESTART WITH 1');

  // Inserts seed entries
  await knex('matters').insert([
    {
      name: 'Abby vs squirrel',
      description: 'Abby chased a squirrel',
      customer_id: 1
    },
    {
      name: 'Abby vs yappy dog',
      description: 'Yappy dog barked at Abby',
      customer_id: 1
    },
    {
      name: 'Gaba vs plant',
      description: 'Gaba chewed on plant leaves',
      customer_id: 2
    }
  ]);
}

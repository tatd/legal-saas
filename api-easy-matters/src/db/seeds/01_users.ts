import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Hash passwords
  const saltRounds = 10;
  const password1 = await bcrypt.hash('password1', saltRounds);
  const password2 = await bcrypt.hash('password2', saltRounds);

  // Inserts seed entries
  return knex('users').insert([
    {
      email: 'dennis@sample.com',
      firm_name: 'Dennis Law',
      password_hash: password1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'clara@sample.com',
      firm_name: 'Clara Law',
      password_hash: password2,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('matters', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.integer('customer_id').notNullable().unsigned().references('id').inTable('customers').onDelete('CASCADE');
    table.timestamps(true, true);
    
    // Add index for better query performance
    table.index(['customer_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('matters');
}

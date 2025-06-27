import db from 'db';
import { CreateMatterData, Matter } from 'types';

// Create a matter for a customer
export async function createMatter(
  createMatterData: CreateMatterData
): Promise<Matter> {
  const { name, description, customerId } = createMatterData;
  const [matterRaw] = await db
    .knex()('matters')
    .insert({
      name,
      description,
      customer_id: customerId
    })
    .returning('*');

  return {
    id: matterRaw.id,
    name: matterRaw.name,
    description: matterRaw.description,
    customerId: matterRaw.customer_id,
    createdAt: matterRaw.created_at
  };
}

// Get matters for a customer
export async function getMatters(customerId: number): Promise<Matter[]> {
  const mattersRaw = await db
    .knex()('matters')
    .select('id', 'name', 'description', 'customer_id', 'created_at')
    .orderBy('created_at');

  const matters = [];
  for (let raw of mattersRaw) {
    matters.push({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      customerId: raw.customer_id,
      createdAt: raw.created_at
    });
  }
  return matters;
}

import { Knex, knex } from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

if (!config) {
  throw new Error(`No Knex configuration found for environment: ${environment}`);
}

let _knex: Knex | null = null;
let _initialized = false;

function getKnex(): Knex {
  if (!_knex) {
    throw new Error('Database not initialized');
  }
  return _knex;
}

async function initialize(): Promise<void> {
  if (_initialized) return;
  
  try {
    _knex = knex(config);
    await _knex.raw('SELECT 1');
    _initialized = true;
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}

async function close(): Promise<void> {
  if (_knex) {
    await _knex.destroy();
    _knex = null;
    _initialized = false;
    console.log('Database connection closed');
  }
}

// Migration functions
async function migrateLatest(): Promise<void> {
  try {
    await initialize();
    await getKnex().migrate.latest();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function migrateRollback(): Promise<void> {
  try {
    await initialize();
    await getKnex().migrate.rollback();
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}

export default {
  knex: getKnex,
  initialize,
  close,
  migrateLatest,
  migrateRollback
};

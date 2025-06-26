import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

if (!config) {
  throw new Error(`No Knex configuration found for environment: ${environment}`);
}

class Database {
  private static instance: Database;
  private _knex: Knex;
  private _initialized: boolean = false;

  private constructor() {
    this._knex = knex(config);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public get knex(): Knex {
    if (!this._knex) {
      throw new Error('Database not initialized');
    }
    return this._knex;
  }

  public async initialize(): Promise<void> {
    if (this._initialized) return;
    
    try {
      await this._knex.raw('SELECT 1');
      this._initialized = true;
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this._knex) {
      await this._knex.destroy();
      this._initialized = false;
      console.log('Database connection closed');
    }
  }

  public async migrateLatest(): Promise<void> {
    try {
      await this.initialize();
      await this._knex.migrate.latest();
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  public async migrateRollback(): Promise<void> {
    try {
      await this.initialize();
      await this._knex.migrate.rollback();
      console.log('Rollback completed successfully');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}

const db = Database.getInstance();

export default db;

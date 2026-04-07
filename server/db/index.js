import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query:', { text: text.slice(0, 80), duration, rows: result.rowCount });
    }
    return result;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const release = client.release.bind(client);

  client.query = async (text, params) => {
    try {
      return await originalQuery(text, params);
    } catch (err) {
      console.error('Client query error:', err.message);
      throw err;
    }
  };

  client.release = () => {
    release();
  };

  return client;
};

export const initDb = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const schemaPath = join(__dirname, 'schema.sql');

  try {
    const schema = readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database schema:', err.message);
    throw err;
  }
};

export default pool;

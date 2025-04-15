import knex from 'knex';
import pg from 'pg';

// Prevent numeric fields from being returned as strings
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => parseInt(value, 10));
pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => parseFloat(value));
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => parseFloat(value));

// Prevent date fields from being converted to local timezone
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value: string) => value);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (value: string) => value);

// For development mode, use a different configuration with shorter timeouts
// and appropriate pool settings to avoid connection pool exhaustion
const isDevelopment = process.env.NODE_ENV !== 'production';

// For Next.js, ensure we don't create multiple connections in development
let cachedConnection: any = null;

// Check if we're in a browser environment (client-side)
const isBrowser = typeof window !== 'undefined';

const getDbConnection = () => {
  // Skip DB connection in browser environment
  if (isBrowser) {
    return null;
  }
  
  // Return cached connection if it exists
  if (cachedConnection) {
    return cachedConnection;
  }

  // Create a PostgreSQL Knex instance with appropriate settings for the environment
  const connection = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'kanban',
      // Shorter connection acquisition timeout for development
      ...(isDevelopment && { 
        acquireConnectionTimeout: 5000,
      }),
    },
    pool: {
      min: isDevelopment ? 0 : 2, // In dev, start with 0 connections
      max: isDevelopment ? 5 : 10, // Fewer max connections in development
      // Return connections to pool faster in development
      ...(isDevelopment && {
        idleTimeoutMillis: 10000, // Reduce idle timeout in development
        acquireTimeoutMillis: 5000, // Shorter acquisition timeout in development
        reapIntervalMillis: 5000, // Check for idle connections more frequently in development
      }),
      // Properly close idle connections
      afterCreate: (conn: any, done: Function) => {
        conn.on('error', (err: Error) => {
          console.error('Database connection error:', err);
        });
        done(null, conn);
      },
    },
    // More verbose in development
    ...(isDevelopment && {
      debug: false, // Set to true for debugging SQL
    }),
  });

  // In development, add listeners for cleanup
  if (isDevelopment) {
    // For Next.js Fast Refresh
    if (typeof process !== 'undefined') {
      // Clean up connection on process termination
      process.once('SIGTERM', () => {
        if (cachedConnection) {
          cachedConnection.destroy();
          cachedConnection = null;
        }
      });

      process.once('SIGINT', () => {
        if (cachedConnection) {
          cachedConnection.destroy();
          cachedConnection = null;
        }
      });
    }
  }

  cachedConnection = connection;
  return connection;
};

const db = getDbConnection();

export default db; 
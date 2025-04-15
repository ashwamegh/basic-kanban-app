/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore knex dialect dependencies we don't use
    config.externals = [...(config.externals || []), 'oracledb', 'mssql', 'mysql', 'mysql2', 'sqlite3', 'better-sqlite3', 'tedious'];
    
    // Handle critical dependency warnings from Knex
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    
    // Additional optimization for Knex dynamic imports
    config.module.rules = [
      ...(config.module.rules || []),
      {
        test: /node_modules\/knex/,
        resolve: {
          alias: {
            fs: false,
            path: false,
          },
        },
      },
    ];
    
    return config;
  },
};

module.exports = nextConfig; 
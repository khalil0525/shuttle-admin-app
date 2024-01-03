const Sequelize = require('sequelize');
require('dotenv').config();

let db;

if (process.env.env === 'production' && process.env.DATABASE_URL) {
  // Production environment with DATABASE_URL
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Optionally turn off logging
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false, // Depends on your SSL setup, may need to be true
      },
    },
  });
} else {
  // Development environment or other non-production environments

  db = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Turning off logging
  });
}

module.exports = db;

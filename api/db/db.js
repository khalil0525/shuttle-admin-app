const Sequelize = require("sequelize");
require("dotenv").config();

const db =
  process.env.env === "development"
    ? new Sequelize({
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false, // Turning off logging
      })
    : new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging: false, // Turning off logging
        dialectOptions: {
          ssl: {
            require: false,
            rejectUnauthorized: false, // You might need to set this to true in production
          },
        },
      });

module.exports = db;

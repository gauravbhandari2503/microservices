const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "order_service_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "order_service_db",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;

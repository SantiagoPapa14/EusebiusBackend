const { Pool } = require("pg");
require("dotenv").config();
// Set up the connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

async function queryDatabase(sql, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } catch (err) {
    console.error("Error running query", err.stack);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  queryDatabase,
};

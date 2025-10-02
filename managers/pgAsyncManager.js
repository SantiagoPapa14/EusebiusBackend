const { Pool } = require("pg");
require("dotenv").config();

// Set up the connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool
  .connect()
  .then(async (client) => {
    try {
      console.log("Initializing database...");
      await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL
      );
    `);
      console.log("User Table Initialized");
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Word" (
          "id" SERIAL PRIMARY KEY,
          "userId" INT NOT NULL,
          "word" VARCHAR(255) NOT NULL,
          "definition" VARCHAR(255) NOT NULL
        );
      `);
      console.log("Word Table Initialized");
      console.log("Initialization Complete");
    } catch (err) {
      console.error("Error initializing database", err.stack);
      throw err;
    } finally {
      client.release();
    }
  })
  .catch((err) => console.error("Connection error", err.stack));

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

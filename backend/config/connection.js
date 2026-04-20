require('dotenv').config();
const mysql = require('mysql2');

// Direct DB credentials from environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use the promise API for easy async/await usage
const promisePool = pool.promise();

// Test DB connection and log success or error
promisePool.query('SELECT 1')
  .then(() => {
    console.log(' Successfully connected to the MySQL database.');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the MySQL database:', err.message);
  });

// Export the promise-based pool
module.exports = promisePool;

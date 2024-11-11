const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./eusebius.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  const message = "Welcome to the secret backend!";
  res.send(message);
});

app.listen(8000, () => {
  console.log(`Server is running at http://localhost:8000`);
});

module.exports = app;

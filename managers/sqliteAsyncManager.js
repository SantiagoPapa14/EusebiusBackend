const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./eusebius.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

const queryDatabase = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  queryDatabase,
};

const { queryDatabase } = require("../managers/sqliteAsyncManager");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  res.json({ message: "I have no clue who you are!!!" });
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await queryDatabase(
    "SELECT password FROM User WHERE email = ?",
    [email]
  );
  if (user[0].password === password) {
    res.json({ message: "Success!", token: "letsPretendThisIsARealToken" });
  } else {
    res.json({ message: "Incorrect password!!!" });
  }
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  await queryDatabase("INSERT INTO User (email, password) VALUES (?, ?)", [
    email,
    password,
  ]);
  res.json({ message: "Success!", token: "letsPretendThisIsARealToken" });
});

module.exports = router;

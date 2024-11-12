const { queryDatabase } = require("../managers/sqliteAsyncManager");
const { hash, compare } = require("bcrypt");

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
    "SELECT id, password FROM User WHERE email = ?",
    [email]
  );
  const match = await compare(password, user[0]?.password);
  if (match) {
    res.json({ message: "Success!", token: user[0].id });
  } else {
    res.json({ message: "Incorrect credentials." });
  }
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPass = await hash(password, 10);
  await queryDatabase("INSERT INTO User (email, password) VALUES (?, ?)", [
    email,
    hashedPass,
  ]);
  res.json({ message: "Success!", token: "letsPretendThisIsARealToken" });
});

module.exports = router;

const { queryDatabase } = require("../managers/pgAsyncManager");
const { generateToken } = require("../middleware/authware");
const { hash, compare } = require("bcrypt");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  res.json({ message: `Hi there ${req.userData.email}! You are logged in.` });
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.json({ message: "Missing email or password." });
    return;
  }
  const user = await queryDatabase(
    `SELECT "id", "password" FROM "User" WHERE "email" = $1`,
    [email]
  );
  if (user.length === 0) {
    res.json({ message: "User Not Found." });
    return;
  }
  const match = await compare(password, user[0]?.password);
  if (match) {
    res.json({ message: "Success!", token: generateToken(email, user[0].id) });
  } else {
    res.json({ message: "Incorrect credentials." });
  }
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.json({ message: "Missing email or password." });
    return;
  }
  const hashedPass = await hash(password, 10);
  const newUser = await queryDatabase(
    `INSERT INTO "User" (email, password) VALUES ($1, $2)`,
    [email, hashedPass]
  );
  res.json({
    message: "Success!",
    token: generateToken(email, newUser.insertId),
  });
});

module.exports = router;

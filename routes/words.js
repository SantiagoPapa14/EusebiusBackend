const { queryDatabase } = require("../managers/sqliteAsyncManager");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const id = req.headers.authorization.split(" ")[1];
    const words = await queryDatabase("SELECT * FROM Word WHERE userId = ?", [
      id,
    ]);
    res.json(words);
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/:word", async (req, res) => {
  try {
    const id = req.headers.authorization.split(" ")[1];
    const word = req.params.word;
    const definition = req.body.definition;
    await queryDatabase(
      "INSERT INTO Word (userId, word, definition) VALUES (?, ?, ?)",
      [id, word, definition]
    );
    res.json({ word, definition });
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.delete("/:word", async (req, res) => {
  try {
    const id = req.headers.authorization.split(" ")[1];
    const word = req.params.word;
    await queryDatabase("DELETE FROM Word WHERE word = ? AND userId = ?", [
      word,
      id,
    ]);
    res.json({ word });
  } catch (e) {
    res.json({ message: e.message });
  }
});

module.exports = router;

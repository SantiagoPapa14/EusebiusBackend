const { queryDatabase } = require("../managers/sqliteAsyncManager");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const words = await queryDatabase("SELECT * FROM Word");
  res.json(words);
});

router.post("/:word", async (req, res) => {
  const word = req.params.word;
  const definition = req.body.definition;
  await queryDatabase("INSERT INTO Word (word, definition) VALUES (?, ?)", [
    word,
    definition,
  ]);
  res.json({ word, definition });
});

router.delete("/:word", async (req, res) => {
  const word = req.params.word;
  await queryDatabase("DELETE FROM Word WHERE word = ?", [word]);
  res.json({ word });
});

module.exports = router;

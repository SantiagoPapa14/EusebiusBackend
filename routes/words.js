const { queryDatabase } = require("../managers/pgAsyncManager");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const words = await queryDatabase(
      `SELECT * FROM "Word" WHERE "userId" = $1`,
      [req.userData.id]
    );
    res.json(words);
  } catch (e) {
    console.log(e);
    res.json({ message: e.message });
  }
});

router.post("/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const definition = req.body.definition;
    await queryDatabase(
      `INSERT INTO "Word" ("userId", word, definition) VALUES ($1, $2, $3)`,
      [req.userData.id, word, definition]
    );
    res.json({ word, definition });
  } catch (e) {
    console.log(e);
    res.json({ message: e.message });
  }
});

router.delete("/:word", async (req, res) => {
  try {
    const word = req.params.word;
    await queryDatabase(
      `DELETE FROM "Word" WHERE "word" = $1 AND "userId" = $2`,
      [word, req.userData.id]
    );
    res.json({ word });
  } catch (e) {
    console.log(e);
    res.json({ message: e.message });
  }
});

module.exports = router;

const { getBookChapter } = require("../scripts/bibleLibrary");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/:bookName/:chapter", async (req, res) => {
  const { bookName, chapter } = req.params;
  const reading = await getBookChapter(bookName, chapter);
  res.json(reading);
});

module.exports = router;

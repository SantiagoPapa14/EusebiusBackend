const { getReadingByItself } = require("../scripts/readingScraper");
const { fetchVerses } = require("../scripts/bibleLibrary");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const readings = await getReadingByItself();
  res.json(readings);
});

router.get("/populated", async (req, res) => {
  const readings = await getReadingByItself();
  const { source, target } = req.query;
  await Promise.all(
    Object.entries(readings).map(async ([key, value]) => {
      if (value) {
        value.sourceContent = await fetchVerses(value, source);
        value.targetContent = await fetchVerses(value, target);
      }
      return [key, value];
    }),
  );
  res.json(readings);
});

module.exports = router;

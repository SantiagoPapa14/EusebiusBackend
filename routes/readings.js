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
  await Promise.all(
    Object.entries(readings).map(async ([key, value]) => {
      if (value) {
        value.latinContent = await fetchVerses(value, "Latin");
        value.englishContent = await fetchVerses(value, "English");
      }
      return [key, value];
    })
  );
  res.json(readings);
});

module.exports = router;

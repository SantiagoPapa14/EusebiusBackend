const { getReadingByItself } = require("../scripts/readingScraper");
const { fetchVerses } = require("../scripts/bibleLibrary");

const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const readings = await getReadingByItself();
  console.log(JSON.stringify(readings));
  res.json(readings);
});

router.get("/populated", async (req, res) => {
  const readings = await getReadingByItself();
  console.log(JSON.stringify(readings));
  res.json(readings);
});

module.exports = router;

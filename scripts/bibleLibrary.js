const { queryDatabase } = require("../managers/pgAsyncManager");

const fetchVerses = async (reading, language) => {
  if (!reading || reading.verses.length === 0) {
    return null;
  }

  const result = [];

  for (const verse of reading.verses) {
    const allRows = await queryDatabase(
      `SELECT * FROM "${language}Bible" WHERE "Book" = $1 AND "Chapter" = $2 AND "Verse" BETWEEN $3 AND $4`,
      [reading.book, verse.chapter, verse.start, verse.end]
    );
    result.push(...allRows);
  }

  return result;
};

const getBookChapter = async (book, chapter) => {
  const reading = {
    book: book,
    latinContent: [],
    englishContent: [],
  };

  const verses = await queryDatabase(
    `SELECT MIN("Verse") AS "start", MAX("Verse") AS "end" FROM "LatinBible" WHERE "Book" = $1 AND "Chapter" = $2`,
    [book, chapter]
  );
  reading.verses = [
    {
      chapter: chapter,
      start: verses[0].start,
      end: verses[0].end,
    },
  ];

  const latinContent = await fetchVerses(reading, "Latin");
  const englishContent = await fetchVerses(reading, "English");

  reading.latinContent = latinContent;
  reading.englishContent = englishContent;

  return reading;
};

module.exports = { fetchVerses, getBookChapter };

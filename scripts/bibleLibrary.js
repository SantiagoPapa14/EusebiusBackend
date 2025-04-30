const { queryDatabase } = require("../managers/pgAsyncManager");

const fetchVerses = async (reading, language) => {
  if (!reading || reading.verses.length === 0) {
    return null;
  }

  const result = [];

  for (const verse of reading.verses) {
    const allRows = await queryDatabase(
      `SELECT * FROM "${language}Bible" WHERE "Book" = $1 AND "Chapter" = $2 AND "Verse" BETWEEN $3 AND $4`,
      [reading.book, verse.chapter, verse.start, verse.end],
    );
    result.push(...allRows);
  }

  return result;
};

const getBookChapter = async (
  book,
  chapter,
  languages = { source: "English", target: "Latin" },
) => {
  const reading = {
    book: book,
    targetContent: [],
    sourceContent: [],
  };

  const verses = await queryDatabase(
    `SELECT MIN("Verse") AS "start", MAX("Verse") AS "end" FROM "LatinBible" WHERE "Book" = $1 AND "Chapter" = $2`,
    [book, chapter],
  );
  reading.verses = [
    {
      chapter: chapter,
      start: verses[0].start,
      end: verses[0].end,
    },
  ];

  const sourceContent = await fetchVerses(reading, languages.source);
  const targetContent = await fetchVerses(reading, languages.target);

  reading.sourceContent = sourceContent;
  reading.targetContent = targetContent;

  return reading;
};

module.exports = { fetchVerses, getBookChapter };

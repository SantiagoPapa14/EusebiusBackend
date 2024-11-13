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

module.exports = { fetchVerses };

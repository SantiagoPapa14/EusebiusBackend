const { queryDatabase } = require("../managers/sqliteAsyncManager");

const fetchVerses = async (reading, language) => {
  if (!reading || reading.verses.length === 0) {
    return null;
  }

  const result = [];

  for (const verse of reading.verses) {
    const allRows = await queryDatabase(
      `SELECT * FROM ${language}Bible WHERE book = ? AND chapter = ? AND verse BETWEEN ? AND ?`,
      [reading.book, verse.chapter, verse.start, verse.end]
    );
    result.push(...allRows);
  }

  return result;
};

module.exports = { fetchVerses };

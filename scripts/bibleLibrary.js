const { queryDatabase } = require("../managers/sqliteAsyncManager");

const fetchVerses = async (reading, language) => {
  const allRows = await queryDatabase(
    `SELECT * FROM ${language}Bible WHERE book = ? AND chapter = ? AND verse BETWEEN ? AND ?`,
    [reading.book, reading.chapter, reading.verses.start, reading.verses.end]
  );
  return allRows;
};

module.exports = { fetchVerses };

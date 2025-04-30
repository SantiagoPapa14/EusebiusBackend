const { queryDatabase } = require("../managers/pgAsyncManager");
const SpanishBible = require("../JsonBibles/sagradas.json");

var lastChapter = "Genesis";

const importBibleFunc = async () => {
  for (const verse of SpanishBible.verses) {
    await queryDatabase(
      `INSERT INTO "SpanishBible" ("Book", "Chapter", "Verse", "Content") VALUES ($1, $2, $3, $4)`,
      [verse.book_name, verse.chapter, verse.verse, verse.text],
    );
    if (verse.chapter !== lastChapter) {
      lastChapter = verse.chapter;
      console.log(`Done with:  ${verse.book_name} ${verse.chapter}`);
    }
  }
};

importBibleFunc().then(() => {
  console.log("Done");
});

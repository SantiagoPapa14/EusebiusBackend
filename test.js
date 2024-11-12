function parseBibleReference(reference) {
  const parsed = {
    book: "",
    verses: [],
  };
  const match = reference.match(/^([\w\s]+) (\d+:\d.*)$/);
  parsed.book = match[1];

  //Multiple verses in same chapter
  if (match[2].includes(",")) {
    const chapter = match[2].split(":")[0];
    const readings = match[2].split(":")[1].split(",");
    readings.forEach((reading) => {
      const [start, end] = reading.split("-");
      parsed["verses"].push({
        chapter: Number(chapter),
        start: Number(start),
        end: end ? Number(end) : Number(start),
      });
    });
  } else {
    const readings = match[2].split("-");
    if (readings[0].includes(":") && readings[1].includes(":")) {
      parsed["verses"].push({
        chapter: Number(readings[0].split(":")[0]),
        start: Number(readings[0].split(":")[1]),
        end: 999,
      });
      parsed["verses"].push({
        chapter: Number(readings[1].split(":")[0]),
        start: 1,
        end: Number(readings[0].split(":")[1]),
      });
    } else {
      parsed["verses"].push({
        chapter: Number(readings[0].split(":")[0]),
        start: Number(readings[0].split(":")[1]),
        end: Number(readings[1]),
      });
    }
  }

  return parsed;
}
// Example usage
const references = [
  "Titus 2:1-8, 11-14",
  "Philippians 3:17-4:1",
  "Genesis 28:11-18",
  "Psalms 37:3-4, 18, 23, 27, 29",
  "Luke 16:1-8",
  "First Kings 2:1-11",
  "3 John 1:1-4",
];

references.forEach((reference) => {
  console.log(JSON.stringify(parseBibleReference(reference), null, 1));
});

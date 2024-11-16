function parseReference(reference) {
  if (!reference) {
    return null;
  }
  const parsed = {
    book: "",
    verses: [],
  };
  const match = reference.match(/^([\w\s]+) (\d+:\d.*)$/);
  const book = match[1]
    .replaceAll("First", "1")
    .replaceAll("Second", "2")
    .replaceAll("Third", "3");
  parsed.book = book;

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

async function getReadingByItself() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const response = await fetch(
    `https://www.catholic.org/bible/daily_reading/?select_date=${year}-${month}-${day}`
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  const html = await response.text();
  const rawHtmlData = html
    .split(
      `<a href="https://catholicresources.education/pdf/daily-readings/" target="_blank" rel="noopener" title="Printable PDF of Today's Reading"><i class="fa fa-file-pdf-o" title="Printable PDF of Today's Reading" alt="Printable PDF icon"></i> Printable PDF of Today's Reading</a><br>
			<a href="/bible/daily_reading/archive.php"><i class="fa fa-calendar" title="Daily Readings Archive" alt="Calendar icon"></i> Past / Future Daily Readings</a>`
    )[0]
    .split(
      `<div class="col-md-6">
			<h4>Daily Reading for `
    )[1]
    .split(`</h4>\n`)[1];
  const result = {
    psalm: parseReference(
      rawHtmlData.split("Responsorial Psalm, <em>")[1].split("</em>")[0]
    ),
    gospel: parseReference(
      rawHtmlData.split("Gospel, <em>")[1].split("</em>")[0]
    ),
    firstReading: parseReference(
      rawHtmlData.split("Reading 1, <em>")[1].split("</em>")[0]
    ),
    secondReading: parseReference(
      rawHtmlData?.split("Reading 2, <em>")[1]?.split("</em>")[0]
    ),
  };
  return result;
}

module.exports = { getReadingByItself };

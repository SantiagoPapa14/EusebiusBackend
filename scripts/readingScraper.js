function parseReference(reference) {
  if (reference) {
    const regex = /(\d*\s*[A-Za-z]+\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/;
    const match = reference.match(regex);

    if (match) {
      return {
        book: match[1].trim().replace("First", "1").replace("Second", "2"),
        chapter: parseInt(match[2], 10),
        verses: {
          start: parseInt(match[3], 10),
          end: match[4] ? parseInt(match[4], 10) : parseInt(match[3], 10),
        },
      };
    }
  }
  return null;
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

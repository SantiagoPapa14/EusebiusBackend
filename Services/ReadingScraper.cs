namespace EusebiusBackend.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using EusebiusBackend.Models;

public class ReadingScraper
{
    private DailyMassScripture? _cachedReading = null;
    private DateTime? _cachedDate = null;

    public async Task<DailyMassScripture> GetScrapedScripture()
    {
        if (
            _cachedReading is not null
            && _cachedDate is not null
            && _cachedDate.Value.Date == DateTime.Now.Date
        )
        {
            return _cachedReading;
        }
        else
        {
            using var client = new HttpClient();

            DateTime date = DateTime.Now;
            string formatted = date.ToString("yyyyMMdd");

            string url = $"https://universalis.com/{formatted}/jsonpmass.js";
            var response = await client.GetStringAsync(url);

            _cachedReading = Parse(response);
            _cachedDate = date;

            return _cachedReading;
        }
    }

    public DailyMassScripture Parse(string universalisCallbackString)
    {
        // Extract JSON from the callback wrapper
        var jsonMatch = Regex.Match(
            universalisCallbackString,
            @"universalisCallback\((.*)\);?\s*$",
            RegexOptions.Singleline
        );
        if (!jsonMatch.Success)
        {
            throw new ArgumentException("Invalid universalisCallback format");
        }

        string jsonContent = jsonMatch.Groups[1].Value;

        // Parse JSON
        var doc = JsonDocument.Parse(jsonContent);
        var root = doc.RootElement;

        var scripture = new DailyMassScripture();

        // Parse First Reading (Mass_R1)
        if (root.TryGetProperty("Mass_R1", out var r1))
        {
            scripture.firstReading = ParseReading(r1);
        }

        // Parse Psalm (Mass_Ps)
        if (root.TryGetProperty("Mass_Ps", out var ps))
        {
            scripture.psalm = ParseReading(ps);
        }

        // Parse Second Reading (Mass_R2)
        if (root.TryGetProperty("Mass_R2", out var r2))
        {
            scripture.secondReading = ParseReading(r2);
        }

        // Parse Gospel (Mass_G)
        if (root.TryGetProperty("Mass_G", out var g))
        {
            scripture.gospel = ParseReading(g);
        }

        return scripture;
    }

    private Reading ParseReading(JsonElement element)
    {
        if (!element.TryGetProperty("source", out var sourceElement))
        {
            return null;
        }

        string source = sourceElement.GetString()!;

        if (string.IsNullOrWhiteSpace(source))
        {
            return null;
        }

        // Decode HTML entities and strip HTML tags
        source = CleanHtmlString(source);

        var reading = new Reading();
        var extracts = ParseSource(source);

        if (extracts.Length > 0)
        {
            reading.book = BookParser.GetCode(extracts[0].Book);
            reading.extracts = extracts
                .Select(e => new BookExtract { chapter = e.Chapter, verses = e.Verses })
                .ToArray();
        }

        return reading;
    }

    private string CleanHtmlString(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return input;

        // Decode HTML entities
        string decoded = WebUtility.HtmlDecode(input);

        // Remove HTML tags
        decoded = Regex.Replace(decoded, @"<[^>]+>", "");

        // Normalize whitespace
        decoded = Regex.Replace(decoded, @"\s+", " ").Trim();

        return decoded;
    }

    private (string Book, string Chapter, VerseRange Verses)[] ParseSource(string source)
    {
        var results = new List<(string, string, VerseRange)>();

        // Remove parenthetical references like (94) in "Ps 95(94):1‐2"
        source = Regex.Replace(source, @"\([^)]+\)", "");

        // Split by comma for multiple references
        var parts = source.Split(',');

        string currentBook = null;
        string currentChapter = null;

        foreach (var part in parts)
        {
            var trimmedPart = part.Trim();

            // Pattern: Book Chapter:Verses (e.g., "Habakkuk 1:2‐3")
            var fullMatch = Regex.Match(trimmedPart, @"^([A-Za-z0-9\s]+?)\s+(\d+):(.+)$");
            if (fullMatch.Success)
            {
                currentBook = fullMatch.Groups[1].Value.Trim();
                currentChapter = fullMatch.Groups[2].Value;
                var verses = ParseVerses(fullMatch.Groups[3].Value);
                results.Add((currentBook, currentChapter, verses));
                continue;
            }

            // Pattern: Chapter:Verses only (e.g., "2:2‐4")
            var chapterMatch = Regex.Match(trimmedPart, @"^(\d+):(.+)$");
            if (chapterMatch.Success && currentBook != null)
            {
                currentChapter = chapterMatch.Groups[1].Value;
                var verses = ParseVerses(chapterMatch.Groups[2].Value);
                results.Add((currentBook, currentChapter, verses));
                continue;
            }

            // Pattern: Verses only (e.g., "6‐7b" or "7c‐9")
            var versesOnlyMatch = Regex.Match(trimmedPart, @"^(.+)$");
            if (versesOnlyMatch.Success && currentBook != null && currentChapter != null)
            {
                var verses = ParseVerses(versesOnlyMatch.Groups[1].Value);
                results.Add((currentBook, currentChapter, verses));
            }
        }

        return results.ToArray();
    }

    private VerseRange ParseVerses(string versesString)
    {
        var separators = new[] { "‐", "-", "–", "—" };

        foreach (var sep in separators)
        {
            if (versesString.Contains(sep))
            {
                var parts = versesString.Split(new[] { sep }, 2, StringSplitOptions.None);
                return new VerseRange { Start = parts[0].Trim(), End = parts[1].Trim() };
            }
        }

        // Single verse
        return new VerseRange { Start = versesString.Trim(), End = versesString.Trim() };
    }
}

public static class BookParser
{
    private static readonly Dictionary<string, string> BibleBooksToCode = new Dictionary<
        string,
        string
    >(StringComparer.OrdinalIgnoreCase)
    {
        // Old Testament
        { "Genesis", "GEN" },
        { "Exodus", "EXO" },
        { "Leviticus", "LEV" },
        { "Numbers", "NUM" },
        { "Deuteronomy", "DEU" },
        { "Joshua", "JOS" },
        { "Judges", "JDG" },
        { "Ruth", "RUT" },
        { "1 Samuel", "1SA" },
        { "2 Samuel", "2SA" },
        { "1 Kings", "1KI" },
        { "2 Kings", "2KI" },
        { "1 Chronicles", "1CH" },
        { "2 Chronicles", "2CH" },
        { "Ezra", "EZR" },
        { "Nehemiah", "NEH" },
        { "Tobit", "TOB" },
        { "Judith", "JDT" },
        { "Esther", "EST" },
        { "1 Maccabees", "1MA" },
        { "2 Maccabees", "2MA" },
        { "Job", "JOB" },
        { "Psalms", "PSA" },
        { "Psalm", "PSA" },
        { "Proverbs", "PRO" },
        { "Ecclesiastes", "ECC" },
        { "Song of Solomon", "SNG" },
        { "Wisdom", "WIS" },
        { "Sirach", "SIR" },
        { "Isaiah", "ISA" },
        { "Jeremiah", "JER" },
        { "Lamentations", "LAM" },
        { "Baruch", "BAR" },
        { "Ezekiel", "EZK" },
        { "Daniel", "DAN" },
        { "Hosea", "HOS" },
        { "Joel", "JOL" },
        { "Amos", "AMO" },
        { "Obadiah", "OBA" },
        { "Jonah", "JON" },
        { "Micah", "MIC" },
        { "Nahum", "NAM" },
        { "Habakkuk", "HAB" },
        { "Zephaniah", "ZEP" },
        { "Haggai", "HAG" },
        { "Zechariah", "ZEC" },
        { "Malachi", "MAL" },
        // New Testament
        { "Matthew", "MAT" },
        { "Mark", "MRK" },
        { "Luke", "LUK" },
        { "John", "JHN" },
        { "Acts", "ACT" },
        { "Romans", "ROM" },
        { "1 Corinthians", "1CO" },
        { "2 Corinthians", "2CO" },
        { "Galatians", "GAL" },
        { "Ephesians", "EPH" },
        { "Philippians", "PHP" },
        { "Colossians", "COL" },
        { "1 Thessalonians", "1TH" },
        { "2 Thessalonians", "2TH" },
        { "1 Timothy", "1TI" },
        { "2 Timothy", "2TI" },
        { "Titus", "TIT" },
        { "Philemon", "PHM" },
        { "Hebrews", "HEB" },
        { "James", "JAS" },
        { "1 Peter", "1PE" },
        { "2 Peter", "2PE" },
        { "1 John", "1JN" },
        { "2 John", "2JN" },
        { "3 John", "3JN" },
        { "Jude", "JUD" },
        { "Revelation", "REV" },
    };

    public static string GetCode(string bookName)
    {
        if (BibleBooksToCode.TryGetValue(bookName.Trim(), out string code))
        {
            return code;
        }

        throw new ArgumentException($"Book '{bookName}' not found in the Bible dictionary.");
    }
}

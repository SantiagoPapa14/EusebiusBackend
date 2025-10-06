namespace EusebiusBackend.Models;

public class DailyMassScripture
{
    public Reading? psalm { get; set; }
    public Reading? gospel { get; set; }
    public Reading? firstReading { get; set; }
    public Reading? secondReading { get; set; }
}

public class Reading
{
    public string? book { get; set; }
    public BookExtract[]? extracts { get; set; }
}

public class BookExtract
{
    public string? chapter { get; set; }
    public VerseRange? verses { get; set; }
}

public class VerseRange
{
    public string Start { get; set; } = string.Empty;
    public string End { get; set; } = string.Empty;
}

namespace EusebiusBackend.Controllers;

using EusebiusBackend.Models;
using EusebiusBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class ReadingController : ControllerBase
{
    private ReadingScraper ReadingScraper = new ReadingScraper();

    // GET: api/Reading/all
    [HttpGet("all")]
    public async Task<ActionResult<DailyMassScripture>> GetDailyScripture()
    {
        DailyMassScripture scripture = await ReadingScraper.GetScrapedScripture();
        return Ok(scripture);
    }

    // GET: api/Reading/all
    [HttpGet("{reading}")]
    public async Task<ActionResult<DailyMassScripture>> GetSpecificDailyReading(string reading)
    {
        DailyMassScripture scripture = await ReadingScraper.GetScrapedScripture();
        switch (reading)
        {
            case "psalm":
                return Ok(scripture!.psalm);
            case "gospel":
                return Ok(scripture!.gospel);
            case "first":
                return Ok(scripture!.gospel);
            case "second":
                if (scripture!.secondReading != null)
                    return Ok(scripture!.secondReading);
                else
                    return NotFound();
            default:
                return BadRequest("Invalid reading");
        }
    }
}

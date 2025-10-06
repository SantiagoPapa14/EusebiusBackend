namespace EusebiusBackend.Controllers;

using System.Security.Claims;
using EusebiusBackend.Data;
using EusebiusBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class WordController : ControllerBase
{
    private readonly AppDbContext _context;

    public WordController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Word/all
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Word>>> GetWordsByUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var words = await _context.Words.Where(w => w.UserId == userId).ToListAsync();

        return Ok(words);
    }

    // POST: api/Word
    [HttpPost]
    public async Task<ActionResult<Word>> AddWord([FromBody] Word word)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        word.UserId = userId!;
        _context.Words.Add(word);
        await _context.SaveChangesAsync();
        return Ok(word);
    }

    // PUT: api/Word
    [HttpPut]
    public async Task<ActionResult<Word>> UpdateWord([FromBody] Word word)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        word.UserId = userId!;
        _context.Words.Update(word);
        await _context.SaveChangesAsync();
        return Ok(word);
    }

    // DELETE: api/Word
    [HttpDelete]
    public async Task<ActionResult<Word>> DeleteWord([FromBody] Word word)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        word.UserId = userId!;
        _context.Words.Remove(word);
        await _context.SaveChangesAsync();
        return Ok(word);
    }
}

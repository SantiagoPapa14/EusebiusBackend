using System.Text;
using EusebiusBackend.Data;
using EusebiusBackend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Use the database
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

if (string.IsNullOrWhiteSpace(connectionString))
    throw new Exception(
        "No connection string found. Set DB_CONNECTION_STRING in Azure App Service!"
    );

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// Add Identity
builder
    .Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JWT configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER");

if (string.IsNullOrWhiteSpace(jwtKey) || string.IsNullOrWhiteSpace(jwtIssuer))
    throw new Exception("JWT_KEY or JWT_ISSUER missing! Set them in Azure App Service.");

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey ?? string.Empty)
            ),
        };
    });

// Use controllers
builder.Services.AddControllers();

// Automatically generate OpenAPI
builder.Services.AddOpenApi();

// Build the app
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

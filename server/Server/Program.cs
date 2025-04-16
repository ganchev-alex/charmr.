using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Server.DataAccess.Database;
using Server.DataAccess.Repository;
using Server.Services.Abstraction;
using Server.Services.Implementation;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Server.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Services Registration
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<DataSeeder>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();

builder.Services.AddSingleton<PresenceTracker>();

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;

});

builder.Services.AddControllers();
builder.Services.AddCors();
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JwtSettings:TokenKey"))),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
    });

// Swagger Base Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Data Seeding
using (var scope = app.Services.CreateScope())
{
    var dataSeeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await dataSeeder.SeedDataAsync();
}

// HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(origin => true));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<PresenceHub>("/api/hubs/presence");
app.MapHub<MessageHub>("/api/hubs/message");

app.Run();

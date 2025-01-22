using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Portaria.Data;
using Portaria.Services;
using System.Text;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<PortariaDbContext>(options => options.UseMySql(
        connectionString,
        ServerVersion.Parse("8.0.40")
    )
);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var chave = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("Chave").Get<String>());

builder.Services.AddAuthentication(
    x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
).AddJwtBearer(
    x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(chave),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    }
);

builder.Services.AddScoped<UsuarioLoginService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAll", 
        policy =>
        {
            policy.WithOrigins("https://localhost:7063","http://localhost:5118","https://localhost:7063/swagger/index.html")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "weather api"));
}

var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "FrontEnd");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath),
    RequestPath = "/frontend"
});

app.UseCors("AllowAll");

app.UseHttpsRedirection();


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
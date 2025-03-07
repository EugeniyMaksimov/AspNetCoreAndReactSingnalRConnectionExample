using SignalRAuthBack;
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000");
                          policy.WithMethods("GET", "POST");
                          policy.AllowCredentials();
                          policy.AllowAnyHeader(); // make shure you have added this line
                      });
});


builder.Services.AddControllers(); 
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

var app = builder.Build();

app.UseAuthentication();

// Make sure you have added this line in your project
app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();
app.MapHub<SignalRHub>("/SignalRHub");

app.Run();

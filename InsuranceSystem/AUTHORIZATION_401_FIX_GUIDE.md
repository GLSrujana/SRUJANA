# 401 Unauthorized Error Fix Guide

## Issues Fixed

### 1. **Middleware Pipeline Order** ?
**Problem:** CORS and Authentication middleware were in the wrong order.

**Before (WRONG):**
```csharp
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngularFrontend");  // ? After routing
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**After (CORRECT):**
```csharp
app.UseHttpsRedirection();
app.UseCors("AllowAngularFrontend");   // ? Before routing
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**Why this matters:** ASP.NET Core processes middleware in order. CORS must be checked BEFORE routing to properly handle preflight requests.

---

## Verification Checklist

### ? JWT Token Configuration
Verify in `appsettings.json`:
```json
"Jwt": {
  "Key": "THIS_IS_A_DEMO_SECRET_KEY_CHANGE_IT_1234567890",  // At least 32 chars
  "Issuer": "Insurance.API",
  "Audience": "Insurance.Client",
  "ExpiryMinutes": 60
}
```

### ? Role Configuration in Program.cs
Verify JWT settings:
```csharp
options.TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSection["Issuer"],
    ValidAudience = jwtSection["Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key),
    RoleClaimType = ClaimTypes.Role,           // ? Critical
    NameClaimType = ClaimTypes.NameIdentifier, // ? Critical
    ClockSkew = TimeSpan.Zero
};
```

### ? CORS Configuration
Verify in `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
```

### ? JWT Token Generation
Verify in `JwtTokenGenerator.cs`:
```csharp
var claims = new List<JwtClaim>{
    new JwtClaim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new JwtClaim(JwtRegisteredClaimNames.Email, user.Email),
    new JwtClaim(ClaimTypes.Name, user.FullName),
    new JwtClaim(ClaimTypes.Role, roleName),              // ? Role is included
    new JwtClaim(ClaimTypes.NameIdentifier, user.Id.ToString())
};
```

### ? Authorization Attribute
Verify in `ActivePoliciesController.cs`:
```csharp
[Authorize(Roles = "Customer")]
[HttpGet("customer-active-policies")]
public async Task<IActionResult> MyPolicies()
{
    var customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var result = await _service.GetMyPoliciesAsync(customerId);
    return Ok(result);
}
```

---

## Testing Steps

### 1. **Clear Browser Cache & LocalStorage**
Open DevTools (F12) ? Application ? Clear all data

### 2. **Test Registration**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Test Customer",
  "email": "customer@test.com",
  "password": "Test@123456"
}
```

**Expected Response:**
```json
{
  "userId": 1,
  "fullName": "Test Customer",
  "email": "customer@test.com",
  "role": "Customer",
  "token": "eyJhbGc...",
  "expiresAtUtc": "2025-02-28T15:30:00Z"
}
```

### 3. **Test Active Policies Endpoint**
```bash
GET /api/active-policies/customer-active-policies
Authorization: Bearer {token_from_registration}
```

**Expected:** ? 200 OK (or 200 with empty array if no policies exist)

**If you get 401:** Check the `token` value is complete and not truncated.

---

## Common 401 Causes & Solutions

| Cause | Solution |
|-------|----------|
| **Missing Authorization header** | Add: `Authorization: Bearer {token}` |
| **Invalid role in token** | Verify role is "Customer", "Admin", "Agent", or "ClaimsOfficer" (case-sensitive) |
| **Token expired** | Re-register or re-login to get new token |
| **CORS blocking requests** | Check browser console for CORS errors; verify origin in appsettings |
| **Middleware order wrong** | Use correct order: CORS ? Routing ? Auth ? Authz |
| **Role mismatch** | Endpoint requires `[Authorize(Roles = "Customer")]` but token has different role |
| **Claims not included** | Verify `JwtTokenGenerator` includes `ClaimTypes.Role` |

---

## Debug Steps

### Step 1: Check Token Contents
Use https://jwt.io and paste your token:
- Verify `role` claim exists and matches endpoint requirement
- Verify `sub` (user ID) is present
- Verify expiration (`exp`) is in the future

### Step 2: Enable Detailed Logging
Add to `appsettings.json`:
```json
"Logging": {
  "LogLevel": {
    "Default": "Information",
    "Microsoft.AspNetCore.Authentication": "Debug",
    "Microsoft.AspNetCore.Authorization": "Debug"
  }
}
```

Check Visual Studio Output window for auth details.

### Step 3: Test with Swagger/Postman
1. Get a valid token from `/api/auth/login`
2. Click ?? (Authorize) button in Swagger
3. Enter: `Bearer {your_token}`
4. Try the endpoint

### Step 4: Check Database
Verify user exists with correct role:
```sql
SELECT u.Id, u.FullName, u.Email, r.Name as Role, u.IsActive
FROM Users u
INNER JOIN Roles r ON u.RoleId = r.Id
WHERE u.Email = 'customer@test.com'
```

---

## Files Modified
- ? `Insurance.API\Program.cs` - Fixed middleware order

## Build Status
? **Successful** - No compilation errors

## Next Steps
1. Stop and restart the application (hot reload may not pick up middleware changes)
2. Clear browser cache and LocalStorage
3. Register a new user or login
4. Test the protected endpoints
5. Check browser DevTools Network tab for response headers

---

## Additional Resources
- [ASP.NET Core Middleware](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware)
- [CORS in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [JWT Bearer Authentication](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn)

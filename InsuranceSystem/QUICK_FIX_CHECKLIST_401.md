# Quick Troubleshooting Checklist for 401 Errors

## ?? Getting 401 Unauthorized? Follow This Guide

### Step 1: Verify Application is Restarted
- [ ] Stopped the running application
- [ ] Restarted it fresh (hot reload doesn't apply middleware changes)
- [ ] Swagger is loading properly at `https://localhost:7xxx/swagger`

### Step 2: Clear Browser State
- [ ] Opened DevTools (F12)
- [ ] Went to Application ? Storage
- [ ] Cleared LocalStorage
- [ ] Cleared SessionStorage
- [ ] Cleared Cookies
- [ ] Closed and reopened the tab

### Step 3: Get a Valid Token
Execute this in Swagger:
```
POST /api/auth/login

{
  "email": "your-email@test.com",
  "password": "your-password"
}
```

? Got a response with a `token` field? Continue.
? Got an error? Your credentials are wrong or user doesn't exist.

### Step 4: Verify Token Contents
1. Go to https://jwt.io
2. Paste your token in the "Encoded" field
3. Check "Decoded" section:
   - [ ] `role` claim exists and says "Customer" (or your role)
   - [ ] `sub` or `nameid` claim exists with your user ID
   - [ ] `exp` (expiration) is a future date
   - [ ] No red signature error at bottom

? Missing role claim? Your `JwtTokenGenerator` has a bug.
? Wrong role value? Database role assignment is wrong.

### Step 5: Test Authorization Endpoint
In Swagger, click the ?? Authorize button:
- [ ] Enter: `Bearer {your_token_from_step_3}`
- [ ] Click Authorize

Try this endpoint:
```
GET /api/debug/claims
```

? **Expected Response:**
```json
{
  "isAuthenticated": true,
  "roleFromClaim": "Customer",
  "userIdFromClaim": "1"
}
```

? **Got 401?** Check your token format - it must be `Bearer {token}` with a space.

### Step 6: Test Your Protected Endpoint
Now try your actual endpoint:
```
GET /api/active-policies/customer-active-policies
```

? Got 200 OK? **Authorization is working!** You're done.
? Still 401? Go to Step 7.

---

## Step 7: Deep Dive Debugging

### Check Database
```sql
-- Verify roles exist
SELECT * FROM Roles
WHERE Name IN ('Customer', 'Admin', 'Agent', 'ClaimsOfficer')

-- Verify your user has a role
SELECT u.*, r.Name as RoleName
FROM Users u
LEFT JOIN Roles r ON u.RoleId = r.Id
WHERE u.Email = 'your-email@test.com'
```

? **Problem:** Role not found or user has NULL RoleId
? **Fix:** Insert role if missing or update user's RoleId

### Check JWT Configuration
In `appsettings.json`, verify:
```json
"Jwt": {
  "Key": "THIS_IS_A_DEMO_SECRET_KEY_CHANGE_IT_1234567890",  // Exactly matches Program.cs
  "Issuer": "Insurance.API",                                 // Exactly matches Program.cs
  "Audience": "Insurance.Client",                            // Exactly matches Program.cs
  "ExpiryMinutes": 60
}
```

? **Problem:** Key, Issuer, or Audience doesn't match
? **Fix:** Update to exact values in both files

### Check Middleware Order
In `Program.cs`, confirm this exact order:
```csharp
app.UseHttpsRedirection();
app.UseCors("AllowAngularFrontend");  // ? CORS FIRST
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

? **Problem:** CORS is after UseRouting()
? **Fix:** Move CORS line before UseRouting()

### Check CORS Policy
In `Program.cs`, verify:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")  // Your frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();  // ? Important
        });
});
```

? **Problem:** AllowCredentials() missing or wrong origin
? **Fix:** Add AllowCredentials() and verify origin URL

---

## Common Issues & Quick Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 after login | Token expired | Get new token via login |
| 401 always | Missing auth header | Add `Authorization: Bearer {token}` |
| 401 always | Wrong token format | Format must be `Bearer {token}` with space |
| 401 always | Middleware order wrong | Move CORS before UseRouting() |
| 401 always | Role not in token | Check JwtTokenGenerator includes role |
| 403 Forbidden | Wrong role for endpoint | User has role A but endpoint needs role B |
| CORS error | CORS policy wrong | Check origins, AllowCredentials(), AllowAnyHeader() |
| CORS error | CORS called after routing | Move UseCors() before UseRouting() |

---

## Quick Test Commands

### Using PowerShell/Terminal

**Login:**
```powershell
$response = Invoke-WebRequest -Uri "https://localhost:7000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"customer@test.com","password":"Test@123456"}' `
  -SkipCertificateCheck

$token = $response.Content | ConvertFrom-Json | Select-Object -ExpandProperty token
echo "Token: $token"
```

**Test Protected Endpoint:**
```powershell
Invoke-WebRequest -Uri "https://localhost:7000/api/active-policies/customer-active-policies" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"} `
  -SkipCertificateCheck | Select-Object -ExpandProperty Content
```

### Using cURL

**Login:**
```bash
curl -X POST https://localhost:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"Test@123456"}' \
  --insecure
```

**Test Endpoint:**
```bash
curl -X GET https://localhost:7000/api/active-policies/customer-active-policies \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  --insecure
```

---

## ?? Key Points to Remember

1. **Middleware order is CRITICAL** - Especially CORS before routing
2. **Always restart** - Hot reload doesn't apply middleware changes
3. **Token format matters** - Must be `Bearer {token}` with space
4. **Role must exist** - In both database AND token claims
5. **Case-sensitive** - "Customer" ? "customer"
6. **Expiration matters** - Check token isn't expired via jwt.io
7. **Test endpoint first** - Use `/api/debug/claims` to verify token is valid

---

## ? Success Indicators

- ? Swagger shows endpoint without ?? lock when not authorized
- ? After clicking Authorize and adding token, endpoints work
- ? `/api/debug/claims` returns isAuthenticated: true
- ? Protected endpoint returns 200 OK with data
- ? Wrong role returns 403 Forbidden (not 401)

---

## ?? Still Stuck?

1. Check the `SOLUTION_SUMMARY_401_ERROR.md` file
2. Check the `AUTHORIZATION_401_FIX_GUIDE.md` file
3. Verify all files match the provided configurations
4. Check Visual Studio Output window for authentication logs
5. Try the debug endpoints to isolate the issue

**Good luck! ??**

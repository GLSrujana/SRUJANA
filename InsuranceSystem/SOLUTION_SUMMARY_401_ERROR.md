# 401 Unauthorized Error - Root Cause & Solution

## ?? Root Cause Identified

The **middleware pipeline order** in `Program.cs` was incorrect. CORS middleware was applied AFTER `UseRouting()`, which caused CORS preflight requests to fail before authentication could process them properly.

---

## ? Solution Applied

### Changed File: `Insurance.API\Program.cs`

**Incorrect Order (Before):**
```csharp
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngularFrontend");  // ? Wrong position
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**Correct Order (After):**
```csharp
app.UseHttpsRedirection();
app.UseCors("AllowAngularFrontend");   // ? Correct - Before routing
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

---

## ?? Why This Fixes 401 Errors

1. **CORS Preflight Requests** - Browser sends `OPTIONS` request before actual request
2. **Middleware Order** - ASP.NET Core processes middleware sequentially
3. **Correct Flow:**
   - Request arrives
   - CORS check first (allow/deny cross-origin)
   - Then routing
   - Then authentication (validate JWT)
   - Then authorization (check roles)
4. **What was wrong:** CORS was checked AFTER routing, so preflight failed silently

---

## ??? Additional Troubleshooting Tools

### New Debug Controller Created
`Insurance.API\Controllers\DebugController.cs`

**Available debug endpoints:**
- `GET /api/debug/claims` - View all JWT claims (Requires auth)
- `GET /api/debug/test-customer` - Test Customer role authorization
- `GET /api/debug/test-admin` - Test Admin role authorization
- `GET /api/debug/test-public` - Test public endpoint

**Usage in Swagger:**
1. Get a token by logging in
2. Click "Authorize" button (??)
3. Enter: `Bearer {your_token}`
4. Call `/api/debug/claims` to verify token contents

---

## ?? Testing Instructions

### 1. **Restart Application**
Since middleware changes require restart:
- Stop the application completely
- Restart it (hot reload won't pick up middleware changes)

### 2. **Clear Browser Cache**
- Press `F12` to open DevTools
- Go to "Application" tab
- Clear LocalStorage and SessionStorage
- Clear Cookies

### 3. **Test Authentication Flow**

**Step A - Register/Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@test.com",
  "password": "Test@123456"
}
```

**Step B - Copy the token** from response

**Step C - Test Protected Endpoint:**
```bash
GET /api/active-policies/customer-active-policies
Authorization: Bearer {paste_token_here}
```

**Step D - Verify Response:**
- ? **200 OK** - Authorization working! (with data or empty array)
- ? **401 Unauthorized** - Still has issues (check token, role, etc.)

### 4. **Use Debug Endpoint**
```bash
GET /api/debug/claims
Authorization: Bearer {your_token}
```

**Expected response:**
```json
{
  "isAuthenticated": true,
  "authenticationType": "Bearer",
  "name": "Customer Name",
  "claimsCount": 5,
  "claims": [
    { "type": "sub", "value": "1" },
    { "type": "email", "value": "customer@test.com" },
    { "type": "name", "value": "Customer Name" },
    { "type": "role", "value": "Customer" },
    { "type": "nameid", "value": "1" }
  ],
  "roleFromClaim": "Customer",
  "userIdFromClaim": "1"
}
```

---

## ?? Important Notes

1. **Middleware order matters** - It's not just a preference, it's critical
2. **Hot reload won't work** - Restart the application after changes
3. **Token validation** - Each endpoint checks the token's role claim
4. **Case-sensitive roles** - "Customer" ? "customer"
5. **Database sync** - Ensure roles exist in database:
   ```sql
   SELECT * FROM Roles
   ```

---

## ?? Verification Checklist

- [ ] Middleware order is correct in `Program.cs`
- [ ] Application has been fully restarted (not hot reload)
- [ ] Browser cache/localStorage cleared
- [ ] Database has roles seeded (Admin, Agent, Customer, ClaimsOfficer)
- [ ] User has correct role assigned
- [ ] JWT token includes role claim
- [ ] Authorization header format is `Bearer {token}` (space-sensitive)

---

## ?? Next Steps

1. ? Apply the middleware order fix
2. ? Restart the application
3. ? Clear browser cache
4. ? Test with `/api/debug/claims` endpoint
5. ? Verify token has correct role
6. ? Test actual protected endpoint
7. ?? **Remove `/api/debug/*` endpoints before deployment**

---

## ?? If Issues Persist

### Check These in Order:
1. **Is the application running?** - Start it
2. **Did you restart?** - Middleware changes need restart
3. **Is token valid?** - Paste it at https://jwt.io
4. **Does token have role?** - Call `/api/debug/claims`
5. **Does database have user?** - Query Users table
6. **Does role exist?** - Query Roles table and verify assignment

---

## ?? Files Changed
- ? `Insurance.API\Program.cs` - Fixed middleware order
- ? `Insurance.API\Controllers\DebugController.cs` - Added debug endpoints (remove before production)

## ?? Build Status
? **Successful** - All changes compile without errors

---

**Remember:** Always test after middleware changes - they're critical for request processing order!

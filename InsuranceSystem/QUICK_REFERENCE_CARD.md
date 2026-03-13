# ?? 401 Error - Quick Reference Card

## The Problem
```
You're getting 401 Unauthorized on protected endpoints
even though you have a valid JWT token
```

## The Root Cause
```csharp
? WRONG: app.UseRouting(); then app.UseCors();
? RIGHT: app.UseCors(); then app.UseRouting();
```

## The Fix (30 seconds)
1. Open `Insurance.API\Program.cs`
2. Move `app.UseCors("AllowAngularFrontend");` to BEFORE `app.UseRouting();`
3. Restart application completely
4. Clear browser cache
5. Test again

## Verification (2 minutes)
```bash
# 1. Get token
POST /api/auth/login
{
  "email": "your@email.com",
  "password": "password"
}
# Copy the "token" value

# 2. Verify token
GET /api/debug/claims
Authorization: Bearer {token_from_step_1}
# Should return: isAuthenticated: true, roleFromClaim: "Customer"

# 3. Test protected endpoint
GET /api/active-policies/customer-active-policies
Authorization: Bearer {token_from_step_1}
# Should return: 200 OK with data
```

## If Still 401 - Check These (in order)
1. ? Application was fully restarted (not hot reload)
2. ? Browser cache cleared (F12 ? Application ? Clear all)
3. ? Token format is `Bearer {token}` with space
4. ? Token hasn't expired (check https://jwt.io)
5. ? Token has `role: "Customer"` claim
6. ? User exists in database with Customer role
7. ? Endpoint has `[Authorize(Roles = "Customer")]` attribute

## Code Changes Summary
| File | Change | Status |
|------|--------|--------|
| `Program.cs` | Move CORS before UseRouting() | ? Fixed |
| `DebugController.cs` | Added debug endpoints | ? New |

## Files Changed
- ? `Insurance.API\Program.cs`
- ? `Insurance.API\Controllers\DebugController.cs` (new)

## Build Status
? Successful - No errors

## Key Points
- Middleware order is critical
- CORS must be BEFORE routing
- Always restart after middleware changes
- Use `/api/debug/claims` to verify token
- Remove DebugController before production

## Need More Help?
1. Read: `QUICK_FIX_CHECKLIST_401.md`
2. Understand: `MIDDLEWARE_PIPELINE_VISUAL_GUIDE.md`
3. Reference: `AUTHORIZATION_401_FIX_GUIDE.md`

---

**TL;DR:** Move CORS middleware before routing in Program.cs, restart app, clear cache, test. Done! ?

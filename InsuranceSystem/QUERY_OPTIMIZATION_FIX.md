# Query Optimization Fix - Customer Endpoints Hanging Issue

## Problem Summary
The endpoints `customer-activepolicies` and `customer-requests` were hanging/loading indefinitely, while claims and notifications endpoints were working fine.

## Root Cause
The issue was in the **query execution order** in both repository methods:
- `ActivePolicyRepository.GetByCustomerAsync()`
- `InsuranceRequestRepository.GetRequestsByCustomerAsync()`
- `InsuranceRequestRepository.GetUnassignedRequestsAsync()`
- `InsuranceRequestRepository.GetRequestsAssignedToAgentAsync()`

### Why This Caused Hangs:
When using **AsSplitQuery()** with multiple **Include().ThenInclude()** chains, the queries were:
1. **Loading ALL data first** before filtering by customer ID
2. **Then applying the filter** after loading related entities
3. This caused unnecessary joins and Cartesian products, especially with complex navigation properties

**Example of the problematic pattern:**
```csharp
// WRONG - Loads all data, then filters
return await _db.ActivePolicies
       .AsSplitQuery()
       .AsNoTracking()
       .Include(p => p.Agent)
       .Include(p => p.Payments)
       .Include(p => p.PolicyApplication).ThenInclude(...)
       .Include(p => p.PolicyApplication).ThenInclude(...)
       .Include(p => p.Claims).ThenInclude(...)
       .Where(p => p.CustomerId == customerId)  // ? Filter AFTER loading!
       .OrderByDescending(p => p.Id)
       .ToListAsync();
```

## Solution Applied
Moved the **Where() filter BEFORE AsSplitQuery()** to reduce the dataset before applying split queries.

**Correct pattern:**
```csharp
// RIGHT - Filters first, then loads related data for matching records
return await _db.ActivePolicies
       .Where(p => p.CustomerId == customerId)  // ? Filter FIRST!
       .AsSplitQuery()
       .AsNoTracking()
       .Include(p => p.Agent)
       .Include(p => p.Payments)
       .Include(p => p.PolicyApplication).ThenInclude(...)
       .Include(p => p.PolicyApplication).ThenInclude(...)
       .Include(p => p.Claims).ThenInclude(...)
       .OrderByDescending(p => p.Id)
       .ToListAsync();
```

## Files Modified

### 1. `Insurance.Infrastructure/Repositories/ActivePolicyRepository.cs`
- **Method:** `GetByCustomerAsync(int customerId)`
  - Moved `Where()` before `AsSplitQuery()` and `AsNoTracking()`
- **Method:** `GetAllAsync()`
  - Reordered `AsNoTracking()` before `AsSplitQuery()` for consistency

### 2. `Insurance.Infrastructure/Repositories/InsuranceRequestRepository.cs`
- **Method:** `GetRequestsByCustomerAsync(int customerId)`
  - Moved `Where()` before `AsSplitQuery()` and `AsNoTracking()`
- **Method:** `GetUnassignedRequestsAsync()`
  - Moved `Where()` before `AsSplitQuery()` and `AsNoTracking()`
- **Method:** `GetRequestsAssignedToAgentAsync(int agentId)`
  - Moved `Where()` before `AsSplitQuery()` and `AsNoTracking()`

## Benefits of This Fix

? **Immediate Performance Improvement:**
- Reduces dataset size before loading related entities
- Eliminates unnecessary joins and Cartesian products
- Speeds up query execution dramatically

? **Why Claims & Notifications Worked:**
- Those endpoints had simpler queries with fewer navigation properties
- They didn't use complex `ThenInclude()` chains

? **Future-Proof:**
- When adding new records or more customers, the query will remain efficient
- Data growth won't exponentially increase query time

## Testing Recommendations

After applying hot-reload or restarting the app:

1. **Test customer-activepolicies endpoint:**
   ```
   GET /api/active-policies/customer-active-policies
   ```
   Should return results instantly instead of hanging

2. **Test customer-requests endpoint:**
   ```
   GET /api/insurance-requests/customer-requests
   ```
   Should return results instantly instead of hanging

3. **Verify data accuracy:**
   - Ensure all related entities are still properly loaded
   - Check that calculations and mappings work correctly
   - Confirm navigation properties are fully populated

## Query Execution Order Principle
**In Entity Framework Core:**
- **Always filter FIRST** with `Where()` before `Include()`
- **Apply split queries** to avoid Cartesian explosion
- **Order and project** at the end

This ensures the database engine filters data at the SQL level, not in-memory in C#.

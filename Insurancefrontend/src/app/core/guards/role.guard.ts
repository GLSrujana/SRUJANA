import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { UserRole } from '../auth/auth.models';

export const roleGuard: CanActivateFn = (route, state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const allowedRoles: UserRole[] = route.data['roles'] || [];
    const currentUserRole = tokenService.getRole();

    if (!currentUserRole) {
        return router.parseUrl('/login');
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(currentUserRole)) {
        return true;
    }

    // Role mismatch, redirect safely
    switch (currentUserRole) {
        case 'Admin':
            return router.parseUrl('/admin/dashboard');
        case 'Agent':
            return router.parseUrl('/agent/dashboard');
        case 'Customer':
            return router.parseUrl('/customer/dashboard');
        case 'ClaimsOfficer':
            return router.parseUrl('/claimsofficer/dashboard');
        default:
            return router.parseUrl('/login');
    }
};

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginResponse, UserRole } from './auth.models';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private readonly TOKEN_KEY = 'token';
    private readonly ROLE_KEY = 'role';
    private readonly USER_ID_KEY = 'userId';
    private readonly FULL_NAME_KEY = 'fullName';
    private readonly EMAIL_KEY = 'email';
    private readonly EXPIRES_AT_KEY = 'expiresAtUtc';

    private platformId = inject(PLATFORM_ID);

    constructor() { }

    /**
     * Stores the login response data in localStorage.
     */
    setSession(res: LoginResponse): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            localStorage.setItem(this.ROLE_KEY, res.role);
            localStorage.setItem(this.USER_ID_KEY, res.userId.toString());
            localStorage.setItem(this.FULL_NAME_KEY, res.fullName);
            localStorage.setItem(this.EMAIL_KEY, res.email);
            localStorage.setItem(this.EXPIRES_AT_KEY, res.expiresAtUtc);
        }
    }

    /**
     * Clears all session data from localStorage.
     */
    clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.ROLE_KEY);
            localStorage.removeItem(this.USER_ID_KEY);
            localStorage.removeItem(this.FULL_NAME_KEY);
            localStorage.removeItem(this.EMAIL_KEY);
            localStorage.removeItem(this.EXPIRES_AT_KEY);
        }
    }

    /**
     * Retrieves the current JWT token.
     */
    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    /**
     * Retrieves the stored user role.
     */
    getRole(): UserRole | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.ROLE_KEY) as UserRole | null;
        }
        return null;
    }

    /**
     * Retrieves the stored user ID.
     */
    getUserId(): number | null {
        if (isPlatformBrowser(this.platformId)) {
            const id = localStorage.getItem(this.USER_ID_KEY);
            return id ? parseInt(id, 10) : null;
        }
        return null;
    }

    /**
     * Checks if user is currently logged in (simply checks if token exists).
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

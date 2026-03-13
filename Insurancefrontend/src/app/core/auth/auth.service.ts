import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpBaseService } from '../utils/http-base.service';
import { TokenService } from './token.service';
import { LoginRequest, LoginResponse, RegisterRequest } from './auth.models';

/**
 * Core Angular Service handling user authentication and registration workflows.
 * It interfaces directly with the ASP.NET Backend API via the HttpClient and
 * delegates token storage and retrieval to the TokenService.
 * 
 * Example usage:
 * 
 * @Component(...)
 * export class LoginComponent {
 *   authService = inject(AuthService);
 *   
 *   onSubmit() {
 *     this.authService.login({ email: 'x@test.com', password: '123' }).subscribe({
 *       next: (res) => console.log('Logged in!', res),
 *       error: (err) => console.error('Login failed', err)
 *     });
 *   }
 * }
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private httpBase = inject(HttpBaseService);
    private tokenService = inject(TokenService);

    /**
     * Registers a new Customer using the provided form data.
     * Hits the /Auth/register backend endpoint.
     * 
     * @param dto The registration payload bridging full name, email, and password.
     * @returns An observable resolving the response or triggering HTTP Error interceptors.
     */
    register(dto: RegisterRequest): Observable<any> {
        const url = this.httpBase.buildUrl('/Auth/register');
        return this.http.post(url, dto);
    }

    /**
     * Authenticates a user, securely verifying their credentials against the backend.
     * Crucially intercepts the successful JSON response and pipelines it (using RxJS `tap`)
     * straight into the `TokenService` to set LocalStorage state. Look at `auth.interceptor.ts`
     * to see how this stored token is utilized down the line.
     * 
     * @param dto The login payload (email, password).
     * @returns Observable sequence containing the user profile and signed JWT token.
     */
    login(dto: LoginRequest): Observable<LoginResponse> {
        const url = this.httpBase.buildUrl('/Auth/login');
        return this.http.post<LoginResponse>(url, dto).pipe(
            tap((res) => {
                // Automatically save session on success allowing routing guards to let user in securely
                this.tokenService.setSession(res);
            })
        );
    }

    /**
     * Terminates the active user session.
     * Delegates entirely to TokenService to nuke LocalStorage contents.
     */
    logout(): void {
        this.tokenService.clear();
    }
}

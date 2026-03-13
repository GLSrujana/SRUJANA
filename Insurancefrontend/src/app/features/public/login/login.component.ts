import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { TokenService } from '../../../core/auth/token.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormErrorsComponent } from '../../../shared/ui/form-errors/form-errors.component';
import { generateSecurityChallenge, SecurityChallenge } from '../../../shared/utils/security-challenge.util';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private toast = inject(ToastService);
    private platformId = inject(PLATFORM_ID);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        mfaAnswer: ['', [Validators.required]],
        rememberMe: [false]
    });

    securityChallenge: SecurityChallenge = generateSecurityChallenge();


    isLoading = false;
    showPassword = false;
    backendError: string | null = null;
    capsLockOn = false;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            // If we have a remembered email, populate it
            const savedEmail = localStorage.getItem('rememberedEmail');
            if (savedEmail) {
                this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
            }
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    checkCapsLock(event: KeyboardEvent) {
        this.capsLockOn = event.getModifierState('CapsLock');
    }

    onSubmit() {
        this.backendError = null;

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, password, mfaAnswer, rememberMe } = this.loginForm.getRawValue();

        // Verify Security Challenge
        if (mfaAnswer !== this.securityChallenge.answer) {
            this.backendError = "Security challenge answer is incorrect. Please try again.";
            this.refreshChallenge();
            return;
        }

        // Handle "Remember Me" BEFORE doing API request so it persists even if it fails later
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        this.isLoading = true;

        // Create DTO matching server expectations strictly without the extra UI fields
        const loginDto = { email, password };

        this.authService.login(loginDto).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.toast.success(`Welcome back, ${res.fullName}!`);
                this.redirectByRole();
            },
            error: (err) => {
                this.isLoading = false;
                // Setting backend error nicely at the top of the form, it's also toasted globally via interceptor
                this.backendError = err.error?.error || err.message || 'Invalid email or password. Please try again.';
            }
        });
    }

    refreshChallenge() {
        this.securityChallenge = generateSecurityChallenge();
        this.loginForm.patchValue({ mfaAnswer: '' });
    }

    private redirectByRole() {
        const role = this.tokenService.getRole();
        switch (role) {
            case 'Customer': this.router.navigate(['/customer/dashboard']); break;
            case 'Agent': this.router.navigate(['/agent/dashboard']); break;
            case 'Admin': this.router.navigate(['/admin/dashboard']); break;
            case 'ClaimsOfficer': this.router.navigate(['/claimsofficer/dashboard']); break;
            default: this.router.navigate(['/login']); break;
        }
    }
}

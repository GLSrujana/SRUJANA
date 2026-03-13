import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UserRole } from '../../../core/auth/auth.models';
import { ToastService } from '../../../shared/services/toast.service';
import { FormErrorsComponent } from '../../../shared/ui/form-errors/form-errors.component';
import { calculatePasswordStrength } from '../../../shared/utils/password-strength.util';
import { generateSecurityChallenge, SecurityChallenge } from '../../../shared/utils/security-challenge.util';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, FormErrorsComponent],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toast = inject(ToastService);

    roles: UserRole[] = ['Customer', 'Agent', 'Admin', 'ClaimsOfficer'];

    registerForm = this.fb.nonNullable.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        countryCode: ['+91', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        mfaAnswer: ['', [Validators.required]],
        role: ['Customer' as UserRole, [Validators.required]]
    }, {
        validators: (group: any) => {
            const pass = group.get('password')?.value;
            const confirmPass = group.get('confirmPassword')?.value;
            return pass === confirmPass ? null : { notSame: true };
        }
    });

    securityChallenge: SecurityChallenge = generateSecurityChallenge();


    mfaVerified = false;

    isLoading = false;
    showPassword = false;
    backendError: string | null = null;
    passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
    capsLockOn = false;

    constructor() {
        this.registerForm.controls.password.valueChanges.subscribe(pwd => {
            this.passwordStrength = calculatePasswordStrength(pwd);
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    checkCapsLock(event: KeyboardEvent) {
        this.capsLockOn = event.getModifierState('CapsLock');
    }

    onSubmit() {
        this.backendError = null;

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        // Verify MFA Security Challenge
        if (this.registerForm.value.mfaAnswer !== this.securityChallenge.answer) {
            this.backendError = "Security challenge answer is incorrect. Please solve the puzzle correctly.";
            this.refreshChallenge();
            return;
        }

        this.isLoading = true;
        this.authService.register(this.registerForm.getRawValue()).subscribe({
            next: () => {
                this.isLoading = false;
                this.toast.success('Registration successful. Welcome aboard!');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                this.backendError = err.error?.error || err.message || 'An error occurred during registration.';
            }
        });
    }

    refreshChallenge() {
        this.securityChallenge = generateSecurityChallenge();
        this.registerForm.patchValue({ mfaAnswer: '' });
    }
}

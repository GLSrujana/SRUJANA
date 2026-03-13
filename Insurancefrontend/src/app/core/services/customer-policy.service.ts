import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PolicySuggestionResponseDto, SelectPolicyDto, PolicyApplicationResponseDto } from '../models/policy.models';
import { tap, finalize, catchError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerPolicyService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    private suggestionsSignal = signal<PolicySuggestionResponseDto[]>([]);
    public readonly suggestions = this.suggestionsSignal.asReadonly();

    private applicationsSignal = signal<PolicyApplicationResponseDto[]>([]);
    public readonly applications = this.applicationsSignal.asReadonly();

    private isLoadingSignal = signal<boolean>(false);
    public readonly isLoading = this.isLoadingSignal.asReadonly();

    private errorSignal = signal<string | null>(null);
    public readonly error = this.errorSignal.asReadonly();

    /**
     * Fetch suggestions for a specific request ID
     */
    getSuggestions(requestId: number): Observable<PolicySuggestionResponseDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<PolicySuggestionResponseDto[]>(`${this.apiBase}/customer/requests/${requestId}/suggestions`).pipe(
            tap(data => this.suggestionsSignal.set(data)),
            catchError(err => {
                this.errorSignal.set(err.error?.error || err.message || 'Failed to load suggestions.');
                throw err;
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }

    /**
     * Submit policy application
     */
    selectPolicy(dto: SelectPolicyDto): Observable<any> {
        return this.http.post(`${this.apiBase}/policy-applications/select`, dto);
    }

    /**
     * Fetch my policy applications
     */
    getMyApplications(): Observable<PolicyApplicationResponseDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<PolicyApplicationResponseDto[]>(`${this.apiBase}/policy-applications/customer-applications`).pipe(
            tap(data => this.applicationsSignal.set(data)),
            catchError(err => {
                this.errorSignal.set(err.error?.error || err.message || 'Failed to load applications.');
                throw err;
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }
}

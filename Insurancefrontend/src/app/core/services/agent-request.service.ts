import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, finalize, catchError, throwError } from 'rxjs';
import { InsuranceRequestDto } from '../models/insurance-request.models';

@Injectable({
    providedIn: 'root'
})
export class AgentRequestService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    private assignedSignal = signal<InsuranceRequestDto[]>([]);
    public readonly assignedRequests = this.assignedSignal.asReadonly();

    private isLoadingSignal = signal<boolean>(false);
    public readonly isLoading = this.isLoadingSignal.asReadonly();

    private errorSignal = signal<string | null>(null);
    public readonly error = this.errorSignal.asReadonly();

    getAssignedRequests(): Observable<InsuranceRequestDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<InsuranceRequestDto[]>(`${this.apiBase}/agent/requests/assigned`).pipe(
            tap(data => this.assignedSignal.set(data)),
            catchError(err => {
                this.errorSignal.set('Failed to fetch assigned requests');
                return throwError(() => err);
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }

    getPolicyProducts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiBase}/admin/policy-products?isActive=true`);
    }

    createPolicySuggestion(dto: { insuranceRequestId: number, suggestionRemarks: string, suggestions: any[] }): Observable<any> {
        return this.http.post(`${this.apiBase}/agent/policy-suggestions`, dto);
    }
}

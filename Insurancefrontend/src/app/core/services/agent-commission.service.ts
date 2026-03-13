import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, finalize, catchError, throwError } from 'rxjs';
import { CommissionDto } from '../models/commission.models';

@Injectable({
    providedIn: 'root'
})
export class AgentCommissionService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    private commissionsSignal = signal<CommissionDto[]>([]);
    public readonly commissions = this.commissionsSignal.asReadonly();

    private isLoadingSignal = signal<boolean>(false);
    public readonly isLoading = this.isLoadingSignal.asReadonly();

    private errorSignal = signal<string | null>(null);
    public readonly error = this.errorSignal.asReadonly();

    getMyCommissions(): Observable<CommissionDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<CommissionDto[]>(`${this.apiBase}/agent/commissions/agent-commissions`).pipe(
            tap(data => this.commissionsSignal.set(data)),
            catchError(err => {
                this.errorSignal.set('Failed to fetch commissions.');
                return throwError(() => err);
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }
}

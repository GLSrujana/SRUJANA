import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateInsuranceRequestDto, InsuranceRequestDto } from '../models/insurance-request.models';
import { tap, finalize, catchError, of, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InsuranceRequestService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiBaseUrl}/InsuranceRequests`;

    private requestsSignal = signal<InsuranceRequestDto[]>([]);
    public readonly requests = this.requestsSignal.asReadonly();

    private isLoadingSignal = signal<boolean>(false);
    public readonly isLoading = this.isLoadingSignal.asReadonly();

    private errorSignal = signal<string | null>(null);
    public readonly error = this.errorSignal.asReadonly();

    constructor() { }

    /**
     * Fetch all insurance requests for the logged-in user.
     */
    getMyRequests(): Observable<InsuranceRequestDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<InsuranceRequestDto[]>(`${this.apiUrl}/customer-requests`).pipe(
            tap(data => {
                this.requestsSignal.set(data);
            }),
            catchError(err => {
                this.errorSignal.set(err.error?.error || err.message || 'Failed to load requests.');
                throw err;
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }

    /**
     * Create a new insurance request.
     */
    createRequest(dto: CreateInsuranceRequestDto): Observable<any> {
        return this.http.post(this.apiUrl, dto);
    }

    createDraft(dto: CreateInsuranceRequestDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/draft`, dto);
    }

    updateDraft(id: number, dto: CreateInsuranceRequestDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/draft/${id}`, dto);
    }

    getById(id: number): Observable<InsuranceRequestDto> {
        return this.http.get<InsuranceRequestDto>(`${this.apiUrl}/${id}`);
    }

    submitDraft(id: number, dto: CreateInsuranceRequestDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/draft/${id}/submit`, dto);
    }
}

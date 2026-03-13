import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, finalize, catchError, Observable } from 'rxjs';
import { InsuranceRequestDto } from '../models/insurance-request.models';

export interface AssignAgentDto {
    requestId: number;
    agentId: number;
    adminRemarks?: string;
}

export interface AgentDto {
    id: number;
    fullName: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminRequestService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    private unassignedSignal = signal<InsuranceRequestDto[]>([]);
    public readonly unassignedRequests = this.unassignedSignal.asReadonly();

    private agentsSignal = signal<AgentDto[]>([]);
    public readonly availableAgents = this.agentsSignal.asReadonly();

    private isLoadingSignal = signal<boolean>(false);
    public readonly isLoading = this.isLoadingSignal.asReadonly();

    private errorSignal = signal<string | null>(null);
    public readonly error = this.errorSignal.asReadonly();

    getUnassignedRequests(): Observable<InsuranceRequestDto[]> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<InsuranceRequestDto[]>(`${this.apiBase}/admin/requests/unassigned`).pipe(
            tap(data => this.unassignedSignal.set(data)),
            catchError(err => {
                this.errorSignal.set(err.error?.error || err.message || 'Failed to load requests.');
                throw err;
            }),
            finalize(() => this.isLoadingSignal.set(false))
        );
    }

    getAgents(): Observable<AgentDto[]> {
        return this.http.get<AgentDto[]>(`${this.apiBase}/admin/requests/agents`).pipe(
            tap(data => this.agentsSignal.set(data))
        );
    }

    assignAgent(dto: AssignAgentDto): Observable<any> {
        return this.http.post(`${this.apiBase}/admin/requests/assign-agent`, dto);
    }
}

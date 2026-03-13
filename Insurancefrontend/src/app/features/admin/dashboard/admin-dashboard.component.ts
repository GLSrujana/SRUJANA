import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface AdminSummaryDto {
    totalUsers: number;
    totalCustomers: number;
    totalAgents: number;
    totalRequests: number;
    assignedRequests: number;
    totalPolicyApplications: number;
    approvedApplications: number;
    totalActivePolicies: number;
    totalPayments: number;
    totalPaymentAmount: number;
    totalCommissionGenerated: number;
    totalClaims: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    requestsByEventType: { [key: string]: number };
    revenueByMonth: { [key: string]: number };
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, KeyValuePipe],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Header Section -->
      <div class="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-fade-in-right">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font">System <span class="blue-gradient-text">Intelligence</span></h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Global analytics and platform health performance monitoring.
          </p>
        </div>
        <button (click)="syncFinancialData()" [disabled]="isSyncing()" class="group relative inline-flex items-center gap-2.5 px-6 py-3 font-black text-white transition-all duration-300 bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 active:translate-y-0 overflow-hidden shadow-xl disabled:opacity-50 disabled:translate-y-0">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span class="relative z-10 flex items-center gap-2 outfit-font tracking-wide text-xs">
            @if (isSyncing()) {
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              CALIBRATING...
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.023 4.853v4.992" /></svg>
              SYNC_FINANCIALS
            }
          </span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div *ngFor="let i of [1,2,3,4]" class="animate-pulse h-40 bg-neutral-100 dark:bg-neutral-900 rounded-[2.5rem]"></div>
        </div>
      } @else if (summary()) {
        
        <!-- Primary KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <!-- Stat 1: Total Users -->
          <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-1">
              <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  </div>
                  <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">ECOSYSTEM_USERS</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ summary()?.totalUsers }}</div>
                  <p class="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-wider">{{ summary()?.totalCustomers }} Clients / {{ summary()?.totalAgents }} Agents</p>
              </div>
          </div>

          <!-- Stat 2: Active Policies -->
          <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-2">
              <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shadow-inner group-hover:-rotate-6 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">ACTIVE_POLICIES</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ summary()?.totalActivePolicies }}</div>
                  <p class="text-[10px] text-emerald-600 mt-2 font-bold uppercase tracking-wider">SECURED_OBJECTS</p>
              </div>
          </div>

          <!-- Stat 3: Commissions -->
          <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-3">
              <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">AGENT_COMMISSIONS</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ summary()?.totalCommissionGenerated | currency }}</div>
                  <p class="text-[10px] text-amber-600 mt-2 font-bold uppercase tracking-wider">LEDGER_LIABILITIES</p>
              </div>
          </div>

          <!-- Stat 4: Pending Claims -->
          <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-4">
              <div class="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center shadow-inner group-hover:-translate-y-1 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">PENDING_CLAIMS</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-red-600 dark:text-red-500 tracking-tight outfit-font leading-none">{{ summary()?.pendingClaims }}</div>
                  <p class="text-[10px] text-red-500 mt-2 font-black uppercase tracking-widest animate-pulse">CRITICAL_ACTION_REQUIRED</p>
              </div>
          </div>
        </div>

        <!-- Secondary Pulse Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up stagger-4Delay">
          <!-- Stat 5: Total Requests -->
          <div class="premium-card p-6 border-l-4 border-l-blue-600 group">
              <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Total Pipeline</p>
              <div class="flex items-end justify-between">
                <h4 class="text-2xl font-black text-neutral-900 dark:text-white outfit-font">{{ summary()?.totalRequests }}</h4>
                <p class="text-[9px] font-bold text-neutral-500">{{ summary()?.assignedRequests }} ASSIGNED</p>
              </div>
          </div>

          <!-- Stat 6: Applications -->
          <div class="premium-card p-6 border-l-4 border-l-indigo-600 group">
              <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Applications</p>
              <div class="flex items-end justify-between">
                <h4 class="text-2xl font-black text-neutral-900 dark:text-white outfit-font">{{ summary()?.totalPolicyApplications }}</h4>
                <p class="text-[9px] font-bold text-emerald-500">{{ summary()?.approvedApplications }} APPROVED</p>
              </div>
          </div>

          <!-- Stat 7: Total Payments -->
          <div class="premium-card p-6 border-l-4 border-l-emerald-600 group">
              <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Financial Inflow</p>
              <div class="flex items-end justify-between">
                <h4 class="text-2xl font-black text-neutral-900 dark:text-white outfit-font">{{ summary()?.totalPaymentAmount | currency }}</h4>
                <p class="text-[9px] font-bold text-neutral-500">{{ summary()?.totalPayments }} TXNS</p>
              </div>
          </div>

          <!-- Stat 8: Total Claims -->
          <div class="premium-card p-6 border-l-4 border-l-amber-600 group">
              <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Claim Assets</p>
              <div class="flex items-end justify-between">
                <h4 class="text-2xl font-black text-neutral-900 dark:text-white outfit-font">{{ summary()?.totalClaims }}</h4>
                <p class="text-[9px] font-bold text-neutral-500">{{ summary()?.approvedClaims }} SETTLED</p>
              </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <!-- Requests by Event Type (Bar Chart) -->
            <div class="premium-card p-8 shadow-xl animate-fade-in-up stagger-4">
                <div class="mb-10">
                    <h3 class="text-2xl font-black text-neutral-950 dark:text-white outfit-font">Market Insight</h3>
                    <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Active Policies Distribution by Event Logic</p>
                </div>
                
                @if(objectKeys(summary()!.requestsByEventType).length > 0) {
                    <div class="space-y-6">
                        @for(item of summary()!.requestsByEventType | keyvalue; track item.key) {
                            <div>
                                <div class="flex justify-between text-xs mb-2 font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider outfit-font">
                                    <span>{{ item.key }}</span>
                                    <span class="text-blue-600">{{ item.value }} UNITS</span>
                                </div>
                                <div class="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                                    <div class="bg-gradient-to-r from-blue-600 to-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out" [style.width.%]="getPercentage(item.value, getMaxRequestCount())"></div>
                                </div>
                            </div>
                        }
                    </div>
                } @else {
                    <div class="flex flex-col items-center justify-center p-12 opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <p class="text-[10px] font-black uppercase tracking-widest">No Intelligence Data Detected</p>
                    </div>
                }
            </div>

            <!-- Claims Status (Pie Chart) -->
            <div class="premium-card p-8 shadow-xl flex flex-col animate-fade-in-up stagger-4Delay">
                <div class="mb-10">
                    <h3 class="text-2xl font-black text-neutral-950 dark:text-white outfit-font">Risk Calibration</h3>
                    <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Resolution Status of Operational Claims</p>
                </div>
                
                @if(summary()!.approvedClaims > 0 || summary()!.rejectedClaims > 0 || summary()!.pendingClaims > 0) {
                    <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-12">
                        <!-- Custom CSS Pie Chart using conic-gradient -->
                        <div class="w-52 h-52 rounded-full shadow-2xl relative p-1 bg-white dark:bg-neutral-800 animate-float">
                            <div class="w-full h-full rounded-full" [style.background]="getPieChartGradient()"></div>
                            <div class="absolute inset-4 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-inner">
                                <div class="text-center">
                                    <p class="text-[8px] font-black text-neutral-400 uppercase tracking-tighter">Total</p>
                                    <p class="text-3xl font-black text-neutral-950 dark:text-white leading-none">{{ (summary()?.approvedClaims || 0) + (summary()?.rejectedClaims || 0) + (summary()?.pendingClaims || 0) }}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="flex items-center gap-3 text-[10px] font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-widest group cursor-default">
                                <span class="w-3 h-3 rounded bg-emerald-500 shadow-lg shadow-emerald-500/50 group-hover:scale-125 transition-transform"></span> 
                                Approved <span class="text-neutral-400 ml-auto">{{ summary()?.approvedClaims }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-[10px] font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-widest group cursor-default">
                                <span class="w-3 h-3 rounded bg-red-500 shadow-lg shadow-red-500/50 group-hover:scale-125 transition-transform"></span> 
                                Rejected <span class="text-neutral-400 ml-auto">{{ summary()?.rejectedClaims }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-[10px] font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-widest group cursor-default">
                                <span class="w-3 h-3 rounded bg-amber-400 shadow-lg shadow-amber-400/50 group-hover:scale-125 transition-transform"></span> 
                                Pending <span class="text-neutral-400 ml-auto">{{ summary()?.pendingClaims }}</span>
                            </div>
                        </div>
                    </div>
                } @else {
                    <div class="flex flex-col items-center justify-center p-12 opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                        <p class="text-[10px] font-black uppercase tracking-widest">No Risk Meta Available</p>
                    </div>
                }
            </div>

            <!-- Revenue by Month (Line Chart via SVG) -->
            <div class="premium-card p-8 shadow-xl lg:col-span-2 animate-fade-in-up stagger-5">
                <div class="mb-12">
                    <h3 class="text-2xl font-black text-neutral-950 dark:text-white outfit-font">Profitability Node</h3>
                    <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Cross-sectional Revenue Flow ({{ currentYear }})</p>
                </div>
                
                @if(objectKeys(summary()!.revenueByMonth).length > 0) {
                    <div class="w-full h-72 relative">
                        <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradientPrefixAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.25"></stop>
                                    <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <!-- Grid lines -->
                            <line x1="0%" y1="0%" x2="100%" y2="0%" stroke="currentColor" stroke-opacity="0.05" stroke-dasharray="8"></line>
                            <line x1="0%" y1="33%" x2="100%" y2="33%" stroke="currentColor" stroke-opacity="0.05" stroke-dasharray="8"></line>
                            <line x1="0%" y1="66%" x2="100%" y2="66%" stroke="currentColor" stroke-opacity="0.05" stroke-dasharray="8"></line>
                            <line x1="0%" y1="100%" x2="100%" y2="100%" stroke="currentColor" stroke-opacity="0.1"></line>

                            <!-- Data Line Path -->
                            <path [attr.d]="getLineChartPath()" fill="url(#gradientPrefixAdmin)" stroke="#8b5cf6" stroke-width="4" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" class="animate-shimmer"></path>
                            
                            <!-- Data Points -->
                            @for(pt of getLineChartPoints(); track pt.label) {
                                <g class="group/point">
                                    <circle [attr.cx]="pt.x + '%'" [attr.cy]="pt.y + '%'" r="5" fill="#8b5cf6" class="transition-all duration-300 group-hover/point:r-8"></circle>
                                    <circle [attr.cx]="pt.x + '%'" [attr.cy]="pt.y + '%'" r="12" fill="transparent" class="cursor-pointer"></circle>
                                    <title>{{ pt.label }}: {{ pt.value | currency }}</title>
                                </g>
                            }
                        </svg>

                        <!-- X-Axis Labels -->
                        <div class="flex justify-between mt-8 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                            @for(pt of getLineChartPoints(); track pt.label) {
                                <span>{{ pt.label }}</span>
                            }
                        </div>
                    </div>
                } @else {
                    <div class="flex flex-col items-center justify-center p-12 opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        <p class="text-[10px] font-black uppercase tracking-widest">Revenue Ledger Offline</p>
                    </div>
                }
            </div>

        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    summary = signal<AdminSummaryDto | null>(null);
    isLoading = signal(true);
    isSyncing = signal(false);
    currentYear = new Date().getFullYear();

    ngOnInit() {
        this.http.get<AdminSummaryDto>(`${this.apiBase}/admin/reports/summary`).subscribe({
            next: (data) => {
                this.summary.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    syncFinancialData() {
        this.isSyncing.set(true);
        this.http.post(`${this.apiBase}/admin/reports/sync-financial-data`, {}).subscribe({
            next: () => {
                this.isSyncing.set(false);
                // Reload dashboard data
                this.http.get<AdminSummaryDto>(`${this.apiBase}/admin/reports/summary`).subscribe({
                    next: (data) => this.summary.set(data)
                });
            },
            error: () => this.isSyncing.set(false)
        });
    }

    // Helper for Template Checks
    objectKeys(obj: any): string[] {
        return Object.keys(obj || {});
    }

    // --- Bar Chart Helpers ---
    getMaxRequestCount(): number {
        const data = this.summary()?.requestsByEventType;
        if (!data) return 1;
        const vals = Object.values(data) as number[];
        return Math.max(...vals, 1);
    }

    getPercentage(val: any, max: number): number {
        return (Number(val) / max) * 100;
    }

    // --- Pie Chart Helpers ---
    getPieChartGradient(): string {
        const app = this.summary()?.approvedClaims || 0;
        const rej = this.summary()?.rejectedClaims || 0;
        const pen = this.summary()?.pendingClaims || 0;
        const total = app + rej + pen;

        if (total === 0) return 'conic-gradient(#e5e5e5 0% 100%)';

        const p1 = (app / total) * 100;
        const p2 = p1 + ((rej / total) * 100);

        // Green (Approved) -> Red (Rejected) -> Yellow (Pending)
        return `conic-gradient(#22c55e 0% ${p1}%, #ef4444 ${p1}% ${p2}%, #facc15 ${p2}% 100%)`;
    }

    // --- Line Chart Helpers ---
    getLineChartPoints(): { x: number, y: number, value: number, label: string }[] {
        const data = this.summary()?.revenueByMonth;
        if (!data) return [];

        const keys = Object.keys(data);
        if (keys.length === 0) return [];

        const maxVal = Math.max(...(Object.values(data) as number[]), 1000); // Base floor

        return keys.map((key, index) => {
            const val = data[key] as number;
            return {
                label: key,
                value: val,
                x: (index / (keys.length - 1)) * 100, // percentage across X axis
                y: 100 - ((val / maxVal) * 100)       // invert Y since 0 is top in SVG
            };
        });
    }

    getLineChartPath(): string {
        const points = this.getLineChartPoints();
        if (points.length === 0) return '';

        // Create SVG command path. Start at bottom left, draw lines to points, close to bottom right to allow gradient fill.
        let path = `M 0,100 `;

        // Line to first point
        path += `L ${points[0].x},${points[0].y} `;

        // Connect rest of points
        for (let i = 1; i < points.length; i++) {
            path += `L ${points[i].x},${points[i].y} `;
        }

        // Close path to bottom right for gradient fill to look solid to the floor
        path += `L 100,100 Z`;

        return path;
    }
}

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface AgentRequestDto {
    requestId: number;
    eventType: string;
    location: string;
    requestedCoverageAmount: number;
    status: number;
    createdAt: string;
}

interface CommissionDto {
    id: number;
    activePolicyId: number;
    commissionRate: number;
    commissionAmount: number;
    isPaid: boolean;
    generatedAtUtc: string;
}

@Component({
    selector: 'app-agent-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white relative flex flex-col pb-20 overflow-x-hidden transition-colors duration-500">
      <!-- Ambient Glob -->
      <div class="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen dark:mix-blend-color-dodge">
        <div class="h-[40rem] w-[40rem] bg-blue-500/10 rounded-full blur-[140px] absolute -top-20 -left-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div class="h-[50rem] w-[50rem] bg-yellow-600/10 rounded-full blur-[180px] absolute top-1/2 right-0 transform -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
      </div>

      <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up relative z-10">
      <div class="mb-10 animate-fade-in-right">
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font">Agent <span class="blue-gradient-text">Performance</span></h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Real-time performance analytics and request management gateway.
        </p>
      </div>

      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div *ngFor="let i of [1,2,3,4]" class="animate-pulse h-40 bg-neutral-100 dark:bg-neutral-900 rounded-[2rem]"></div>
        </div>
      } @else {

        <!-- KPI Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <!-- Assigned Requests -->
          <div class="premium-card glass-morphism p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-1">
              <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                  </div>
                   <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">Total Requests</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ totalAssigned() }}</div>
                  <p class="text-xs text-blue-500 mt-2 font-black uppercase tracking-tighter">{{ pendingReview() }} Needs Decision</p>
              </div>
          </div>

          <!-- Suggestions Sent -->
          <div class="premium-card glass-morphism p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-2">
              <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:-rotate-6 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  </div>
                   <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">Offers Shared</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ suggestionsSent() }}</div>
                  <p class="text-xs text-blue-500 mt-2 font-black uppercase tracking-tighter">Pending Customer</p>
              </div>
          </div>

          <!-- Total Commissions -->
          <div class="premium-card glass-morphism p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-3">
              <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                   <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">Paid Revenue</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight outfit-font leading-none">{{ totalEarned() | currency }}</div>
                  <p class="text-xs text-emerald-500 mt-2 font-black uppercase tracking-tighter">{{ paidCommissionsCount() }} Settled Ledger</p>
              </div>
          </div>

          <!-- Conversion Rate -->
          <div class="premium-card glass-morphism p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-4">
              <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
              <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                  <div class="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center shadow-inner group-hover:-translate-y-1 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                  </div>
                   <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">Active Policies</h3>
              </div>
              <div class="relative z-10">
                  <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ convertedCount() }}</div>
                  <p class="text-xs text-amber-600 mt-2 font-black uppercase tracking-tighter">Conversion Success</p>
              </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <!-- Recent Assigned Requests -->
            <div class="premium-card overflow-hidden flex flex-col shadow-xl animate-fade-in-up stagger-4">
                <div class="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-black text-neutral-950 dark:text-white outfit-font">Active Requests</h3>
                        <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Assigned to you</p>
                    </div>
                    <a routerLink="/agent/assigned-requests" class="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Full Access →</a>
                </div>
                <div class="divide-y divide-neutral-50 dark:divide-neutral-800">
                    @if (requests().length === 0) {
                        <div class="p-16 text-center opacity-50 flex flex-col items-center">
                            <div class="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p class="text-neutral-400 dark:text-neutral-500 text-xs font-black uppercase tracking-widest">Pipeline Empty</p>
                        </div>
                    } @else {
                        @for (req of recentRequests(); track req.requestId) {
                            <div class="p-5 flex items-center justify-between hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-all group/row cursor-pointer" [routerLink]="['/agent/requests', req.requestId, 'review']">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black shadow-sm group-hover/row:scale-110 transition-transform"
                                         [ngClass]="{
                                           'bg-blue-600 text-white': req.status === 2 || req.status === 3,
                                           'bg-emerald-600 text-white': req.status === 4,
                                           'bg-neutral-800 text-white': req.status === 5
                                         }">
                                        REQ
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-neutral-950 dark:text-white outfit-font">REQ-{{ req.requestId.toString().padStart(4, '0') }}</p>
                                        <p class="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">{{ req.eventType }} · {{ req.location }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all"
                                          [ngClass]="getStatusClasses(req.status)">{{ getStatusText(req.status) }}</span>
                                </div>
                            </div>
                        }
                    }
                </div>
            </div>

            <!-- Recent Commissions -->
            <div class="premium-card overflow-hidden flex flex-col shadow-xl animate-fade-in-up stagger-4Delay">
                <div class="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-black text-neutral-950 dark:text-white outfit-font">Commission Log</h3>
                        <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Your Earnings</p>
                    </div>
                    <a routerLink="/agent/commissions" class="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Ledger View →</a>
                </div>
                <div class="divide-y divide-neutral-50 dark:divide-neutral-800">
                    @if (commissions().length === 0) {
                        <div class="p-16 text-center opacity-50 flex flex-col items-center">
                            <div class="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p class="text-neutral-400 dark:text-neutral-500 text-xs font-black uppercase tracking-widest">No Assets Detected</p>
                        </div>
                    } @else {
                        @for (c of recentCommissions(); track c.id) {
                            <div class="p-5 flex items-center justify-between hover:bg-emerald-50/10 dark:hover:bg-emerald-900/5 transition-all group/row cursor-pointer" routerLink="/agent/commissions">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold group-hover/row:scale-110 transition-transform"
                                         [ngClass]="c.isPaid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                                            <path d="M10.75 10.818a3.75 3.75 0 100-5.636 3.75 3.75 0 000 5.636z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-neutral-950 dark:text-white outfit-font">COM-{{ c.id.toString().padStart(4, '0') }}</p>
                                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Policy Node: POL-{{ c.activePolicyId.toString().padStart(4, '0') }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-base font-black text-neutral-950 dark:text-white outfit-font">{{ c.commissionAmount | currency }}</p>
                                    <span class="text-[9px] font-black uppercase tracking-widest"
                                          [ngClass]="c.isPaid ? 'text-emerald-500' : 'text-amber-500'">
                                        ● {{ c.isPaid ? 'Ledger_Settled' : 'Ledger_Pending' }}
                                    </span>
                                </div>
                            </div>
                        }
                    }
                </div>
            </div>

        </div>
      }
      </div>
    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    requests = signal<AgentRequestDto[]>([]);
    commissions = signal<CommissionDto[]>([]);
    isLoading = signal(true);

    // KPI Computeds
    totalAssigned = computed(() => this.requests().length);
    pendingReview = computed(() => this.requests().filter(r => r.status === 2).length);
    suggestionsSent = computed(() => this.requests().filter(r => r.status === 3).length);
    convertedCount = computed(() => this.requests().filter(r => r.status === 4).length);
    totalEarned = computed(() => this.commissions().filter(c => c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0));
    paidCommissionsCount = computed(() => this.commissions().filter(c => c.isPaid).length);

    // Recent items (top 5)
    recentRequests = computed(() => this.requests().slice(0, 5));
    recentCommissions = computed(() => this.commissions().slice(0, 5));

    ngOnInit() {
        let loaded = 0;
        const checkDone = () => { loaded++; if (loaded >= 2) this.isLoading.set(false); };

        this.http.get<AgentRequestDto[]>(`${this.apiBase}/agent/requests/assigned`).subscribe({
            next: data => { this.requests.set(data); checkDone(); },
            error: () => checkDone()
        });

        this.http.get<CommissionDto[]>(`${this.apiBase}/agent/commissions/agent-commissions`).subscribe({
            next: data => { this.commissions.set(data); checkDone(); },
            error: () => checkDone()
        });
    }

    getStatusText(status: number): string {
        const labels: Record<number, string> = {
            1: 'Submitted',
            2: 'Assigned',
            3: 'Suggestions Sent',
            4: 'Converted',
            5: 'Rejected',
            6: 'Info Required',
            7: 'Closed'
        };
        return labels[status] || 'Unknown';
    }

    getStatusClasses(status: number): string {
        switch (status) {
            case 1: return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 badge-glow-warning';
            case 2: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 3: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 4: return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 badge-glow-success';
            case 5: return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50 badge-glow-error';
            case 6: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 7: return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200';
            default: return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200';
        }
    }
}

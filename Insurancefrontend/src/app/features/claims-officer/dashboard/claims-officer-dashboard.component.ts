import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface ClaimResponseDto {
    id: number;
    activePolicyId: number;
    policyNumber: string;
    customerId: number;
    customerName: string;
    status: number;
    claimReason: string;
    claimAmountRequested: number;
    approvedSettlementAmount?: number;
    officerRemarks?: string;
    submittedAtUtc: string;
    paymentOption: string;
    totalInstallments: number;
    paidInstallments: number;
}

@Component({
    selector: 'app-claims-officer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-10 animate-fade-in-right">
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font">Claims <span class="blue-gradient-text">Assurance</span></h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Global claims pipeline and resolution monitoring system.
        </p>
      </div>

      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div *ngFor="let i of [1,2,3,4]" class="animate-pulse h-40 bg-neutral-100 dark:bg-neutral-900 rounded-[2rem]"></div>
        </div>
      } @else {
        <!-- Analytics KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <!-- Total Claims -->
            <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-1">
                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
                <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                    <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                    </div>
                    <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">TOTAL_CLAIMS</h3>
                </div>
                <div class="relative z-10">
                    <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ totalClaims() }}</div>
                    <p class="text-xs text-blue-500 mt-2 font-black uppercase tracking-tighter">AGGREGATE_VOLUME</p>
                </div>
            </div>
            
            <!-- Pending Claims -->
            <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-2">
                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
                <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                    <div class="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center shadow-inner group-hover:-rotate-6 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">PENDING_REVIEW</h3>
                </div>
                <div class="relative z-10">
                    <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none text-amber-600">{{ pendingClaims() }}</div>
                    <p class="text-xs text-amber-500 mt-2 font-black uppercase tracking-tighter">ACTION_REQUIRED</p>
                </div>
            </div>

            <!-- Settled Claims -->
            <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-3">
                <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
                <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">SETTLED</h3>
                </div>
                <div class="relative z-10">
                    <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none text-emerald-600">{{ settledClaims() }}</div>
                    <p class="text-xs text-emerald-500 mt-2 font-black uppercase tracking-tighter">LEDGER_FINALIZED</p>
                </div>
            </div>

            <!-- Total Paid Out -->
            <div class="premium-card p-8 flex flex-col justify-between group relative overflow-hidden animate-scale-in stagger-4">
                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500"></div>
                <div class="flex items-center gap-4 mb-6 relative z-10 font-black outfit-font">
                    <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner group-hover:-translate-y-1 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 class="text-[10px] text-neutral-400 uppercase tracking-widest">DISBURSED</h3>
                </div>
                <div class="relative z-10">
                    <div class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font leading-none">{{ totalPaidOut() | currency }}</div>
                    <p class="text-xs text-blue-500 mt-2 font-black uppercase tracking-tighter">FINANCIAL_OUTPUT</p>
                </div>
            </div>
        </div>

        <!-- Recent Activity Table -->
        <div class="premium-card overflow-hidden shadow-xl animate-fade-in-up stagger-4">
             <div class="px-8 py-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                     <h3 class="text-xl font-black text-neutral-950 dark:text-white outfit-font">Global Claims Ledger</h3>
                     <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Unified Audit Stream</p>
                 </div>
                 <a routerLink="/claimsofficer/claims-pending" class="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95">Review Pending →</a>
             </div>
             <div class="overflow-x-auto custom-scrollbar">
                @if (claims().length === 0) {
                     <div class="p-20 text-center flex flex-col items-center">
                         <div class="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mb-6 text-neutral-400">
                             <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         </div>
                         <h3 class="text-lg font-black text-neutral-950 dark:text-white outfit-font uppercase tracking-widest">No Claims Detected</h3>
                         <p class="text-sm text-neutral-500 font-medium max-w-sm mt-2">The claims pipeline is currently fully cleared. System monitoring remains active.</p>
                     </div>
                } @else {
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-neutral-50/30 dark:bg-neutral-900/30 text-[10px] uppercase tracking-widest text-neutral-400 font-black border-b border-neutral-100 dark:border-neutral-800">
                                <th class="px-8 py-5">Identifer</th>
                                <th class="px-8 py-5">Client Intelligence</th>
                                <th class="px-8 py-5">Policy Node</th>
                                <th class="px-8 py-5">Payment Tracker</th>
                                <th class="px-8 py-5 text-right">Liability</th>
                                <th class="px-8 py-5 text-right">Settlement</th>
                                <th class="px-8 py-5 text-center">Status Phase</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-50 dark:divide-neutral-800 text-sm">
                            @for (c of claims(); track c.id) {
                                <tr class="hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-all group/row cursor-pointer" (click)="selectedClaim.set(c)">
                                    <td class="px-8 py-6">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black flex items-center justify-center group-hover/row:bg-blue-600 group-hover/row:text-white transition-colors">CLM</div>
                                            <div>
                                                <button class="font-black text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 decoration-2 decoration-blue-300 outfit-font flex items-center gap-1.5 transition-all">
                                                  CLM-{{ c.id.toString().padStart(4, '0') }}
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-0 group-hover/row:opacity-100 -translate-x-1 group-hover/row:translate-x-0 transition-all">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                  </svg>
                                                </button>
                                                <p class="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter mt-0.5">{{ c.submittedAtUtc | date:'mediumDate' }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-6">
                                        <div class="font-black text-neutral-950 dark:text-white outfit-font">{{ c.customerName }}</div>
                                        <div class="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">CUSTOMER ID: {{ c.customerId }}</div>
                                    </td>
                                    <td class="px-8 py-6">
                                        <span class="inline-flex px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-black text-[10px] tracking-widest dark:text-neutral-300">
                                            {{ c.policyNumber || 'POL-' + c.activePolicyId }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-6 min-w-[150px]">
                                        <div class="flex flex-col gap-1.5">
                                            <div class="flex items-center justify-between text-[9px] font-black text-neutral-500 tracking-widest uppercase">
                                                <span>{{ c.paymentOption === 'SixMonths' ? '6 Months' : c.paymentOption }}</span>
                                                <span [class.text-emerald-500]="c.paidInstallments === c.totalInstallments">{{ c.paidInstallments }}/{{ c.totalInstallments }} Paid</span>
                                            </div>
                                            <div class="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div class="h-full transition-all duration-500" 
                                                     [ngClass]="c.paidInstallments === c.totalInstallments ? 'bg-emerald-500' : 'bg-blue-500'" 
                                                     [style.width]="(c.paidInstallments / c.totalInstallments) * 100 + '%'"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-6 text-right">
                                        <p class="font-black text-neutral-950 dark:text-white outfit-font">{{ c.claimAmountRequested | currency }}</p>
                                        <p class="text-[10px] text-neutral-400 font-bold uppercase">Requested</p>
                                    </td>
                                    <td class="px-8 py-6 text-right">
                                        @if (c.approvedSettlementAmount != null && c.approvedSettlementAmount > 0) {
                                            <p class="font-black text-emerald-600 outfit-font">{{ c.approvedSettlementAmount | currency }}</p>
                                            <p class="text-[10px] text-emerald-500/50 font-bold uppercase">Settled</p>
                                        } @else {
                                            <span class="text-neutral-300 dark:text-neutral-700">—</span>
                                        }
                                    </td>
                                    <td class="px-8 py-6 text-center">
                                        <span class="inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300"
                                            [ngClass]="getStatusClasses(c.status)">
                                            {{ getStatusLabel(c.status) }}
                                        </span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                }
             </div>
        </div>
      }
    </div>

    <!-- Claim Detail Modal -->
    @if (selectedClaim(); as c) {
      <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in" (click)="selectedClaim.set(null)">
        <div class="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font">Claim <span class="text-blue-600">Details</span></h2>
                        <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Reference: CLM-{{ c.id.toString().padStart(4, '0') }}</p>
                    </div>
                </div>
                <button (click)="selectedClaim.set(null)" class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Left: Client & Policy -->
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Client Intelligence</h4>
                            <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Customer</span>
                                    <span class="text-sm font-black text-neutral-900 dark:text-white">{{ c.customerName }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Customer ID</span>
                                    <span class="text-xs font-black text-blue-600">#{{ c.customerId }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Policy Node</span>
                                    <span class="text-xs font-black text-blue-600">{{ c.policyNumber || 'POL-' + c.activePolicyId }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Filed On</span>
                                    <span class="text-xs font-black text-neutral-700 dark:text-neutral-300">{{ c.submittedAtUtc | date:'longDate' }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Claim Reason</h4>
                            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed italic">"{{ c.claimReason }}"</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Financials & Status -->
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Financial Summary</h4>
                            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Liability Requested</span>
                                    <span class="text-sm font-black text-neutral-900 dark:text-white">{{ c.claimAmountRequested | currency }}</span>
                                </div>
                                @if (c.approvedSettlementAmount != null && c.approvedSettlementAmount > 0) {
                                    <div class="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <span class="text-xs font-bold text-neutral-500">Approved Settlement</span>
                                        <span class="text-sm font-black text-emerald-600">{{ c.approvedSettlementAmount | currency }}</span>
                                    </div>
                                }
                                <div class="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <span class="text-xs font-bold text-neutral-500">Status</span>
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border" [ngClass]="getStatusClasses(c.status)">
                                        {{ getStatusLabel(c.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Premium Payment Tracker</h4>
                            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase mb-2">
                                    <span>{{ c.paymentOption === 'SixMonths' ? '6 Month Plan' : c.paymentOption + ' Plan' }}</span>
                                    <span [class.text-emerald-600]="c.paidInstallments === c.totalInstallments">{{ c.paidInstallments }} / {{ c.totalInstallments }} Paid</span>
                                </div>
                                <div class="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-700"
                                         [ngClass]="c.paidInstallments === c.totalInstallments ? 'bg-emerald-500' : 'bg-blue-500'"
                                         [style.width]="(c.paidInstallments / c.totalInstallments) * 100 + '%'">
                                    </div>
                                </div>
                                <p class="text-[10px] font-bold text-neutral-400 mt-2 text-right">{{ (c.paidInstallments / c.totalInstallments) | percent }} complete</p>
                            </div>
                        </div>

                        @if (c.officerRemarks) {
                            <div>
                                <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Officer Remarks</h4>
                                <div class="p-4 rounded-2xl border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                    <p class="text-xs font-medium text-neutral-600 dark:text-neutral-400 italic leading-relaxed">"{{ c.officerRemarks }}"</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Footer -->
                <div class="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Claims Ledger Record</span>
                    </div>
                    <button (click)="selectedClaim.set(null)" class="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-black shadow-lg hover:shadow-neutral-500/20 active:scale-95 transition-all">
                        CLOSE VIEW
                    </button>
                </div>
            </div>
        </div>
      </div>
    }
    `
})
export class ClaimsOfficerDashboardComponent implements OnInit {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    claims = signal<ClaimResponseDto[]>([]);
    isLoading = signal(true);
    selectedClaim = signal<ClaimResponseDto | null>(null);

    // Derived analytics
    totalClaims = computed(() => this.claims().length);
    pendingClaims = computed(() => this.claims().filter(c => c.status === 1 || c.status === 2).length);
    settledClaims = computed(() => this.claims().filter(c => c.status === 3 || c.status === 5).length);
    totalPaidOut = computed(() => this.claims()
        .filter(c => c.status === 3 || c.status === 5)
        .reduce((sum, c) => sum + (c.approvedSettlementAmount || 0), 0)
    );

    ngOnInit() {
        this.http.get<ClaimResponseDto[]>(`${this.apiBase}/claims-officer/claims/all`).subscribe({
            next: (data) => {
                this.claims.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    getStatusLabel(status: number): string {
        const labels: Record<number, string> = {
            1: 'Submitted', 2: 'Under Review',
            3: 'Approved', 4: 'Rejected', 5: 'Settled'
        };
        return labels[status] || 'Unknown';
    }

    getStatusClasses(status: number): string {
        switch (status) {
            case 1: return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 badge-glow-warning';
            case 2: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 3: return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 badge-glow-success';
            case 4: return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50 badge-glow-error';
            case 5: return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 badge-glow-success';
            default: return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200';
        }
    }
}

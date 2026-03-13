import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';

interface ActivePolicyDto {
  id: number;
  policyNumber: string;
  policyName: string;
  customerId: number;
  agentId: number;
  status: string;
  totalPremium: number;
  coverageAmount: number;
  startDateUtc: string;
  endDateUtc: string;
  isPremiumPaid: boolean;
  paymentOption: string;
  totalInstallments: number;
  paidInstallments: number;
  nextPaymentDueDate?: string;
  nextPaymentAmount: number;
  agentName: string;
  hasClaims: boolean;
  claimStatus?: string;
  claimsOfficerName?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  isOutdoorVenue: boolean;
  hasFireworks: boolean;
  hasVipPresence: boolean;
  alcoholServed: boolean;
  specialNotes?: string;
}

@Component({
  selector: 'app-customer-active-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">My Active Policies</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Your approved and active insurance coverage.</p>
      </div>

      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Policy Portfolio</h3>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ policies().length }} Policies</div>
        </div>
        <div class="overflow-x-auto min-h-[300px]">
            @if (isLoading()) {
              <div class="p-6 space-y-4">
                  @for (i of [1,2,3]; track i) {
                    <div class="animate-pulse flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                      <div class="h-10 w-24 bg-neutral-200 rounded-lg"></div>
                      <div class="flex-1 space-y-2"><div class="h-4 bg-neutral-200 rounded w-1/3"></div></div>
                      <div class="h-8 w-20 bg-neutral-200 rounded-lg"></div>
                    </div>
                  }
              </div>
            } @else if (policies().length === 0) {
              <div class="p-16 text-center flex flex-col items-center">
                <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                </div>
                <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">No Active Policies</h3>
                <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 max-w-sm">Once an admin approves your policy application, your active policies will appear here.</p>
              </div>
            } @else {
              <table class="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <th class="px-6 py-4">Policy #</th>
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Coverage</th>
                    <th class="px-6 py-4">Valid Until</th>
                    <th class="px-6 py-4">Payment Plan</th>
                    <th class="px-6 py-4">Paid Progress</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 text-sm">
                  @for (p of policies(); track p.id) {
                    <tr class="hover:bg-neutral-50/50 transition-colors group">
                      <td class="px-6 py-4">
                        <button (click)="selectedPolicy.set(p)" class="font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 decoration-2 decoration-blue-300 transition-all flex items-center gap-1.5">
                          {{ p.policyNumber }}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </td>
                      <td class="px-6 py-4 font-bold text-neutral-900 dark:text-white">{{ p.policyName }}</td>
                      <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300 font-medium">{{ p.coverageAmount | currency }}</td>
                      <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300 font-medium">{{ p.endDateUtc | date:'mediumDate' }}</td>
                      <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300 font-medium">
                        <span class="font-bold text-blue-600">{{ p.paymentOption === 'SixMonths' ? '6 Months' : p.paymentOption }}</span>
                        <div class="text-[10px] text-neutral-400 mt-1">Total: {{ p.totalPremium | currency }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-col gap-1">
                          <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase">
                            <span>Paid: {{ p.paidInstallments }} / {{ p.totalInstallments }}</span>
                            <span>{{ (p.paidInstallments / p.totalInstallments) | percent }}</span>
                          </div>
                          <div class="w-24 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 transition-all duration-500" [style.width]="(p.paidInstallments / p.totalInstallments) * 100 + '%'"></div>
                          </div>
                          @if (p.nextPaymentDueDate && !p.isPremiumPaid) {
                            <div class="text-xs font-medium text-amber-600 dark:text-amber-500 mt-1">Due: {{ p.nextPaymentDueDate | date:'MMM d, y' }}</div>
                          }
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right flex gap-2 justify-end items-center h-full pt-6">
                        @if (p.isPremiumPaid) {
                          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Fully Paid
                          </span>
                        } @else {
                          <button (click)="payForPolicy(p)" [disabled]="payingId() === p.id || !isPaymentActionable(p)" 
                            [ngClass]="isPaymentActionable(p) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'"
                            class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-transparent dark:border-neutral-700">
                            @if (payingId() === p.id) { Paying... } @else { Pay Due ({{ p.nextPaymentAmount | currency }}) }
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
        </div>
      </div>
    </div>

    <!-- Policy Detail Modal Overlay -->
    @if (selectedPolicy(); as p) {
      <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in" (click)="selectedPolicy.set(null)">
        <div class="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font">Policy <span class="text-blue-600">Details</span></h2>
                        <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Reference: {{ p.policyNumber }}</p>
                    </div>
                </div>
                <button (click)="selectedPolicy.set(null)" class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Column 1: Core Protection -->
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Coverage Overview</h4>
                            <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-xs font-bold text-neutral-500">Plan Name</span>
                                    <span class="text-sm font-black text-blue-600">{{ p.policyName }}</span>
                                </div>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-xs font-bold text-neutral-500">Coverage Amount</span>
                                    <span class="text-sm font-black text-neutral-900 dark:text-white">{{ p.coverageAmount | currency }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-neutral-500">Status</span>
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">{{ p.status }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Assigned Team</h4>
                            <div class="space-y-3">
                                <div class="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm group hover:border-blue-200 transition-all">
                                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                    </div>
                                    <div>
                                        <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Assigned Agent</p>
                                        <p class="text-sm font-black text-neutral-900 dark:text-white">{{ p.agentName || 'Processing Assignment...' }}</p>
                                    </div>
                                </div>
                                @if (p.hasClaims) {
                                    <div class="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 shadow-sm group hover:border-blue-300 transition-all">
                                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 text-lg">⚖️</div>
                                        <div>
                                            <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Claims Specialist</p>
                                            <p class="text-sm font-black text-neutral-900 dark:text-white">{{ p.claimsOfficerName || 'Reviewing Case...' }}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Timeline & Claims -->
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Event Metadata</h4>
                            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 space-y-4">
                                <div>
                                    <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Event Venue & Details</p>
                                    <p class="text-sm font-black text-neutral-900 dark:text-white">{{ p.eventType || 'Standard Event' }} at {{ p.location || 'Mapped Venue' }}</p>
                                    
                                    <!-- Detail Tags -->
                                    <div class="flex flex-wrap gap-1.5 mt-3">
                                        <span *ngIf="p.isOutdoorVenue" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-sky-50 text-sky-600 border border-sky-100">Outdoor Venue</span>
                                        <span *ngIf="p.alcoholServed" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">Alcohol Served</span>
                                        <span *ngIf="p.hasFireworks" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-orange-50 text-orange-600 border border-orange-100">Fireworks Handling</span>
                                        <span *ngIf="p.hasVipPresence" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">VIP Protection</span>
                                    </div>

                                    <p class="text-xs font-bold text-blue-600 mt-3">{{ p.eventDate | date:'longDate' }}</p>

                                    @if (p.specialNotes) {
                                        <div class="mt-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-500 italic border-l-2 border-blue-500">
                                            "{{ p.specialNotes }}"
                                        </div>
                                    }
                                </div>
                                <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <p class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Protection Window</p>
                                    <div class="flex items-center gap-3">
                                        <div class="flex-1">
                                            <p class="text-[10px] font-bold text-neutral-500">START</p>
                                            <p class="text-xs font-black">{{ p.startDateUtc | date:'MMM d, y' }}</p>
                                        </div>
                                        <div class="w-px h-6 bg-neutral-200 dark:bg-neutral-800"></div>
                                        <div class="flex-1">
                                            <p class="text-[10px] font-bold text-neutral-500">EXPIRY</p>
                                            <p class="text-xs font-black text-rose-500">{{ p.endDateUtc | date:'MMM d, y' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Claim History</h4>
                            @if (p.hasClaims) {
                                <div class="p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-1">
                                                <span class="text-xs font-black text-amber-900 dark:text-amber-100 uppercase tracking-wide">ACTIVE CLAIM</span>
                                                <span class="text-[10px] font-black bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded shadow-sm text-amber-800 dark:text-amber-200">{{ p.claimStatus }}</span>
                                            </div>
                                            <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">An active claim session is currently tied to this protection window.</p>
                                        </div>
                                    </div>
                                </div>
                            } @else {
                                <div class="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-100 dark:border-neutral-800">
                                    <p class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">No Claims Filed</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Verified Protection</span>
                    </div>
                    <button (click)="selectedPolicy.set(null)" class="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-black shadow-lg hover:shadow-neutral-500/20 active:scale-95 transition-all">
                        CLOSE VIEW
                    </button>
                </div>
            </div>
        </div>
      </div>
    }
  `
})
/**
 * Component displaying all active insurance policies belonging to the currently logged-in Customer.
 * Handles fetching the portfolio data, tracking loading states via Angular Signals, and submitting premium payments.
 */
export class CustomerActivePoliciesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;
  private toastService = inject(ToastService);
  private overlayService = inject(SuccessOverlayService);

  policies = signal<ActivePolicyDto[]>([]);
  isLoading = signal(true);
  payingId = signal<number | null>(null);
  selectedPolicy = signal<ActivePolicyDto | null>(null);

  /**
   * Triggers on component load. Fetches the active policies associated with the user's mapped JWT Claims.
   * On success, updates the `policies` signal array and toggles the loading signal off.
   */
  ngOnInit() {
    this.http.get<ActivePolicyDto[]>(`${this.apiBase}/active-policies/customer-active-policies`).subscribe({
      next: data => { this.policies.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  /**
   * Checks if payment is permitted (due date is within 7 days or past due)
   */
  isPaymentActionable(policy: ActivePolicyDto): boolean {
    if (policy.isPremiumPaid || !policy.nextPaymentDueDate) return false;
    const dueDate = new Date(policy.nextPaymentDueDate);
    const now = new Date();
    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  }

  /**
   * Processes a manual premium payment for a specific policy.
   * Constructs an ad-hoc payload matching the Policy's Total Premium and sends it to the Payment endpoints.
   *
   * @param policy The ActivePolicyDto object row that the user clicked to pay.
   */
  payForPolicy(policy: ActivePolicyDto) {
    this.payingId.set(policy.id);
    const dto = {
      activePolicyId: policy.id,
      amount: policy.nextPaymentAmount,
      paymentMethod: 'Online',
      transactionReference: `TXN-${Date.now()}`
    };
    this.http.post(`${this.apiBase}/payments`, dto).subscribe({
      next: () => {
        this.payingId.set(null);

        this.overlayService.show({
          title: 'Payment Successful',
          message: `Your premium payment for ${policy.policyNumber} has been received!`,
          icon: 'payment',
          duration: 3500
        });

        // Refresh
        this.ngOnInit();
      },
      error: (err: any) => {
        this.payingId.set(null);
        this.toastService.error(err.error?.error || err.error?.message || 'Payment failed.');
      }
    });
  }
}

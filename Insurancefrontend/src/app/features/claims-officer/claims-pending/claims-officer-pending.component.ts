import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';

interface ClaimDto {
  id: number;
  activePolicyId: number;
  customerId: number;
  claimReason: string;
  claimAmountRequested: number;
  approvedSettlementAmount?: number;
  status: number;    // 1=Submitted, 2=UnderReview, 3=Approved, 4=Rejected, 5=Settled
  officerRemarks?: string;
  paymentOption: string;
  totalInstallments: number;
  paidInstallments: number;
  riskScore: number;
  riskLevel: string;
  riskAnalysis: string;
}

interface ReviewFormData {
  approvedSettlementAmount: number;
  officerRemarks: string;
  validationError: string;
}

@Component({
  selector: 'app-claims-officer-pending',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Claims Review</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Review and process customer insurance claims.</p>
      </div>

      <!-- Success message -->
      @if (successMessage()) {
        <div class="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
          {{ successMessage() }}
        </div>
      }

      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Pending Claims</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ claims().length }} Pending</div>
        </div>
        <div class="min-h-[300px]">
          @if (isLoading()) {
            <div class="p-6 space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="animate-pulse flex gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div class="flex-1 space-y-2"><div class="h-4 bg-neutral-200 rounded w-1/4"></div><div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3"></div></div>
                  <div class="h-8 w-24 bg-neutral-200 rounded-lg"></div>
                </div>
              }
            </div>
          } @else if (claims().length === 0) {
            <div class="p-16 text-center flex flex-col items-center">
              <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">All Clear!</h3>
              <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 max-w-sm">No pending claims to review at this time.</p>
            </div>
          } @else {
            <div class="divide-y divide-neutral-100">
              @for (c of claims(); track c.id) {
                <div class="p-6 hover:bg-neutral-50/30 transition-colors">
                  <div class="flex flex-col xl:flex-row xl:items-start gap-6">
                    <!-- Claim Details -->
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-bold text-neutral-900 dark:text-white text-lg">CLM-{{ c.id.toString().padStart(4, '0') }}</span>
                        <span class="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md text-xs font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">POL-{{ c.activePolicyId }}</span>
                        <span class="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200">Pending Review</span>
                      </div>

                      <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 space-y-2">
                        <div class="flex items-start gap-2">
                          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 uppercase tracking-wider w-24 shrink-0 pt-0.5">Reason</span>
                          <p class="text-sm text-neutral-800 dark:text-neutral-100 font-medium">{{ c.claimReason }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 uppercase tracking-wider w-24 shrink-0">Requested</span>
                          <span class="text-sm text-blue-700 font-extrabold">{{ c.claimAmountRequested | currency }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 uppercase tracking-wider w-24 shrink-0">Customer ID</span>
                          <span class="text-sm text-neutral-600 dark:text-neutral-300 font-medium">#{{ c.customerId }}</span>
                        </div>
                        <div class="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 uppercase tracking-wider w-24 shrink-0 block">Paid Progr</span>
                          <div class="flex-1 w-full max-w-[200px]">
                              <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500 tracking-widest uppercase mb-1">
                                  <span>{{ c.paymentOption === 'SixMonths' ? '6 Months' : c.paymentOption }}</span>
                                  <span [class.text-emerald-500]="c.paidInstallments === c.totalInstallments && c.totalInstallments > 0">{{ c.paidInstallments }}/{{ c.totalInstallments }} Paid</span>
                              </div>
                              <div class="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div class="h-full transition-all duration-500" 
                                       [ngClass]="c.paidInstallments === c.totalInstallments && c.totalInstallments > 0 ? 'bg-emerald-500' : 'bg-blue-500'" 
                                       [style.width]="c.totalInstallments > 0 ? (c.paidInstallments / c.totalInstallments) * 100 + '%' : '0%'"></div>
                              </div>
                          </div>
                        </div>

                        <!-- AI Risk Score -->
                        <div class="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                           <div class="flex items-center justify-between">
                              <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">AI Risk Score</span>
                              <div class="flex items-center gap-2">
                                 <span class="text-xl font-black outfit-font" 
                                       [ngClass]="c.riskScore > 70 ? 'text-red-500' : (c.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500')">
                                    {{ c.riskScore }}%
                                 </span>
                                 <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border"
                                       [ngClass]="{
                                          'bg-red-50 text-red-600 border-red-100': c.riskLevel === 'Critical',
                                          'bg-amber-50 text-amber-600 border-amber-100': c.riskLevel === 'Elevated',
                                          'bg-emerald-50 text-emerald-600 border-emerald-100': c.riskLevel === 'Low'
                                       }">
                                    {{ c.riskLevel }}
                                 </span>
                              </div>
                           </div>
                           <div class="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg border-l-4"
                                [ngClass]="c.riskScore > 70 ? 'border-red-500' : (c.riskScore > 40 ? 'border-amber-500' : 'border-emerald-500')">
                              <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Risk Analysis</p>
                              <p class="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed italic">{{ c.riskAnalysis }}</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <!-- Review Panel -->
                    <div class="min-w-[320px] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                      <h4 class="font-bold text-neutral-800 dark:text-neutral-100 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-500"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clip-rule="evenodd" /></svg>
                        Officer Review
                      </h4>

                      <!-- Settlement Amount -->
                      <div>
                        <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                          Settlement Amount
                          <span class="text-neutral-400 dark:text-neutral-500 font-normal">(max: {{ c.claimAmountRequested | currency }})</span>
                        </label>
                        <input type="number" [(ngModel)]="reviewData[c.id].approvedSettlementAmount" [name]="'settlement-'+c.id"
                          min="0" [max]="c.claimAmountRequested" step="0.01"
                          class="block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm">
                      </div>

                      <!-- Remarks -->
                      <div>
                        <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Remarks <span class="text-red-400">*</span></label>
                        <textarea [(ngModel)]="reviewData[c.id].officerRemarks" [name]="'remarks-'+c.id" rows="2"
                          placeholder="Explain your decision..."
                          class="block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm resize-none"></textarea>
                      </div>

                      <!-- Validation Error -->
                      @if (reviewData[c.id].validationError) {
                        <div class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 shrink-0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                          {{ reviewData[c.id].validationError }}
                        </div>
                      }

                      <!-- Action Buttons -->
                      <div class="flex gap-2 pt-1">
                        <button (click)="reviewClaim(c, 5)" [disabled]="processingId() === c.id"
                          class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                          @if (processingId() === c.id) {
                            <svg class="animate-spin mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 mr-1"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                          }
                          Approve & Settle
                        </button>
                        <button (click)="reviewClaim(c, 4)" [disabled]="processingId() === c.id"
                          class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 mr-1"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ClaimsOfficerPendingComponent implements OnInit {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  claims = signal<ClaimDto[]>([]);
  isLoading = signal(true);
  processingId = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  reviewData: Record<number, ReviewFormData> = {};
  private overlayService = inject(SuccessOverlayService);

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.http.get<ClaimDto[]>(`${this.apiBase}/claims-officer/claims/pending`).subscribe({
      next: data => {
        this.claims.set(data);
        data.forEach(c => {
          if (!this.reviewData[c.id]) {
            this.reviewData[c.id] = {
              approvedSettlementAmount: c.claimAmountRequested,
              officerRemarks: '',
              validationError: ''
            };
          }
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  reviewClaim(claim: ClaimDto, status: number) {
    const data = this.reviewData[claim.id];
    data.validationError = '';

    // 1. Remarks required for all actions
    if (!data.officerRemarks || data.officerRemarks.trim().length < 5) {
      data.validationError = 'Remarks are required (minimum 5 characters).';
      return;
    }

    // 2. For Approve & Settle (5): settlement amount mandatory and > 0, <= requested
    if (status === 5) {
      if (!data.approvedSettlementAmount || data.approvedSettlementAmount <= 0) {
        data.validationError = 'Settlement amount is required and must be greater than zero.';
        return;
      }
      if (data.approvedSettlementAmount > claim.claimAmountRequested) {
        data.validationError = `Settlement cannot exceed the requested amount of ${claim.claimAmountRequested.toFixed(2)}.`;
        return;
      }
    }

    // 3. For Reject (4): zero out settlement
    if (status === 4) {
      data.approvedSettlementAmount = 0;
    }

    this.processingId.set(claim.id);
    const dto = {
      status,
      approvedSettlementAmount: data.approvedSettlementAmount || 0,
      officerRemarks: data.officerRemarks.trim()
    };

    this.http.put(`${this.apiBase}/claims-officer/claims/${claim.id}/review`, dto).subscribe({
      next: () => {
        this.processingId.set(null);

        if (status === 5) {
          this.overlayService.show({
            title: 'Settlement Paid',
            message: `Claim CLM-${claim.id.toString().padStart(4, '0')} has been approved and $${dto.approvedSettlementAmount} transferred.`,
            icon: 'payment',
            duration: 3000
          });
        } else {
          this.overlayService.show({
            title: 'Claim Rejected',
            message: `Claim CLM-${claim.id.toString().padStart(4, '0')} has been formally rejected.`,
            icon: 'success',
            duration: 2500
          });
        }

        this.load();
      },
      error: (err: any) => {
        this.processingId.set(null);
        data.validationError = err.error?.message || err.error?.error || err.error || 'Failed to process claim.';
      }
    });
  }
}

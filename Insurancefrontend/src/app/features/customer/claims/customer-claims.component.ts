import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';

interface ActivePolicyDto {
  id: number;
  policyNumber: string;
  customerId: number;
  agentId: number;
  status: string;
  totalPremium: number;
  coverageAmount: number;
  startDateUtc: string;
  endDateUtc: string;
}

interface ClaimResponseDto {
  id: number;
  activePolicyId: number;
  customerId: number;
  claimReason: string;
  claimAmountRequested: number;
  approvedSettlementAmount?: number;
  status: number;   // 1=Submitted, 2=UnderReview, 3=Approved, 4=Rejected, 5=Settled
  officerRemarks?: string;
}

@Component({
  selector: 'app-customer-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">My Claims</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">File and track insurance claims on your active policies.</p>
      </div>

      <!-- File New Claim Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden mb-8">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">File a New Claim</h3>
        </div>
        <div class="p-6">
          @if (activePolicies().length === 0 && !policiesLoading()) {
            <div class="text-center py-6 text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">
              <p class="font-semibold">No active policies found.</p>
              <p class="text-sm mt-1">You need an active policy before filing a claim.</p>
            </div>
          } @else {
            <form (ngSubmit)="submitClaim()" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Policy Dropdown -->
                <div>
                  <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Select Active Policy</label>
                  <select [(ngModel)]="newClaim.activePolicyId" name="activePolicyId" required
                    (change)="onPolicySelected()"
                    class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
                    <option [ngValue]="0" disabled>— Choose a policy —</option>
                    @for (p of activePolicies(); track p.id) {
                      <option [ngValue]="p.id">{{ p.policyNumber }} — Coverage: {{ p.coverageAmount | currency }}</option>
                    }
                  </select>
                </div>
                <!-- Claim Amount -->
                <div>
                  <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Claim Amount Requested</label>
                  <input type="number" [(ngModel)]="newClaim.claimAmountRequested" name="claimAmount" required min="1"
                    [max]="selectedPolicyCoverage()"
                    placeholder="Enter amount..."
                    class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
                  @if (selectedPolicyCoverage() > 0) {
                    <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Max claim: {{ selectedPolicyCoverage() | currency }}</p>
                  }
                </div>
              </div>
              <!-- Reason -->
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Claim Reason</label>
                <textarea [(ngModel)]="newClaim.claimReason" name="claimReason" required rows="3"
                  placeholder="Describe the reason for your claim in detail..."
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm resize-none"></textarea>
              </div>
              <!-- Validation Errors -->
              @if (formError()) {
                <div class="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 shrink-0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                  {{ formError() }}
                </div>
              }
              <button type="submit" [disabled]="isSubmitting() || newClaim.activePolicyId === 0"
                class="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Submitting...
                } @else { Submit Claim }
              </button>
            </form>
          }
        </div>
      </div>

      <!-- Success Message -->
      @if (successMessage()) {
        <div class="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
          {{ successMessage() }}
        </div>
      }

      <!-- Claims History -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Claim History</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ claims().length }} Claims</div>
        </div>
        <div class="overflow-x-auto min-h-[200px]">
          @if (isLoading()) {
            <div class="p-6 space-y-4">
              @for (i of [1,2]; track i) {
                <div class="animate-pulse flex gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div class="flex-1 space-y-2"><div class="h-4 bg-neutral-200 rounded w-1/3"></div><div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2"></div></div>
                </div>
              }
            </div>
          } @else if (claims().length === 0) {
            <div class="p-12 text-center text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">
              <p class="font-semibold">No claims filed yet.</p>
              <p class="text-sm mt-1">File a claim above when you need to make an insurance claim.</p>
            </div>
          } @else {
            <table class="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <th class="px-6 py-4">Claim #</th>
                  <th class="px-6 py-4">Policy</th>
                  <th class="px-6 py-4">Reason</th>
                  <th class="px-6 py-4">Requested</th>
                  <th class="px-6 py-4">Settlement</th>
                  <th class="px-6 py-4">Officer Remarks</th>
                  <th class="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-sm">
                @for (c of claims(); track c.id) {
                  <tr class="hover:bg-neutral-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">CLM-{{ c.id.toString().padStart(4, '0') }}</td>
                    <td class="px-6 py-4"><span class="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">POL-{{ c.activePolicyId }}</span></td>
                    <td class="px-6 py-4 text-neutral-700 dark:text-neutral-200 max-w-[200px] truncate" [title]="c.claimReason">{{ c.claimReason }}</td>
                    <td class="px-6 py-4"><span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-100">{{ c.claimAmountRequested | currency }}</span></td>
                    <td class="px-6 py-4">
                      @if (c.approvedSettlementAmount != null && c.approvedSettlementAmount > 0) {
                        <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100">{{ c.approvedSettlementAmount | currency }}</span>
                      } @else { <span class="text-neutral-400 dark:text-neutral-500">—</span> }
                    </td>
                    <td class="px-6 py-4 text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-xs italic max-w-[150px] truncate" [title]="c.officerRemarks || ''">{{ c.officerRemarks || '—' }}</td>
                    <td class="px-6 py-4 text-right">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" [ngClass]="{
                        'bg-amber-50 text-amber-700 border border-amber-200': c.status !== 3 && c.status !== 4,
                        'bg-green-50 text-green-700 border border-green-200': c.status === 3 || c.status === 5,
                        'bg-red-50 text-red-700 border border-red-200': c.status === 4
                      }">{{ getStatusLabel(c.status) }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `
})
export class CustomerClaimsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private apiBase = environment.apiBaseUrl;
  private overlayService = inject(SuccessOverlayService);

  claims = signal<ClaimResponseDto[]>([]);
  activePolicies = signal<ActivePolicyDto[]>([]);
  isLoading = signal(true);
  policiesLoading = signal(true);
  isSubmitting = signal(false);
  formError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  selectedPolicyCoverage = signal(0);

  newClaim = { activePolicyId: 0, claimAmountRequested: 0, claimReason: '' };

  ngOnInit() {
    // Load active policies for dropdown
    this.http.get<ActivePolicyDto[]>(`${this.apiBase}/active-policies/customer-active-policies`).subscribe({
      next: data => {
        this.activePolicies.set(data);
        this.policiesLoading.set(false);
        // Pre-select from query param
        const policyId = this.route.snapshot.queryParamMap.get('policyId');
        if (policyId) {
          this.newClaim.activePolicyId = +policyId;
          this.onPolicySelected();
        }
      },
      error: () => this.policiesLoading.set(false)
    });

    // Load existing claims
    this.loadClaims();
  }

  loadClaims() {
    this.isLoading.set(true);
    this.http.get<ClaimResponseDto[]>(`${this.apiBase}/claims/customer-claims`).subscribe({
      next: data => { this.claims.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  onPolicySelected() {
    const policy = this.activePolicies().find(p => p.id === this.newClaim.activePolicyId);
    this.selectedPolicyCoverage.set(policy ? policy.coverageAmount : 0);
  }

  submitClaim() {
    this.formError.set(null);
    this.successMessage.set(null);

    // Validations
    if (!this.newClaim.activePolicyId || this.newClaim.activePolicyId === 0) {
      this.formError.set('Please select an active policy.'); return;
    }
    if (!this.newClaim.claimReason || this.newClaim.claimReason.trim().length < 10) {
      this.formError.set('Claim reason must be at least 10 characters.'); return;
    }
    if (!this.newClaim.claimAmountRequested || this.newClaim.claimAmountRequested <= 0) {
      this.formError.set('Claim amount must be greater than zero.'); return;
    }
    const cov = this.selectedPolicyCoverage();
    if (cov > 0 && this.newClaim.claimAmountRequested > cov) {
      this.formError.set(`Claim amount cannot exceed policy coverage of ${cov.toFixed(2)}.`); return;
    }

    this.isSubmitting.set(true);
    this.http.post<ClaimResponseDto>(`${this.apiBase}/claims`, this.newClaim).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.newClaim = { activePolicyId: 0, claimAmountRequested: 0, claimReason: '' };
        this.selectedPolicyCoverage.set(0);

        this.overlayService.show({
          title: 'Claim Submitted',
          message: `Claim CLM-${res.id.toString().padStart(4, '0')} submitted successfully! A claims officer will review it shortly.`,
          icon: 'success',
          duration: 4000
        });

        this.loadClaims();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.formError.set(err.error?.message || err.error?.error || err.error || 'Failed to file claim. Please try again.');
      }
    });
  }

  getStatusLabel(status: number): string {
    if (status === 3 || status === 5) return 'Approved';
    if (status === 4) return 'Rejected';
    return 'No response';
  }
}

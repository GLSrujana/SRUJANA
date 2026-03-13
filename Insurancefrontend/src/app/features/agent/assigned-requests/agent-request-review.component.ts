import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRequestService } from '../../../core/services/agent-request.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InsuranceRequestDto } from '../../../core/models/insurance-request.models';
import { ToastService } from '../../../shared/services/toast.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PolicyProductDto {
    id: number;
    productName: string;
    description: string;
    eventTypeSupported: string;
    baseRate: number;
    minCoverageAmount: number;
    maxCoverageAmount: number;
    isActive: boolean;
}

@Component({
    selector: 'app-agent-request-review',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Top Actions / Back Button -->
      <div class="mb-6 flex items-center justify-between">
          <button routerLink="/agent/assigned-requests" class="inline-flex items-center text-sm font-semibold text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                  <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
              </svg>
              Back to Queue
          </button>
      </div>

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Review Requirements</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Analyze client request REQ-{{ requestId()?.toString()?.padStart(4, '0') }} and propose optimal policy products.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Request Details -->
          <div class="lg:col-span-1 space-y-6">
              <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 dark:border-neutral-800 p-6">
                  <h3 class="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 text-blue-500">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                     </svg>
                     Event Data
                  </h3>

                  @if (request(); as req) {
                      <div class="space-y-4 text-sm font-medium">
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Event Type</p>
                              <p class="text-neutral-800 dark:text-neutral-100">{{ req.eventType || 'N/A' }}</p>
                          </div>
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Target Coverage</p>
                              <p class="text-blue-600 font-bold bg-blue-50 inline-flex px-2 py-0.5 rounded border border-blue-100">{{ req.requestedCoverageAmount | currency }}</p>
                          </div>
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Location</p>
                              <p class="text-neutral-800 dark:text-neutral-100">{{ req.location }}</p>
                          </div>
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Budget</p>
                              <p class="text-neutral-800 dark:text-neutral-100">{{ req.eventBudget | currency }}</p>
                          </div>
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Attendees</p>
                              <p class="text-neutral-800 dark:text-neutral-100">{{ req.expectedAttendees }} People</p>
                          </div>
                          <div>
                              <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Risk Assessment</p>
                              <div class="flex flex-wrap gap-2 mt-1">
                                  @if (req.isOutdoorVenue) { <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-100 dark:border-amber-800/50 uppercase tracking-tighter">Outdoor Venue</span> }
                                  @if (req.hasFireworks) { <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-100 dark:border-amber-800/50 uppercase tracking-tighter">Pyrotechnics/Fireworks</span> }
                                  @if (req.alcoholServed) { <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-100 dark:border-amber-800/50 uppercase tracking-tighter">Alcohol Service</span> }
                                  @if (req.hasVipPresence) { <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-100 dark:border-amber-800/50 uppercase tracking-tighter">VIP Presence</span> }
                                  @if (!req.isOutdoorVenue && !req.hasFireworks && !req.alcoholServed && !req.hasVipPresence) {
                                      <span class="text-[10px] text-neutral-400 italic">No specific risk tags detected</span>
                                  }
                              </div>
                          </div>
                          @if(req.preferredCoverageNotes) {
                              <div>
                                  <p class="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wider mb-1">Client Notes</p>
                                  <p class="text-neutral-700 dark:text-neutral-200 italic bg-neutral-50 dark:bg-neutral-900 p-2 rounded-md border border-neutral-100 dark:border-neutral-800">{{ req.preferredCoverageNotes }}</p>
                              </div>
                          }
                      </div>
                  } @else {
                      <div class="animate-pulse space-y-4">
                          <div class="h-4 bg-neutral-200 rounded w-1/2"></div>
                          <div class="h-4 bg-neutral-200 rounded w-3/4"></div>
                          <div class="h-4 bg-neutral-200 rounded w-2/3"></div>
                      </div>
                  }
              </div>
          </div>

          <!-- Right Column: Proposal Form -->
          <div class="lg:col-span-2">
              <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                  <div class="p-6 border-b border-neutral-50 bg-neutral-50/50">
                      <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Propose Policy Suggestions</h3>
                      <p class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 mt-1">Select products that fit the event timeline and coverage needs.</p>
                  </div>

                  <div class="p-6">
                      <form [formGroup]="suggestionForm" (ngSubmit)="submitSuggestion()" class="space-y-6">
                          
                          <!-- Policy Selection -->
                          <div>
                              <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3 flex items-center">
                                  Select Policy Products
                                  <span class="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full uppercase font-bold tracking-wider">Multi-select</span>
                              </label>

                              @if (policyProducts().length === 0) {
                                  <div class="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-center">
                                      Loading products...
                                  </div>
                              } @else {
                                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      @for (product of policyProducts(); track product.id) {
                                          <div class="relative flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm transition-all hover:border-blue-300"
                                               [ngClass]="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10': selectedProductIds.includes(product.id)}">
                                              
                                              <label class="p-4 cursor-pointer flex flex-1">
                                                  <input type="checkbox" 
                                                         [value]="product.id" 
                                                         (change)="toggleProductSelection(product.id, $event)"
                                                         class="sr-only">
                                                  <div class="flex flex-1">
                                                      <div class="flex flex-col">
                                                          <span class="block text-sm font-bold text-neutral-900 dark:text-white">{{ product.productName }}</span>
                                                          <span class="mt-1 flex items-center text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                                                              {{ product.eventTypeSupported }}
                                                          </span>
                                                          <span class="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium italic">
                                                            Rate: {{ product.baseRate }}%
                                                          </span>
                                                      </div>
                                                  </div>
                                                  <div *ngIf="selectedProductIds.includes(product.id)" class="text-blue-600">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                                                      </svg>
                                                  </div>
                                              </label>
                                              
                                               <!-- Premium Calculation Output -->
                                               @if (getPremiumsForProduct(product.id); as p) {
                                                   <div class="glass-morphism-blue p-4 border-t border-white/20 grid grid-cols-3 gap-3">
                                                       <div class="flex flex-col">
                                                           <span class="text-[8px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">Monthly Plan</span>
                                                           <span class="text-xs font-bold text-neutral-900 dark:text-white">{{ p.monthly | currency }}</span>
                                                       </div>
                                                       <div class="flex flex-col border-x border-white/20 px-3">
                                                           <span class="text-[8px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">Half-Yearly Plan</span>
                                                           <span class="text-xs font-bold text-neutral-900 dark:text-white">{{ p.sixMonths | currency }}</span>
                                                       </div>
                                                       <div class="flex flex-col">
                                                           <span class="text-[8px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">Yearly Plan</span>
                                                           <span class="text-sm font-black text-blue-600 dark:text-blue-400">{{ p.yearly | currency }}</span>
                                                       </div>
                                                   </div>
                                               }
                                          </div>
                                      }
                                  </div>
                              }

                              <!-- Validation Error -->
                              @if (suggestionForm.controls.policyProductIds.touched && selectedProductIds.length === 0) {
                                  <p class="mt-2 text-sm text-red-500 flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                                         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                      </svg>
                                      At least one product must be suggested.
                                  </p>
                              }
                          </div>

                          <!-- Remarks -->
                          <div>
                              <label for="suggestionRemarks" class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Agent Remarks (Optional)</label>
                              <textarea id="suggestionRemarks" formControlName="suggestionRemarks" rows="3" placeholder="Explain why these policies are recommended..." class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"></textarea>
                          </div>

                          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                              <button type="submit" [disabled]="isSubmitting() || selectedProductIds.length === 0" class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                  @if (isSubmitting()) {
                                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                      Sending Proposal...
                                  } @else {
                                      Send Proposal to Client
                                  }
                              </button>
                          </div>

                      </form>
                  </div>
              </div>
          </div>
      </div>
    </div>
  `
})
export class AgentRequestReviewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private agentRequestService = inject(AgentRequestService);
    private toast = inject(ToastService);
    private fb = inject(FormBuilder);

    requestId = signal<number | null>(null);
    request = signal<InsuranceRequestDto | null>(null);
    policyProducts = signal<PolicyProductDto[]>([]);

    selectedProductIds: number[] = [];
    isSubmitting = signal(false);

    suggestionForm = this.fb.group({
        policyProductIds: this.fb.control<number[]>([], [Validators.required]),
        suggestionRemarks: ['']
    });

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const parsedId = parseInt(idParam, 10);
            this.requestId.set(parsedId);
            this.loadRequest(parsedId);
            this.loadPolicyProducts();
        }
    }

    loadRequest(id: number) {
        // Find from already loaded agent requests, or if not loaded, fetch them
        this.agentRequestService.getAssignedRequests().subscribe({
            next: (reqs) => {
                const found = reqs.find(r => r.requestId === id);
                if (found) {
                    this.request.set(found);
                } else {
                    this.toast.error('Request not found or not assigned to you.');
                    this.router.navigate(['/agent/assigned-requests']);
                }
            }
        });
    }

    loadPolicyProducts() {
        this.agentRequestService.getPolicyProducts().subscribe({
            next: (products) => {
                // only active
                this.policyProducts.set(products.filter(p => p.isActive));
            }
        });
    }

    toggleProductSelection(id: number, event: any) {
        if (event.target.checked) {
            this.selectedProductIds.push(id);
        } else {
            this.selectedProductIds = this.selectedProductIds.filter(pid => pid !== id);
        }
        this.suggestionForm.controls.policyProductIds.setValue(this.selectedProductIds);
        this.suggestionForm.controls.policyProductIds.markAsTouched();
    }

    submitSuggestion() {
        if (this.suggestionForm.invalid || this.selectedProductIds.length === 0) return;

        const reqId = this.requestId();
        if (!reqId) return;

        const req = this.request();
        if (!req) return;

        this.isSubmitting.set(true);

        // Prepare suggestions with calculated premiums
        const suggestions = this.selectedProductIds.map(pid => {
            const product = this.policyProducts().find(p => p.id === pid);
            const premiums = this.calculatePremiums(product, req);
            return {
                policyProductId: pid,
                premiumMonthly: premiums.monthly,
                premium6Months: premiums.sixMonths,
                premiumYearly: premiums.yearly
            };
        });

        const dto = {
            insuranceRequestId: reqId,
            suggestionRemarks: this.suggestionForm.value.suggestionRemarks || '',
            suggestions: suggestions
        };

        this.agentRequestService.createPolicySuggestion(dto).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.toast.success('Successfully sent policy suggestions with calculated premiums!');
                this.router.navigate(['/agent/assigned-requests']);
            },
            error: (err) => {
                this.isSubmitting.set(false);
                this.toast.error(err.error?.error || 'Failed to send suggestions.');
            }
        });
    }

    calculatePremiums(product: PolicyProductDto | undefined, req: InsuranceRequestDto) {
        if (!product) return { monthly: 0, sixMonths: 0, yearly: 0 };

        const coverage = req.requestedCoverageAmount || 0;
        const baseRate = product.baseRate; // Expected as 0.03 for 3%

        // matches PremiumCalculator.cs logic
        let basePremium = coverage * baseRate;
        let riskMultiplier = 1.0;

        // Attendee tiers
        if (req.expectedAttendees > 5000) riskMultiplier += 0.30;
        else if (req.expectedAttendees > 1000) riskMultiplier += 0.20;
        else if (req.expectedAttendees > 500) riskMultiplier += 0.10;

        // Risk factors
        if (req.hasFireworks) riskMultiplier += 0.25;
        if (req.alcoholServed) riskMultiplier += 0.15;
        if (req.isOutdoorVenue) riskMultiplier += 0.10;
        if (req.hasVipPresence) riskMultiplier += 0.10;

        // duration (approximate if missing, using 4h default)
        const duration = req.durationInHours || 4;
        if (duration > 12) riskMultiplier += 0.15;
        else if (duration > 6) riskMultiplier += 0.05;

        let yearly = basePremium * riskMultiplier;

        // Enforce minimum
        yearly = Math.max(yearly, 50);

        const sixMonths = Math.round((yearly / 2) * 1.05);
        const monthly = Math.round((yearly / 12) * 1.12);

        return {
            monthly,
            sixMonths,
            yearly: Math.round(yearly)
        };
    }

    getPremiumsForProduct(productId: number) {
        const product = this.policyProducts().find(p => p.id === productId);
        const req = this.request();
        if (!product || !req) return null;
        return this.calculatePremiums(product, req);
    }
}

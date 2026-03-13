import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceRequestService } from '../../../core/services/insurance-request.service';
import { InsuranceRequestDto } from '../../../core/models/insurance-request.models';
import { CustomerPolicyService } from '../../../core/services/customer-policy.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PolicySuggestionResponseDto, SelectPolicyDto } from '../../../core/models/policy.models';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';

@Component({
    selector: 'app-suggestions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Header -->
      <div class="mb-8">
        <a class="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg mb-4 cursor-pointer" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Back to Requests
        </a>
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Policy Suggestions</h1>
        <p class="mt-2 text-neutral-500 dark:text-neutral-400 max-w-2xl font-medium">Review the coverage plans suggested by your agent and select the one that best fits your event.</p>
      </div>

      <!-- Content -->
      <div class="space-y-6">
        @if (isLoading()) {
            @for (i of [1,2,3]; track i) {
                <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm animate-pulse flex items-start gap-4">
                    <div class="w-6 h-6 rounded-full bg-neutral-200 shrink-0"></div>
                    <div class="flex-1 space-y-4">
                        <div class="h-5 bg-neutral-200 rounded w-1/3"></div>
                        <div class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3"></div>
                        <div class="flex gap-4 pt-4 border-t border-neutral-50">
                            <div class="h-4 bg-neutral-200 rounded w-20"></div>
                            <div class="h-4 bg-neutral-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            }
        } @else if (error()) {
            <div class="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium shadow-sm flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mb-2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                {{ error() }}
            </div>
        } @else if (suggestions().length === 0) {
            <div class="bg-neutral-50 dark:bg-neutral-900 p-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-center flex flex-col items-center shadow-inner">
                 <div class="w-16 h-16 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4 text-neutral-400 dark:text-neutral-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                 </div>
                 <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-2 mt-2">No Suggestions Yet</h3>
                 <p class="text-neutral-500 dark:text-neutral-400 font-medium max-w-sm mb-6">Our agents are still evaluating your request. Please check back later.</p>
                 <button (click)="loadSuggestions()" class="px-5 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 text-neutral-700 dark:text-neutral-200 font-bold rounded-lg shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-colors">
                    Refresh Page
                 </button>
            </div>
        } @else {
              <!-- Original Request Details -->
              @if (originalRequest) {
                <div class="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6">
                    <h2 class="text-xl font-bold text-neutral-900 dark:text-white mb-4">Your Request Details</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Event Type</p>
                            <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ originalRequest.eventType }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Req. Coverage</p>
                            <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ originalRequest.requestedCoverageAmount | currency: 'USD' : 'symbol' : '1.0-0' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Event Date</p>
                            <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ originalRequest.eventDate | date }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Attendees</p>
                            <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ originalRequest.expectedAttendees }}</p>
                        </div>
                    </div>
                </div>
              }

                <div class="space-y-4">
                    @for (sug of suggestions(); track sug.id) {
                        <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 border-2 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                             [ngClass]="selectedSuggestion?.id === sug.id ? 'border-blue-500 bg-blue-50/30 shadow-blue-500/10 shadow-lg' : 'border-neutral-100 dark:border-neutral-800 hover:border-blue-200'"
                             (click)="selectSuggestion(sug)">
                            
                            <div class="flex items-start gap-4">
                                <!-- Custom Radio Circle -->
                                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors bg-white dark:bg-neutral-900"
                                     [ngClass]="selectedSuggestion?.id === sug.id ? 'border-blue-500' : 'border-neutral-300'">
                                     @if (selectedSuggestion?.id === sug.id) {
                                         <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                     }
                                </div>

                                <div class="flex-1 w-full">
                                    <div class="flex justify-between items-start gap-4 mb-2">
                                        <h3 class="text-lg font-bold text-neutral-900 dark:text-white">{{ sug.policyProductName }}</h3>
                                        <span class="inline-flex px-2.5 py-1 rounded-md text-[10px] items-center gap-1 font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap">
                                            Base Rate: {{ (sug.baseRate * 100).toFixed(1) }}%
                                        </span>
                                    </div>

                                    @if (sug.suggestionRemarks) {
                                        <p class="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-4 italic pl-3 border-l-2 border-neutral-200 dark:border-neutral-800">"{{ sug.suggestionRemarks }}"</p>
                                    }

                                    <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-400 dark:text-neutral-500 pt-4 border-t border-neutral-100/50">
                                        <div class="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-500">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span class="uppercase tracking-widest text-[10px]">Min: {{ sug.minCoverageAmount | currency }}</span>
                                        </div>
                                        <div class="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-500">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span class="uppercase tracking-widest text-[10px]">Max: {{ sug.maxCoverageAmount | currency }}</span>
                                        </div>
                                    <!-- Flexible Payment Options -->
                                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                        <div class="p-3 rounded-2xl border cursor-pointer transition-all duration-200"
                                             [ngClass]="selectedPaymentOption === 'Monthly' && selectedSuggestion?.id === sug.id ? 'bg-blue-600/10 border-blue-500 shadow-sm' : 'bg-neutral-50 dark:bg-black/20 border-neutral-100 dark:border-neutral-800 hover:border-blue-200'"
                                             (click)="selectPaymentOption('Monthly', sug); $event.stopPropagation()">
                                            <p class="text-[9px] font-black uppercase tracking-tighter mb-1" [ngClass]="selectedPaymentOption === 'Monthly' && selectedSuggestion?.id === sug.id ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'">Monthly</p>
                                            <p class="text-sm font-black" [ngClass]="selectedPaymentOption === 'Monthly' && selectedSuggestion?.id === sug.id ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-900 dark:text-white'">{{ (sug.premiumMonthly || 0) | currency }}</p>
                                        </div>
                                        <div class="p-3 rounded-2xl border cursor-pointer transition-all duration-200"
                                             [ngClass]="selectedPaymentOption === 'SixMonths' && selectedSuggestion?.id === sug.id ? 'bg-blue-600/10 border-blue-500 shadow-sm' : 'bg-neutral-50 dark:bg-black/20 border-neutral-100 dark:border-neutral-800 hover:border-blue-200'"
                                             (click)="selectPaymentOption('SixMonths', sug); $event.stopPropagation()">
                                            <p class="text-[9px] font-black uppercase tracking-tighter mb-1" [ngClass]="selectedPaymentOption === 'SixMonths' && selectedSuggestion?.id === sug.id ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'">6 Months</p>
                                            <p class="text-sm font-black" [ngClass]="selectedPaymentOption === 'SixMonths' && selectedSuggestion?.id === sug.id ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-900 dark:text-white'">{{ (sug.premium6Months || 0) | currency }}</p>
                                        </div>
                                        <div class="p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative"
                                             [ngClass]="selectedPaymentOption === 'Yearly' && selectedSuggestion?.id === sug.id ? 'bg-blue-600/10 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-blue-600/5 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900'"
                                             (click)="selectPaymentOption('Yearly', sug); $event.stopPropagation()">
                                            <div class="absolute -top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-white text-[7px] font-black rounded uppercase tracking-widest">Recommended</div>
                                            <p class="text-[9px] font-black uppercase tracking-tighter mb-1 text-blue-500 dark:text-blue-400">1 Year Plan</p>
                                            <p class="text-sm font-black text-blue-600 dark:text-blue-400">{{ (sug.premiumYearly || 0) | currency }}</p>
                                        </div>
                                    </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    }
                </div>

                <!-- Apply Button -->
                <div class="sticky bottom-4 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-6 rounded-3xl border border-neutral-200/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-300"
                     [ngClass]="{'opacity-50 pointer-events-none': !selectedSuggestion}">
                     
                     <div class="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                         @if (selectedSuggestion && originalRequest) {
                             <p class="font-bold text-neutral-900 dark:text-white">Selected: <span class="text-blue-600">{{ selectedSuggestion.policyProductName }}</span></p>
                             <p class="text-xs text-neutral-500 mt-1">Payment Plan: <span class="font-black text-neutral-900 dark:text-white">{{ selectedPaymentOption === 'SixMonths' ? '6 Months' : selectedPaymentOption }}</span></p>
                         } @else {
                             <p class="text-neutral-400">Select a policy suggestion above to continue.</p>
                         }
                     </div>

                     <button (click)="onApply()" [disabled]="!selectedSuggestion || isSubmitting" class="w-full sm:w-auto group relative flex justify-center items-center px-10 py-4 border border-transparent rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden shadow-lg shadow-blue-500/30">
                       @if (isSubmitting) {
                           <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       }
                       <span class="tracking-wide">Apply for Policy</span>
                     </button>
                </div>
        }
      </div>
    </div>
  `
})
export class SuggestionsComponent implements OnInit {
    private policyService = inject(CustomerPolicyService);
    private requestService = inject(InsuranceRequestService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private toastService = inject(ToastService);
    private overlayService = inject(SuccessOverlayService);

    readonly suggestions = this.policyService.suggestions;
    readonly isLoading = this.policyService.isLoading;
    readonly error = this.policyService.error;

    requestId!: number;
    originalRequest: InsuranceRequestDto | null = null;
    isLoadingRequest = false;
    isSubmitting = false;
    selectedSuggestion: PolicySuggestionResponseDto | null = null;
    selectedPaymentOption: string = 'Yearly';

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.requestId = Number(idParam);
            this.loadSuggestions();
            this.loadRequest();
        }
    }

    loadRequest() {
        this.isLoadingRequest = true;
        this.requestService.getById(this.requestId).subscribe({
            next: (req) => {
                this.originalRequest = req;
                this.isLoadingRequest = false;
            },
            error: () => {
                this.isLoadingRequest = false;
            }
        });
    }

    loadSuggestions() {
        this.policyService.getSuggestions(this.requestId).subscribe();
    }

    selectSuggestion(sug: PolicySuggestionResponseDto) {
        this.selectedSuggestion = sug;
    }

    selectPaymentOption(option: string, sug: PolicySuggestionResponseDto) {
        this.selectedPaymentOption = option;
        this.selectedSuggestion = sug;
    }

    onApply() {
        if (!this.selectedSuggestion || !this.originalRequest) return;

        this.isSubmitting = true;

        const dto: SelectPolicyDto = {
            insuranceRequestId: this.requestId,
            policyProductId: this.selectedSuggestion.policyProductId,
            coverageAmount: this.originalRequest.requestedCoverageAmount,
            paymentOption: this.selectedPaymentOption
        };

        this.policyService.selectPolicy(dto).subscribe({
            next: () => {
                this.isSubmitting = false;

                this.overlayService.show({
                    title: 'Application Submitted!',
                    message: 'Your policy application has been submitted successfully. You can track it in My Applications.',
                    icon: 'success',
                    duration: 3500
                });

                setTimeout(() => {
                    this.router.navigate(['/customer/applications']);
                }, 1000);
            },
            error: (err: any) => {
                this.isSubmitting = false;
                this.toastService.error(err.error?.error || 'Failed to apply for policy.');
            }
        });
    }

    goBack() {
        this.router.navigate(['/customer/requests']);
    }
}

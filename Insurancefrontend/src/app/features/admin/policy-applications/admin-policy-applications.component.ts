import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';

interface PolicyAppDto {
  id: number;
  insuranceRequestId: number;
  policyProductId: number;
  coverageAmount: number;
  calculatedPremium: number;
  status: number;
  paymentOption: string;
  premiumAmountPerPayment: number;
}

interface AdminActivePolicyDto {
  id: number;
  policyNumber: string;
  policyName: string;
  customerName: string;
  agentName: string;
  status: string;
  totalPremium: number;
  coverageAmount: number;
  startDateUtc: string;
  endDateUtc: string;
  insuranceRequestId?: number;
  eventType?: string;
  eventDate?: string;
  location?: string;
  isOutdoorVenue: boolean;
  hasFireworks: boolean;
  hasVipPresence: boolean;
  alcoholServed: boolean;
  specialNotes?: string;
  hasClaims: boolean;
  claimsOfficerName?: string;
  claimStatus?: string;
  paymentOption: string;
  premiumAmountPerPayment: number;
  totalInstallments: number;
  paidInstallments: number;
}

interface PremiumEdit {
  premium: number;
  error: string;
}

@Component({
  selector: 'app-admin-policy-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Policy Applications</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">Review, set premium, then approve or reject customer policy applications.</p>
      </div>

      <!-- Success -->
      @if (successMsg()) {
        <div class="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
          {{ successMsg() }}
        </div>
      }

      <!-- Pending Applications Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden mb-8">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Pending Applications</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ apps().length }} Pending</div>
        </div>
        <div class="min-h-[200px]">
          @if (isLoading()) {
            <div class="p-6 space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="animate-pulse flex gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div class="flex-1 space-y-2"><div class="h-4 bg-neutral-200 rounded w-1/4"></div><div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div></div>
                  <div class="h-8 w-24 bg-neutral-200 rounded-lg"></div>
                </div>
              }
            </div>
          } @else if (apps().length === 0) {
            <div class="p-16 text-center flex flex-col items-center">
              <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">All Clear</h3>
              <p class="text-neutral-500 dark:text-neutral-400 max-w-sm">No pending applications to review.</p>
            </div>
          } @else {
            <div class="divide-y divide-neutral-100">
              @for (a of apps(); track a.id) {
                <div class="p-6 hover:bg-neutral-50/30 transition-colors">
                  <div class="flex flex-col lg:flex-row lg:items-start gap-6">
                    <!-- Application Details -->
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-3 flex-wrap">
                        <span class="font-bold text-neutral-900 dark:text-white text-lg">APP-{{ a.id.toString().padStart(4, '0') }}</span>
                        <span class="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md text-xs font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">REQ-{{ a.insuranceRequestId }}</span>
                        <span class="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200">Pending Review</span>
                      </div>

                      <div class="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Product</span>
                          <span class="text-sm text-neutral-800 dark:text-neutral-100 font-bold">PRD-{{ a.policyProductId.toString().padStart(4, '0') }}</span>
                        </div>
                        <div>
                          <span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Coverage Amount</span>
                          <span class="text-sm text-blue-700 font-extrabold">{{ a.coverageAmount | currency }}</span>
                        </div>
                        <div>
                          <span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Selected Plan</span>
                          <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">{{ a.paymentOption === 'SixMonths' ? '6 Months' : a.paymentOption }}</span>
                        </div>
                        <div>
                          <span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Total Auto-Calculated Premium</span>
                          <span class="text-sm text-neutral-800 dark:text-neutral-100 font-bold">{{ a.calculatedPremium | currency }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Admin Review Panel -->
                    <div class="min-w-[280px] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                      <h4 class="font-bold text-neutral-800 dark:text-neutral-100 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-500"><path fill-rule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" /></svg>
                        Set Final Premium
                      </h4>

                      <div>
                        <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                          Premium Amount ($)
                          <span class="text-neutral-400 dark:text-neutral-500 font-normal">(edit or keep auto-calculated)</span>
                        </label>
                        <input type="number" [(ngModel)]="premiumEdits[a.id].premium" [name]="'premium-'+a.id"
                          min="1" step="0.01"
                          class="block w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm">
                      </div>

                      @if (premiumEdits[a.id].error) {
                        <div class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 shrink-0"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                          {{ premiumEdits[a.id].error }}
                        </div>
                      }

                      <div class="flex gap-2 pt-1">
                        <button (click)="approve(a)" [disabled]="processingId() === a.id"
                          class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                          @if (processingId() === a.id) {
                            <svg class="animate-spin mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          }
                          Approve
                        </button>
                        <button (click)="reject(a.id)" [disabled]="processingId() === a.id"
                          class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm">
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

      <!-- Active Policies Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Active Policies</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">{{ activePolicies().length }} Active</div>
        </div>
        <div class="min-h-[200px]">
          @if (policiesLoading()) {
            <div class="p-6 space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="animate-pulse flex gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div class="flex-1 space-y-2"><div class="h-4 bg-neutral-200 rounded w-1/3"></div><div class="h-3 bg-neutral-100 rounded w-1/2"></div></div>
                </div>
              }
            </div>
          } @else if (activePolicies().length === 0) {
            <div class="p-12 text-center flex flex-col items-center">
              <div class="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400 dark:text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-6.9 7.467L3.551 4.63a48.16 48.16 0 0111.898 0l-2.8 13.588c-.085.41-.526.636-.911.468L9 17.347l-2.738 1.34a.75.75 0 01-.911-.468z" /></svg>
              </div>
              <h3 class="text-neutral-900 dark:text-white font-extrabold text-lg mb-1">No Active Policies</h3>
              <p class="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm">Policies will appear here once applications are approved and payments are completed.</p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <th class="px-6 py-4">Policy #</th>
                    <th class="px-6 py-4">Product</th>
                    <th class="px-6 py-4">Customer</th>
                    <th class="px-6 py-4">Agent</th>
                    <th class="px-6 py-4">Coverage</th>
                    <th class="px-6 py-4">Payment Plan</th>
                    <th class="px-6 py-4">Paid Progress</th>
                    <th class="px-6 py-4">Period</th>
                    <th class="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                  @for (p of activePolicies(); track p.id) {
                    <tr class="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer" (click)="selectedPolicy.set(p)">
                      <td class="px-6 py-4">
                        <span class="font-bold text-neutral-900 dark:text-white">{{ p.policyNumber }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-neutral-700 dark:text-neutral-200">{{ p.policyName }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <div class="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {{ p.customerName.charAt(0).toUpperCase() }}
                          </div>
                          <span class="font-medium text-neutral-800 dark:text-neutral-100">{{ p.customerName }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <div class="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {{ p.agentName.charAt(0).toUpperCase() }}
                          </div>
                          <span class="font-medium text-neutral-800 dark:text-neutral-100">{{ p.agentName }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100 text-xs">{{ p.coverageAmount | currency }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="font-bold text-blue-600 block">{{ p.paymentOption === 'SixMonths' ? '6 Months' : p.paymentOption }}</span>
                        <span class="text-[10px] text-neutral-400 font-medium">Tot: {{ p.totalPremium | currency }}</span>
                      </td>
                      <td class="px-6 py-4 min-w-[140px]">
                        <div class="flex flex-col gap-1.5">
                          <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase">
                            <span>Paid: {{ p.paidInstallments }} / {{ p.totalInstallments }}</span>
                            <span>{{ (p.paidInstallments / p.totalInstallments) | percent:'1.0-0' }}</span>
                          </div>
                          <div class="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 transition-all duration-500" [style.width]="(p.paidInstallments / p.totalInstallments) * 100 + '%'"></div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-neutral-500 dark:text-neutral-400 font-medium text-xs">
                        <div>{{ p.startDateUtc | date:'mediumDate' }}</div>
                        <div class="text-neutral-400">to {{ p.endDateUtc | date:'mediumDate' }}</div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                              [ngClass]="{
                                'bg-green-50 text-green-700 border-green-200': p.status === 'Active',
                                'bg-red-50 text-red-700 border-red-200': p.status === 'Expired' || p.status === 'Cancelled',
                                'bg-amber-50 text-amber-700 border-amber-200': p.status !== 'Active' && p.status !== 'Expired' && p.status !== 'Cancelled'
                              }">
                          {{ p.status }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Active Policy Details Modal -->
    @if (selectedPolicy(); as policy) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in" (click)="selectedPolicy.set(null)">
        <div class="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-neutral-200/50 dark:border-neutral-800/50" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
            <div>
              <h2 class="text-xl font-extrabold text-neutral-900 dark:text-white">{{ policy.policyName }}</h2>
              <p class="text-sm font-bold text-neutral-500 dark:text-neutral-400 mt-0.5">{{ policy.policyNumber }}</p>
            </div>
            <button (click)="selectedPolicy.set(null)" class="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            <!-- Coverage & Financials -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <div>
                <p class="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Status</p>
                <span class="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">{{ policy.status }}</span>
              </div>
              <div>
                <p class="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Coverage</p>
                <p class="text-sm font-extrabold text-blue-900 dark:text-blue-100">{{ policy.coverageAmount | currency }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Premium</p>
                <p class="text-sm font-extrabold text-blue-900 dark:text-blue-100">{{ policy.totalPremium | currency }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Period Ends</p>
                <p class="text-sm font-bold text-blue-900 dark:text-blue-100">{{ policy.endDateUtc | date:'shortDate' }}</p>
              </div>
            </div>

            <!-- Event Details -->
            <div>
              <h3 class="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 mb-3 uppercase tracking-wider">Event Details</h3>
              @if (policy.insuranceRequestId) {
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1">Event Type</span>
                    <span class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{{ policy.eventType || 'N/A' }}</span>
                  </div>
                  <div class="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1">Event Date</span>
                    <span class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{{ policy.eventDate ? (policy.eventDate | date:'mediumDate') : 'N/A' }}</span>
                  </div>
                  <div class="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 col-span-2">
                    <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1">Location</span>
                    <span class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{{ policy.location || 'N/A' }}</span>
                  </div>
                  
                  <!-- Risks Section -->
                  <div class="col-span-2 grid grid-cols-2 gap-3">
                    <div [class]="'p-2 rounded-lg border flex items-center gap-2 ' + (policy.isOutdoorVenue ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-neutral-50 dark:bg-neutral-800/20 border-neutral-100 dark:border-neutral-800 text-neutral-400')">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center bg-white border border-current">
                        @if (policy.isOutdoorVenue) { <span class="text-[10px] uppercase font-bold">Y</span> }
                        @else { <span class="text-[10px] uppercase font-bold text-neutral-300">N</span> }
                      </div>
                      <span class="text-xs font-bold uppercase tracking-tight">Outdoor Venue</span>
                    </div>
                    <div [class]="'p-2 rounded-lg border flex items-center gap-2 ' + (policy.alcoholServed ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-neutral-50 dark:bg-neutral-800/20 border-neutral-100 dark:border-neutral-800 text-neutral-400')">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center bg-white border border-current">
                        @if (policy.alcoholServed) { <span class="text-[10px] uppercase font-bold">Y</span> }
                        @else { <span class="text-[10px] uppercase font-bold text-neutral-300">N</span> }
                      </div>
                      <span class="text-xs font-bold uppercase tracking-tight">Alcohol Served</span>
                    </div>
                    <div [class]="'p-2 rounded-lg border flex items-center gap-2 ' + (policy.hasFireworks ? 'bg-red-50 border-red-200 text-red-700' : 'bg-neutral-50 dark:bg-neutral-800/20 border-neutral-100 dark:border-neutral-800 text-neutral-400')">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center bg-white border border-current">
                        @if (policy.hasFireworks) { <span class="text-[10px] uppercase font-bold">Y</span> }
                        @else { <span class="text-[10px] uppercase font-bold text-neutral-300">N</span> }
                      </div>
                      <span class="text-xs font-bold uppercase tracking-tight">Fireworks</span>
                    </div>
                    <div [class]="'p-2 rounded-lg border flex items-center gap-2 ' + (policy.hasVipPresence ? 'bg-red-50 border-red-200 text-red-700' : 'bg-neutral-50 dark:bg-neutral-800/20 border-neutral-100 dark:border-neutral-800 text-neutral-400')">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center bg-white border border-current">
                        @if (policy.hasVipPresence) { <span class="text-[10px] uppercase font-bold">Y</span> }
                        @else { <span class="text-[10px] uppercase font-bold text-neutral-300">N</span> }
                      </div>
                      <span class="text-xs font-bold uppercase tracking-tight">VIP Guests</span>
                    </div>
                  </div>

                  @if (policy.specialNotes) {
                    <div class="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 col-span-2">
                      <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1">Special Notes</span>
                      <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400 italic">"{{ policy.specialNotes }}"</p>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-sm text-neutral-500 italic bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">Event details not available for this policy.</p>
              }
            </div>

            <!-- Stakeholders -->
            <div>
              <h3 class="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 mb-3 uppercase tracking-wider">Stakeholders</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">{{ policy.customerName.charAt(0).toUpperCase() }}</div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Customer</span>
                    <span class="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{{ policy.customerName }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">{{ policy.agentName.charAt(0).toUpperCase() }}</div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Assigned Agent</span>
                    <span class="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{{ policy.agentName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Claims Information -->
            <div>
              <h3 class="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 mb-3 uppercase tracking-wider">Claim Status</h3>
              @if (policy.hasClaims) {
                <div class="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30 p-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-500 flex flex-shrink-0 items-center justify-center -ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <div class="text-sm font-bold text-amber-900 dark:text-amber-100">Claim Registered</div>
                        <div class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">{{ policy.claimStatus }}</div>
                      </div>
                    </div>
                    
                    @if (policy.claimsOfficerName) {
                      <div class="sm:text-right border-t sm:border-t-0 sm:border-l border-amber-200/50 dark:border-amber-800/30 pt-3 sm:pt-0 sm:pl-4">
                        <div class="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 mb-0.5">Assigned Officer</div>
                        <div class="text-sm font-bold text-amber-900 dark:text-amber-100">{{ policy.claimsOfficerName }}</div>
                      </div>
                    } @else {
                      <div class="sm:text-right border-t sm:border-t-0 sm:border-l border-amber-200/50 dark:border-amber-800/30 pt-3 sm:pt-0 sm:pl-4">
                        <div class="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 mb-0.5">Assigned Officer</div>
                        <div class="text-sm font-bold text-amber-900 dark:text-amber-100 italic">Unassigned</div>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 flex items-center justify-center -ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-neutral-800 dark:text-neutral-200">No Claims Registered</div>
                    <div class="text-xs text-neutral-500 dark:text-neutral-400">This policy currently has a clean record.</div>
                  </div>
                </div>
              }
            </div>

          </div>
          <div class="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end">
            <button (click)="selectedPolicy.set(null)" class="px-5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors shadow-sm">Close Details</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminPolicyApplicationsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  apps = signal<PolicyAppDto[]>([]);
  activePolicies = signal<AdminActivePolicyDto[]>([]);
  isLoading = signal(true);
  policiesLoading = signal(true);
  processingId = signal<number | null>(null);
  successMsg = signal<string | null>(null);
  selectedPolicy = signal<AdminActivePolicyDto | null>(null);
  premiumEdits: Record<number, PremiumEdit> = {};

  private overlayService = inject(SuccessOverlayService);

  ngOnInit() {
    this.load();
    this.loadActivePolicies();
  }

  load() {
    this.isLoading.set(true);
    this.http.get<PolicyAppDto[]>(`${this.apiBase}/admin/policy-applications/pending`).subscribe({
      next: data => {
        this.apps.set(data);
        data.forEach(a => {
          if (!this.premiumEdits[a.id]) {
            this.premiumEdits[a.id] = { premium: a.calculatedPremium, error: '' };
          }
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadActivePolicies() {
    this.policiesLoading.set(true);
    this.http.get<AdminActivePolicyDto[]>(`${this.apiBase}/active-policies/all`).subscribe({
      next: data => {
        this.activePolicies.set(data);
        this.policiesLoading.set(false);
      },
      error: () => this.policiesLoading.set(false)
    });
  }

  approve(app: PolicyAppDto) {
    const edit = this.premiumEdits[app.id];
    edit.error = '';

    if (!edit.premium || edit.premium <= 0) {
      edit.error = 'Premium must be greater than zero.';
      return;
    }

    this.processingId.set(app.id);
    this.http.put(`${this.apiBase}/admin/policy-applications/${app.id}/approve`, { premium: edit.premium }).subscribe({
      next: () => {
        this.processingId.set(null);

        this.overlayService.show({
          title: 'Policy Application Approved',
          message: `Application APP-${app.id.toString().padStart(4, '0')} has been approved for $${edit.premium.toFixed(2)}.`,
          icon: 'success',
          duration: 3000
        });

        this.load();
        this.loadActivePolicies();
      },
      error: (err: HttpErrorResponse | any) => {
        this.processingId.set(null);
        edit.error = err.error?.message || err.error?.error || err.error || 'Failed to approve.';
      }
    });
  }

  reject(id: number) {
    this.processingId.set(id);
    this.http.put(`${this.apiBase}/admin/policy-applications/${id}/reject`, {}).subscribe({
      next: () => {
        this.processingId.set(null);

        this.overlayService.show({
          title: 'Application Rejected',
          message: `Application APP-${id.toString().padStart(4, '0')} was rejected.`,
          icon: 'success',
          duration: 2500
        });

        this.load();
      },
      error: (err: HttpErrorResponse | any) => {
        this.processingId.set(null);
        if (this.premiumEdits[id]) this.premiumEdits[id].error = err.error?.error || 'Failed to reject.';
      }
    });
  }
}

import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentCommissionService } from '../../../core/services/agent-commission.service';

@Component({
    selector: 'app-agent-commissions',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Page Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">My Commissions</h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Track your earned commissions from approved policies.</p>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <!-- Total Earned -->
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                      <path d="M10.75 10.818a3.75 3.75 0 100-5.636 3.75 3.75 0 000 5.636zM1 17.25A7.75 7.75 0 0110.75 9.5a7.75 7.75 0 019.75 7.75.75.75 0 01-.75.75H1.75a.75.75 0 01-.75-.75z" />
                  </svg>
              </div>
              <div>
                  <p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Total Earned</p>
                  <p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalEarned() | currency }}</p>
              </div>
          </div>
          <!-- Paid -->
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
              </div>
              <div>
                  <p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Paid Out</p>
                  <p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalPaid() | currency }}</p>
              </div>
          </div>
          <!-- Pending -->
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
                  </svg>
              </div>
              <div>
                  <p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Pending</p>
                  <p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalPending() | currency }}</p>
              </div>
          </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Commission Ledger</h3>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-inner">
                {{ commissions().length }} Records
            </div>
        </div>

        <div class="overflow-x-auto min-h-[300px]">
            @if (isLoading()) {
              <div class="p-6 space-y-4">
                  @for (i of [1,2,3,4]; track i) {
                      <div class="animate-pulse flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                          <div class="h-12 w-12 bg-neutral-200 rounded-lg"></div>
                          <div class="flex-1 space-y-2">
                              <div class="h-4 bg-neutral-200 rounded w-1/4"></div>
                              <div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div>
                          </div>
                          <div class="h-8 w-24 bg-neutral-200 rounded-lg"></div>
                      </div>
                  }
              </div>
            } @else if (error()) {
                <div class="p-12 text-center flex flex-col items-center justify-center h-full">
                    <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                    </div>
                    <p class="text-red-600 font-bold mb-2">Failed to load commissions</p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">{{ error() }}</p>
                </div>
            } @else if (commissions().length === 0) {
                <div class="p-16 text-center flex flex-col items-center">
                    <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                    </div>
                    <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">No Commissions Yet</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-base max-w-sm mb-6">Your commission records will appear here once policies you facilitated are approved and paid.</p>
                </div>
            } @else {
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">Policy ID</th>
                            <th class="px-6 py-4">Rate</th>
                            <th class="px-6 py-4">Amount</th>
                            <th class="px-6 py-4">Generated</th>
                            <th class="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-100 text-sm">
                        @for (c of commissions(); track c.id) {
                            <tr class="hover:bg-neutral-50/50 transition-colors">
                                <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">COM-{{ c.id.toString().padStart(4, '0') }}</td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold border border-neutral-200 dark:border-neutral-800">POL-{{ c.activePolicyId.toString().padStart(4, '0') }}</span>
                                </td>
                                <td class="px-6 py-4 font-bold text-neutral-800 dark:text-neutral-100">{{ (c.commissionRate * 100).toFixed(1) }}%</td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">{{ c.commissionAmount | currency }}</span>
                                </td>
                                <td class="px-6 py-4 text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">{{ c.generatedAtUtc | date:'mediumDate' }}</td>
                                <td class="px-6 py-4 text-right">
                                    @if (c.isPaid) {
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 mr-1">
                                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                            </svg>
                                            Paid
                                        </span>
                                    } @else {
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 mr-1">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
                                            </svg>
                                            Pending
                                        </span>
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
  `
})
export class AgentCommissionsComponent implements OnInit {
    private commissionService = inject(AgentCommissionService);

    readonly commissions = this.commissionService.commissions;
    readonly isLoading = this.commissionService.isLoading;
    readonly error = this.commissionService.error;

    totalEarned = computed(() =>
        this.commissions().reduce((sum, c) => sum + c.commissionAmount, 0)
    );
    totalPaid = computed(() =>
        this.commissions().filter(c => c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0)
    );
    totalPending = computed(() =>
        this.commissions().filter(c => !c.isPaid).reduce((sum, c) => sum + c.commissionAmount, 0)
    );

    ngOnInit() {
        this.commissionService.getMyCommissions().subscribe();
    }
}

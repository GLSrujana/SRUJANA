import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerPolicyService } from '../../../core/services/customer-policy.service';

@Component({
    selector: 'app-my-applications',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Active Applications</h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Track your selected policies currently under underwriter review.</p>
        </div>
        <!-- Can add a refresh button or link back to requests -->
        <a routerLink="/customer/requests" class="px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold rounded-xl shadow-sm hover:bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-neutral-400 dark:text-neutral-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Review More Forms
        </a>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Application Queue</h3>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-inner">
                {{ applications().length }} Tracked Entries
            </div>
        </div>

        <!-- Content Area -->
        <div class="overflow-x-auto min-h-[300px]">
             @if (isLoading()) {
              <div class="p-6 space-y-4">
                  @for (i of [1,2,3]; track i) {
                      <div class="animate-pulse flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                          <div class="h-10 w-10 bg-neutral-200 rounded-full"></div>
                          <div class="flex-1 space-y-2">
                              <div class="h-4 bg-neutral-200 rounded w-1/4"></div>
                              <div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div>
                          </div>
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
                    <p class="text-red-600 font-bold mb-2">Matrix Loading Error</p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">{{ error() }}</p>
                </div>
            } @else if (applications().length === 0) {
                 <div class="p-16 text-center flex flex-col items-center">
                    <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500 shadow-sm relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 relative z-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        <div class="absolute inset-0 border-2 border-blue-400 rounded-full scale-110 opacity-20"></div>
                    </div>
                    <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">No Active Applications</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-base max-w-md mb-6 leading-relaxed">You haven't applied for any policies yet. Once you complete a request and select a suggested package, your applications will appear right here.</p>
                </div>
            } @else {
               <table class="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                            <th class="px-6 py-4">App ID</th>
                            <th class="px-6 py-4">Policy # (Product Mapping)</th>
                            <th class="px-6 py-4">Coverage Selected</th>
                            <th class="px-6 py-4">Status</th>
                            <!-- If the backend adds a created date, you would place it here! -->
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-100/80 text-sm">
                        @for (app of applications(); track app.id) {
                            <tr class="hover:bg-neutral-50/70 transition-colors group">
                                <td class="px-6 py-4">
                                     <div class="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 max-w-max font-bold px-2 py-1 rounded-md text-xs border border-neutral-200 dark:border-neutral-800 border-b-2">
                                         APP-{{ app.id.toString().padStart(4, '0') }}
                                     </div>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="font-extrabold text-blue-900 truncate">PRD-{{ app.policyProductId.toString().padStart(4, '0') }}</p>
                                    <p class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1.5 ">
                                       <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                       Tied to Request: {{ app.insuranceRequestId }}
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-neutral-800 dark:text-neutral-100 text-base bg-blue-50/50 inline-block px-2 py-0.5 rounded border border-blue-100 shadow-sm">{{ app.coverageAmount | currency }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold leading-none border uppercase tracking-wider shadow-sm" 
                                          [ngClass]="getStatusClasses(app.status)">
                                        {{ getStatusText(app.status) }}
                                    </span>
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
export class MyApplicationsComponent implements OnInit {
    private policyService = inject(CustomerPolicyService);

    readonly applications = this.policyService.applications;
    readonly isLoading = this.policyService.isLoading;
    readonly error = this.policyService.error;

    ngOnInit() {
        this.policyService.getMyApplications().subscribe();
    }

    getStatusText(status: number): string {
        const labels: Record<number, string> = {
            1: 'Draft', 2: 'Submitted', 3: 'Forwarded',
            4: 'Approved', 5: 'Rejected'
        };
        return labels[status] || 'Unknown';
    }

    getStatusClasses(status: number): string {
        switch (status) {
            case 1: return 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 ring-1 ring-neutral-100 ring-offset-1';
            case 2: return 'bg-amber-50 text-amber-700 border-amber-200/50 ring-1 ring-amber-100 ring-offset-1';
            case 3: return 'bg-blue-50 text-blue-700 border-blue-200/50 ring-1 ring-blue-100 ring-offset-1';
            case 4: return 'bg-blue-50 text-blue-700 border-blue-200/50 ring-1 ring-blue-100 ring-offset-1';
            case 5: return 'bg-red-50 text-red-700 border-red-200/50 ring-1 ring-red-100 ring-offset-1';
            default: return 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200';
        }
    }
}

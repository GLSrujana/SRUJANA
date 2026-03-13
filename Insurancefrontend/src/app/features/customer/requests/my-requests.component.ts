import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InsuranceRequestService } from '../../../core/services/insurance-request.service';

@Component({
    selector: 'app-my-requests',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">My Requests</h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Manage and track your active insurance requests.</p>
        </div>
        <a routerLink="/customer/create-request" class="group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:shadow-lg hover:-tranneutral-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 overflow-hidden shadow-md shadow-blue-500/30">
          <span class="absolute inset-0 w-full h-full bg-white/20 tranneutral-y-full hover:tranneutral-y-0 transition-transform duration-300 ease-out z-0"></span>
          <span class="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Request
          </span>
        </a>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col">
        <!-- Search Filter -->
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="relative w-full max-w-md group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                    </svg>
                </div>
                <!-- Binding searchTerm -->
                <input type="text" [(ngModel)]="searchTerm" placeholder="Search by event type or location..." class="block w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium shadow-sm">
            </div>
            
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">
                {{ filteredRequests().length }} requests found
            </div>
        </div>

        <!-- Table / Content -->
        <div class="overflow-x-auto min-h-[300px]">
            @if (isLoading()) {
              <div class="p-6 space-y-4">
                  @for (i of [1,2,3,4,5]; track i) {
                      <div class="animate-pulse flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                          <div class="h-12 w-12 bg-neutral-200 rounded-lg"></div>
                          <div class="flex-1 space-y-2">
                              <div class="h-4 bg-neutral-200 rounded w-1/4"></div>
                              <div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div>
                          </div>
                          <div class="h-8 w-24 bg-neutral-200 rounded-full hidden sm:block"></div>
                          <div class="h-8 w-16 bg-neutral-200 rounded-lg"></div>
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
                    <p class="text-red-600 font-bold mb-2">Failed to load requests</p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">{{ error() }}</p>
                </div>
            } @else if (requests().length === 0) {
                <div class="p-16 text-center flex flex-col items-center">
                    <div class="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400 dark:text-neutral-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">No requests yet</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-base max-w-sm mb-6">Create your first insurance request to explore policy coverage and start protecting your event.</p>
                    <a routerLink="/customer/create-request" class="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg">
                        Create Request
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                           <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            } @else if (filteredRequests().length === 0) {
                <!-- No search results -->
                <div class="p-16 text-center">
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">No requests match your search criteria. Try a different term.</p>
                </div>
            } @else {
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                            <th class="px-6 py-4">Request #</th>
                            <th class="px-6 py-4">Event Details</th>
                            <th class="px-6 py-4">Coverage Asked</th>
                            <th class="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-100 text-sm">
                        @for (req of filteredRequests(); track req.requestId) {
                            <tr class="hover:bg-neutral-50/50 transition-colors group">
                                <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">REQ-{{ req.requestId.toString().padStart(4, '0') }}</td>
                                <td class="px-6 py-4 max-w-[250px]">
                                    <p class="font-bold text-neutral-900 dark:text-white truncate">{{ req.eventType || 'Event' }}</p>
                                    <p class="text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 mt-1 truncate flex items-center gap-1.5 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500">
                                            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.831 13.831 0 002.673 1.97l.02.011a5.692 5.692 0 00.182.086zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                        </svg>
                                        {{ req.location }}
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-neutral-700 dark:text-neutral-200">{{ req.requestedCoverageAmount | currency }}</p>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    @if (req.status === 3) {
                                      <a [routerLink]="['/customer/requests', req.requestId, 'suggestions']" 
                                         class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[13px] font-bold bg-white dark:bg-neutral-900 text-blue-600 border-2 border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 whitespace-nowrap">
                                          View Suggestions
                                      </a>
                                    } @else if (req.status === 4) {
                                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border leading-none text-green-700 bg-green-50 border-green-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                                        Active
                                      </span>
                                    } @else {
                                      <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border leading-none" 
                                            [ngClass]="getStatusClasses(req.status)">
                                          {{ getStatusText(req.status) }}
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
export class MyRequestsComponent implements OnInit {
    private requestService = inject(InsuranceRequestService);

    readonly requests = this.requestService.requests;
    readonly isLoading = this.requestService.isLoading;
    readonly error = this.requestService.error;

    searchTerm = signal<string>('');

    // Computed signal to filter data dynamically without impure pipes
    filteredRequests = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.requests();

        return this.requests().filter(r =>
            (r.eventType && r.eventType.toLowerCase().includes(term)) ||
            (r.location && r.location.toLowerCase().includes(term))
        );
    });

    ngOnInit() {
        this.requestService.getMyRequests().subscribe();
    }

    getStatusText(status: number): string {
        const labels: Record<number, string> = {
            1: 'Submitted', 2: 'Assigned', 3: 'Suggestions Sent',
            4: 'Converted', 5: 'Closed'
        };
        return labels[status] || 'Unknown';
    }

    getStatusClasses(status: number): string {
        switch (status) {
            case 1: return 'bg-amber-50 text-amber-700 border-amber-200';
            case 2: return 'bg-blue-50 text-blue-700 border-blue-200';
            case 3: return 'bg-blue-50 text-blue-700 border-blue-200';
            case 4: return 'bg-blue-50 text-blue-700 border-blue-200';
            case 5: return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300';
            default: return 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 border-neutral-200';
        }
    }
}

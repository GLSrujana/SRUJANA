import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRequestService } from '../../../core/services/agent-request.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-assigned-requests',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white relative flex flex-col pb-20 overflow-x-hidden transition-colors duration-500">
      <!-- Ambient Glob -->
      <div class="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen dark:mix-blend-color-dodge">
        <div class="h-[40rem] w-[40rem] bg-blue-500/10 rounded-full blur-[140px] absolute -bottom-20 -left-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div class="h-[50rem] w-[50rem] bg-yellow-600/10 rounded-full blur-[180px] absolute top-0 right-0 transform -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
      </div>

      <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up relative z-10">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Assigned Requests</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Review and process customer requests assigned to you.</p>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">My Triage Queue</h3>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-inner">
                {{ requests().length }} Actions Required
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
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    </div>
                    <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">Inbox Zero!</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-base max-w-sm mb-6">You have no pending requests to process right now. Enjoy the break!</p>
                </div>
            } @else {
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                            <th class="px-6 py-4">Request #</th>
                            <th class="px-6 py-4">Event Details</th>
                            <th class="px-6 py-4">Coverage</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-100 text-sm">
                        @for (req of requests(); track req.requestId) {
                            <tr class="hover:bg-neutral-50/50 transition-colors group">
                                <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">REQ-{{ req.requestId.toString().padStart(4, '0') }}</td>
                                <td class="px-6 py-4">
                                    <p class="font-bold text-neutral-900 dark:text-white truncate max-w-xs">{{ req.eventType || 'Event' }}</p>
                                    <p class="text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 mt-1 truncate max-w-xs flex items-center gap-1.5 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500">
                                            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.831 13.831 0 002.673 1.97l.02.011a5.692 5.692 0 00.182.086zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                        </svg>
                                        {{ req.location }}
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-bold border border-green-200">
                                        {{ req.requestedCoverageAmount | currency }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border leading-none"
                                          [ngClass]="{
                                            'bg-blue-50 text-blue-700 border-blue-200': req.status === 2 || req.status === 3 || req.status === 4,
                                            'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300': req.status === 5
                                          }">{{ getStatusText(req.status) }}</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    @if (req.status === 2) {
                                      <button [routerLink]="['/agent/requests', req.requestId, 'review']" class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 whitespace-nowrap">
                                          Review & Suggest
                                      </button>
                                    } @else if (req.status === 3) {
                                      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                                        Suggestions Sent
                                      </span>
                                    } @else if (req.status === 4) {
                                      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                                        Customer Applied
                                      </span>
                                    } @else {
                                      <span class="text-xs text-neutral-400 dark:text-neutral-500">—</span>
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
export class AssignedRequestsComponent implements OnInit {
    private agentRequestService = inject(AgentRequestService);

    readonly requests = this.agentRequestService.assignedRequests;
    readonly isLoading = this.agentRequestService.isLoading;
    readonly error = this.agentRequestService.error;

    ngOnInit() {
        this.agentRequestService.getAssignedRequests().subscribe();
    }

    getStatusText(status: number): string {
        const labels: Record<number, string> = {
            1: 'Submitted', 2: 'Assigned', 3: 'Suggestions Sent',
            4: 'Converted', 5: 'Closed'
        };
        return labels[status] || 'Unknown';
    }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRequestService, AssignAgentDto } from '../../../core/services/admin-request.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InsuranceRequestDto } from '../../../core/models/insurance-request.models';

@Component({
    selector: 'app-unassigned-requests',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Unassigned Requests</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Triage incoming customer requests by assigning them to registered Agents.</p>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Pending Triage Queue</h3>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-inner">
                {{ requests().length }} Applications
            </div>
        </div>

        <!-- Table / Content -->
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
                    <h3 class="text-neutral-900 dark:text-white font-extrabold text-xl mb-2">All Caught Up!</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-base max-w-sm mb-6">There are no unassigned customer requests hanging in the queue.</p>
                </div>
            } @else {
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                            <th class="px-6 py-4">Request #</th>
                            <th class="px-6 py-4">Event Data</th>
                            <th class="px-6 py-4">Client ID</th>
                            <th class="px-6 py-4 text-right">Assign Agent</th>
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
                                    @if (req.documentType) {
                                        <div class="mt-2 flex items-center gap-2">
                                            <button (click)="openDocument(req)" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100/50 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                {{ req.documentType }}
                                            </button>
                                        </div>
                                    }
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold border border-neutral-200 dark:border-neutral-800">User: {{ req.customerId }}</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <select 
                                               #agentIdInput
                                               (change)="0"
                                               class="w-48 pl-3 pr-8 py-2 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors shadow-sm font-semibold appearance-none">
                                            <option value="" disabled selected>Select Agent...</option>
                                            @for (agent of availableAgents(); track agent.id) {
                                                <option [value]="agent.id">{{ agent.fullName }}</option>
                                            }
                                        </select>
                                        
                                        <button (click)="assignAgent(req.requestId, agentIdInput.value)" 
                                                [disabled]="assigningMap()[req.requestId] || !agentIdInput.value"
                                                class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 whitespace-nowrap disabled:opacity-50">
                                            @if (assigningMap()[req.requestId]) {
                                               <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                               Assigning
                                            } @else {
                                               Assign
                                            }
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            }
        </div>
      </div>

    <!-- Document Modal -->
    @if (selectedDoc(); as doc) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedDoc.set(null)">
            <div class="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-pop-in" (click)="$event.stopPropagation()">
                <div class="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-black text-neutral-900 dark:text-white outfit-font">Document Preview</h3>
                        <p class="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">{{ doc.documentType }} - Customer ID: {{ doc.customerId }}</p>
                    </div>
                    <button (click)="selectedDoc.set(null)" class="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-8 bg-neutral-50 dark:bg-neutral-950/50 flex items-center justify-center min-h-[500px]">
                    @if (doc.documentData?.startsWith('data:image/')) {
                        <img [src]="doc.documentData" class="max-w-full h-auto rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800">
                    } @else if (doc.documentData?.startsWith('data:application/pdf')) {
                        <iframe [src]="getSafeUrl(doc.documentData!)" class="w-full h-[600px] rounded-lg border border-neutral-200 dark:border-neutral-800"></iframe>
                    } @else {
                        <div class="text-center p-12">
                            <div class="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-neutral-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <p class="text-neutral-500 font-bold uppercase tracking-widest text-xs">Preview Not Available</p>
                            <a [href]="doc.documentData" download="document" class="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">Download for Inspection</a>
                        </div>
                    }
                </div>
            </div>
        </div>
    }
    </div>
  `
})
export class UnassignedRequestsComponent implements OnInit {
    private adminService = inject(AdminRequestService);
    private toast = inject(ToastService);
    private overlay = inject(SuccessOverlayService);
    private sanitizer = inject(DomSanitizer);

    readonly requests = this.adminService.unassignedRequests;
    readonly availableAgents = this.adminService.availableAgents;
    readonly isLoading = this.adminService.isLoading;
    readonly error = this.adminService.error;

    assigningMap = signal<Record<number, boolean>>({});
    selectedDoc = signal<InsuranceRequestDto | null>(null);

    openDocument(req: any) {
        this.selectedDoc.set(req);
    }

    getSafeUrl(base64: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.adminService.getUnassignedRequests().subscribe();
        this.adminService.getAgents().subscribe();
    }

    assignAgent(requestId: number, agentIdStr: string) {
        const agentId = parseInt(agentIdStr, 10);
        if (!agentId || agentId <= 0) return;

        // Set loading state for this specific row
        this.assigningMap.update(map => ({ ...map, [requestId]: true }));

        const dto: AssignAgentDto = {
            requestId,
            agentId,
            adminRemarks: 'Assigned automatically via App Shell'
        };

        this.adminService.assignAgent(dto).subscribe({
            next: () => {
                this.assigningMap.update(map => ({ ...map, [requestId]: false }));
                this.overlay.show({
                    title: 'Agent Assigned',
                    message: `Request #${requestId} has been successfully assigned.`,
                    icon: 'success',
                    duration: 2500
                });

                // Refresh list natively:
                this.loadData();
            },
            error: (err) => {
                const e = err.error?.error || err.message || 'Failed to assign agent';
                this.toast.error(e);
                this.assigningMap.update(map => ({ ...map, [requestId]: false }));
            }
        });
    }
}

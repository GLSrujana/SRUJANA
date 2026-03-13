import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommissionDto } from '../../../core/models/commission.models';

@Component({
    selector: 'app-admin-commissions',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">All Commissions</h1>
        <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Manage agent commission payouts across the platform.</p>
      </div>

      <!-- KPI -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path d="M10.75 10.818a3.75 3.75 0 100-5.636 3.75 3.75 0 000 5.636z"/></svg></div>
          <div><p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Total</p><p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalAll() | currency }}</p></div>
        </div>
        <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg></div>
          <div><p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Paid</p><p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalPaid() | currency }}</p></div>
        </div>
        <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd"/></svg></div>
          <div><p class="text-xs text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Pending</p><p class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalPending() | currency }}</p></div>
        </div>
      </div>

      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Commission Ledger</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ commissions().length }} Records</div>
        </div>
        <div class="overflow-x-auto min-h-[200px]">
          @if (isLoading()) {
            <div class="p-6"><div class="animate-pulse h-32 bg-neutral-100 dark:bg-neutral-800 rounded"></div></div>
          } @else if (commissions().length === 0) {
            <div class="p-12 text-center text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">No commissions generated yet.</div>
          } @else {
            <table class="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4">Agent ID</th>
                  <th class="px-6 py-4">Policy ID</th>
                  <th class="px-6 py-4">Rate</th>
                  <th class="px-6 py-4">Amount</th>
                  <th class="px-6 py-4">Generated</th>
                  <th class="px-6 py-4 text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-sm">
                @for (c of commissions(); track c.id) {
                  <tr class="hover:bg-neutral-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">COM-{{ c.id.toString().padStart(4, '0') }}</td>
                    <td class="px-6 py-4 font-medium">Agent #{{ c.agentId }}</td>
                    <td class="px-6 py-4"><span class="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">POL-{{ c.activePolicyId }}</span></td>
                    <td class="px-6 py-4 font-bold">{{ (c.commissionRate * 100).toFixed(1) }}%</td>
                    <td class="px-6 py-4"><span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold border border-blue-100">{{ c.commissionAmount | currency }}</span></td>
                    <td class="px-6 py-4 text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">{{ c.generatedAtUtc | date:'mediumDate' }}</td>
                    <td class="px-6 py-4 text-right">
                      @if (c.isPaid) {
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">Paid</span>
                      } @else {
                        <button (click)="markPaid(c.id)" [disabled]="payingId() === c.id"
                          class="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                          @if (payingId() === c.id) { Processing... } @else { Mark Paid }
                        </button>
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
export class AdminCommissionsComponent implements OnInit {
    private http = inject(HttpClient);
    private apiBase = environment.apiBaseUrl;

    commissions = signal<CommissionDto[]>([]);
    isLoading = signal(true);
    payingId = signal<number | null>(null);

    totalAll = computed(() => this.commissions().reduce((s, c) => s + c.commissionAmount, 0));
    totalPaid = computed(() => this.commissions().filter(c => c.isPaid).reduce((s, c) => s + c.commissionAmount, 0));
    totalPending = computed(() => this.commissions().filter(c => !c.isPaid).reduce((s, c) => s + c.commissionAmount, 0));

    ngOnInit() { this.load(); }

    load() {
        this.isLoading.set(true);
        this.http.get<CommissionDto[]>(`${this.apiBase}/admin/commissions`).subscribe({
            next: data => { this.commissions.set(data); this.isLoading.set(false); },
            error: () => this.isLoading.set(false)
        });
    }

    markPaid(id: number) {
        this.payingId.set(id);
        this.http.put(`${this.apiBase}/admin/commissions/${id}/mark-paid`, {}).subscribe({
            next: () => { this.payingId.set(null); this.load(); },
            error: (err) => { this.payingId.set(null); alert(err.error?.error || 'Failed.'); }
        });
    }
}

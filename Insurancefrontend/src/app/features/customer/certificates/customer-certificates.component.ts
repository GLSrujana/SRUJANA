import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';

interface ActivePolicyDto {
  id: number;
  policyNumber: string;
  policyName: string;
  customerId: number;
  agentId: number;
  status: string;
  totalPremium: number;
  coverageAmount: number;
  startDateUtc: string;
  endDateUtc: string;
  isPremiumPaid: boolean;
  paymentOption: string;
  totalInstallments: number;
}

@Component({
  selector: 'app-customer-certificates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Insurance Certificates</h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">View and download official event insurance certificates for your approved policies.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (isLoading()) {
          @for (i of [1,2,3]; track i) {
            <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 h-64 animate-pulse">
                <div class="w-16 h-16 bg-neutral-100 rounded-full mb-4"></div>
                <div class="h-4 w-1/2 bg-neutral-100 rounded mb-2"></div>
                <div class="h-8 w-3/4 bg-neutral-100 rounded mb-4"></div>
                <div class="h-10 w-full bg-neutral-100 rounded-xl mt-auto"></div>
            </div>
          }
        } @else if (policies().length === 0) {
          <div class="col-span-full">
            <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
                <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-2">No Certificates Available</h3>
                <p class="text-neutral-500 max-w-sm">Once an admin approves your policy application, your official event insurance certificate will appear here.</p>
            </div>
          </div>
        } @else {
          @for (p of policies(); track p.id) {
            <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <!-- Decorative elements -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>
              
              <div class="flex items-start justify-between mb-6 relative z-10">
                <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-neutral-200 dark:border-neutral-700">Official Document</span>
              </div>
              
              <div class="mb-4 relative z-10">
                <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">{{ p.policyNumber }}</h3>
                <h2 class="text-xl font-black text-neutral-900 dark:text-white leading-tight outfit-font line-clamp-1">{{ p.policyName }}</h2>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-8 mt-4">
                <div class="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <p class="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-0.5">Valid Until</p>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">{{ p.endDateUtc | date:'MMM d, y' }}</p>
                </div>
                <div class="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <p class="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-0.5">Coverage</p>
                  <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ p.coverageAmount | currency:'USD':'symbol':'1.0-0' }}</p>
                </div>
              </div>
              
              <div class="mt-auto grid grid-cols-2 gap-3 relative z-10">
                <button (click)="viewCertificate(p)" class="w-full py-2.5 px-4 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Preview
                </button>
                <button (click)="downloadCertificate(p)" class="w-full py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Download
                </button>
              </div>
            </div>
          }
        }
      </div>
      
      <!-- Certificate Modal -->
      @if (selectedCertificate()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in flex flex-col relative">
            
            <button (click)="closeCertificate()" class="absolute top-4 right-4 w-10 h-10 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full flex items-center justify-center hover:bg-neutral-200 hover:text-neutral-900 transition-colors z-20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <!-- Certificate Content (to be printed) -->
            <div id="print-certificate" class="p-12 md:p-16 relative bg-white min-h-[700px]">
                <div class="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <svg viewBox="0 0 100 100" class="w-[80%] h-[80%]"><path fill="currentColor" d="M50 0L0 50l50 50 50-50L50 0zm0 14.14L85.86 50 50 85.86 14.14 50 50 14.14z"/></svg>
                </div>
                
                <div class="border-[12px] border-double border-neutral-200 p-10 h-full relative z-10">
                    <div class="flex items-center justify-center gap-4 mb-4">
                        <div class="w-16 h-16 bg-emerald-600 text-white flex items-center justify-center rounded-2xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8"><path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" /></svg>
                        </div>
                        <div class="text-left">
                           <h1 class="text-4xl font-black tracking-tighter text-neutral-900 outfit-font">EVENTSURE</h1>
                           <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Your event protected</p>
                        </div>
                    </div>
                    
                    <div class="text-center mb-10 pb-10 border-b-2 border-dashed border-neutral-200">
                        <h2 class="text-3xl font-serif text-neutral-900 mt-6 tracking-wide">Certificate of Insurance</h2>
                        <p class="text-sm text-neutral-500 font-serif italic mt-2">This certifies that the following policy is active and valid.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-8 mb-10 border-b border-neutral-100 pb-10">
                        <div>
                            <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Policy Number</p>
                            <p class="text-xl font-black text-neutral-900">{{ selectedCertificate()?.policyNumber }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Coverage Amount</p>
                            <p class="text-xl font-black text-emerald-600">{{ selectedCertificate()?.coverageAmount | currency:'USD':'symbol':'1.2-2' }}</p>
                        </div>
                    </div>

                    <div class="space-y-6 mb-16">
                        <div class="bg-neutral-50 p-6 rounded-lg">
                            <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Policy / Event Name</p>
                            <p class="text-2xl font-serif text-neutral-900">{{ selectedCertificate()?.policyName }}</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-6">
                            <div class="bg-neutral-50 p-6 rounded-lg">
                                <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Effective Date (UTC)</p>
                                <p class="text-lg font-bold text-neutral-900">{{ selectedCertificate()?.startDateUtc | date:'MMMM d, y' }}</p>
                            </div>
                            <div class="bg-neutral-50 p-6 rounded-lg">
                                <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Expiration Date (UTC)</p>
                                <p class="text-lg font-bold text-neutral-900">{{ selectedCertificate()?.endDateUtc | date:'MMMM d, y' }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div class="bg-neutral-50 p-6 rounded-lg border-l-4 border-emerald-500">
                                <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Premium</p>
                                <p class="text-lg font-bold text-emerald-700">{{ selectedCertificate()?.totalPremium | currency:'USD':'symbol':'1.2-2' }}</p>
                            </div>
                            <div class="bg-neutral-50 p-6 rounded-lg border-l-4 border-blue-500">
                                <p class="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Payment Plan</p>
                                <p class="text-lg font-bold text-blue-700">
                                  {{ selectedCertificate()?.paymentOption === 'SixMonths' ? '6 Months' : selectedCertificate()?.paymentOption }} 
                                  <span class="text-sm text-neutral-500 font-normal">({{ selectedCertificate()?.totalInstallments }} Installments)</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between items-end mt-auto pt-8">
                        <div class="text-center">
                            <div class="font-signature text-3xl md:text-4xl text-neutral-800 -mb-2 pb-2 inline-block">Lakshmi Srujana G</div>
                            <div class="w-56 h-px bg-neutral-900 mb-2"></div>
                            <p class="text-xs font-bold text-neutral-500 uppercase tracking-widest">Authorized Signature</p>
                            <p class="text-[10px] text-neutral-400 mt-1 uppercase">Administrator</p>
                        </div>
                        <div class="text-right">
                            <div class="w-24 h-24 border-4 border-emerald-600 rounded-full flex items-center justify-center opacity-80 rotate-12 inline-flex">
                                <span class="text-emerald-600 font-black text-xs uppercase text-center leading-none tracking-tighter">OFFICIAL<br/>APPROVED<br/>SEAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer Actions -->
            <div class="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3 sticky bottom-0 rounded-b-3xl">
                <button (click)="closeCertificate()" class="px-6 py-2.5 rounded-xl font-bold text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
                <button onclick="window.print()" class="px-6 py-2.5 rounded-xl font-bold text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.724.092m6.524-4.31a5.25 5.25 0 00-13.039 7.144m13.039-7.144a5.25 5.25 0 00-13.04 7.143m13.04-7.143a5.25 5.25 0 11-13.04 7.143m13.039-7.143V5.625c0-.621-.504-1.125-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    Print to PDF
                </button>
            </div>
            
            <style>
              @media print {
                body * { visibility: hidden; }
                #print-certificate, #print-certificate * { visibility: visible; }
                #print-certificate { position: absolute; left: 0; top: 0; width: 100%; }
                /* Force light mode colors for printing */
                #print-certificate { background: white !important; color: black !important; }
                #print-certificate .text-neutral-900 { color: #171717 !important; }
                #print-certificate .border-neutral-200 { border-color: #e5e5e5 !important; }
              }
            </style>
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerCertificatesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  policies = signal<ActivePolicyDto[]>([]);
  isLoading = signal(true);
  selectedCertificate = signal<ActivePolicyDto | null>(null);

  ngOnInit() {
    this.http.get<ActivePolicyDto[]>(`${this.apiBase}/active-policies/customer-active-policies`).subscribe({
      next: data => { this.policies.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  viewCertificate(policy: ActivePolicyDto) {
    this.selectedCertificate.set(policy);
  }

  downloadCertificate(policy: ActivePolicyDto) {
    this.selectedCertificate.set(policy);
    // Give Angular a tick to render the modal to the DOM before printing
    setTimeout(() => {
      window.print();
    }, 150);
  }

  closeCertificate() {
    this.selectedCertificate.set(null);
  }
}

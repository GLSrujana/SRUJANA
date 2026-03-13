import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-free-quote',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white relative flex flex-col items-center pb-20 overflow-x-hidden transition-colors duration-500">
      
      <!-- Ambient Glob -->
      <div class="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen dark:mix-blend-color-dodge">
        <div class="h-[40rem] w-[40rem] bg-yellow-500/20 rounded-full blur-[140px] absolute -top-20 -left-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div class="h-[50rem] w-[50rem] bg-blue-600/20 rounded-full blur-[180px] absolute top-1/2 right-0 transform -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
      </div>

       <!-- Navbar (Minimal) -->
       <div class="w-full max-w-7xl mx-auto px-4 pt-6 z-50 relative animate-fade-in-down mb-10">
          <nav class="flex items-center justify-between">
              <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-600 to-blue-500 text-white shadow-lg shadow-yellow-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                  </div>
                  <span class="text-2xl font-black tracking-tight outfit-font text-slate-900 dark:text-white">Event<span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-500">Sure</span></span>
              </a>
              <a routerLink="/" class="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                 Back to Home
              </a>
          </nav>
       </div>

      <div class="w-full max-w-5xl mx-auto px-6 relative z-10">
          
          <div class="text-center mb-10 w-full animate-fade-in-up">
              <span class="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-blue-200 dark:border-blue-500/30">Free Premium Estimator</span>
              <h1 class="text-4xl md:text-5xl font-black outfit-font text-slate-900 dark:text-white mb-4 tracking-tight">Get Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-500">Free Quote</span></h1>
              <p class="text-lg text-slate-600 dark:text-neutral-400 font-medium max-w-xl mx-auto">No commitment. Just smart cost projections tailored specifically for your event conditions.</p>
          </div>

          <div class="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white dark:border-white/10 overflow-hidden flex flex-col md:flex-row animate-pop-in">
            
            <!-- Form Side -->
            <div class="flex-1 w-full p-8 md:p-14" *ngIf="!quoteResult">
                <form [formGroup]="quoteForm" (ngSubmit)="calculateQuote()" class="space-y-6">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Event Type -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 dark:text-neutral-300">Event Type</label>
                            <select formControlName="eventType" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none font-medium">
                                <option value="Wedding">Wedding</option>
                                <option value="Concert">Concert</option>
                                <option value="Corporate">Corporate Event</option>
                                <option value="Festival">Festival</option>
                                <option value="Other">Other</option>
                            </select>
                            
                            <!-- Custom Event Type Input (Shows conditionally) -->
                            <div class="mt-3 animate-fade-in-down" *ngIf="quoteForm.get('eventType')?.value === 'Other'">
                                <input type="text" formControlName="otherEventType" placeholder="Please specify event type" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium text-sm">
                            </div>  
                        </div>
                        
                        <!-- Event Budget -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 dark:text-neutral-300">Total Event Budget (₹)</label>
                            <input type="number" formControlName="budget" placeholder="e.g. 500000" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <!-- Cover Date -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 dark:text-neutral-300">Event Date</label>
                            <input type="date" formControlName="date" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium" [min]="todayDate">
                        </div>
                        
                         <!-- Location -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 dark:text-neutral-300">Location Area/City</label>
                            <input type="text" formControlName="location" placeholder="e.g. Hyderabad" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium">
                        </div>
                    </div>

                    <!-- Attendees -->
                    <div class="space-y-2 pb-6 border-b border-slate-200 dark:border-white/10">
                        <label class="text-sm font-bold text-slate-700 dark:text-neutral-300">Expected Number of Attendees</label>
                        <input type="number" formControlName="attendees" placeholder="e.g. 500" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium">
                    </div>

                    <!-- Risk Factors -->
                    <div class="space-y-4">
                        <label class="text-sm font-bold text-slate-700 dark:text-neutral-300 mb-2 block tracking-tight">Special Risks (Select all that apply)</label>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors">
                                <input type="checkbox" formControlName="fireworks" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-neutral-800 dark:border-white/10">
                                <span class="text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Fireworks / Pyro</span>
                            </label>
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors">
                                <input type="checkbox" formControlName="alcohol" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-neutral-800 dark:border-white/10">
                                <span class="text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Alcohol Served</span>
                            </label>
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors">
                                <input type="checkbox" formControlName="outdoor" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-neutral-800 dark:border-white/10">
                                <span class="text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Outdoor Venue</span>
                            </label>
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors">
                                <input type="checkbox" formControlName="vip" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-neutral-800 dark:border-white/10">
                                <span class="text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">VIP Presence</span>
                            </label>
                            
                            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors col-span-2 md:col-span-1">
                                <input type="checkbox" formControlName="otherRisk" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-neutral-800 dark:border-white/10">
                                <span class="text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Other Specific Risks</span>
                            </label>
                        </div>
                        
                        <!-- Text Area for Other Risk (Shows conditionally) -->
                        <div class="mt-4" *ngIf="quoteForm.get('otherRisk')?.value">
                            <label class="text-sm font-bold text-slate-700 dark:text-neutral-300 mb-2 block">Please outline the other risks:</label>
                            <textarea formControlName="otherRiskDetail" rows="2" placeholder="e.g., Drone filming, exotic animals, high-altitude venue..." class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"></textarea>
                        </div>
                    </div>

                    <button type="submit" [disabled]="quoteForm.invalid || isCalculating" class="w-full mt-8 py-5 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 rounded-xl font-black outfit-font text-lg hover:-translate-y-1 active:translate-y-0 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3">
                        <span *ngIf="!isCalculating">Calculate Estimate</span>
                        <span *ngIf="isCalculating" class="flex items-center gap-2">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Calculating...
                        </span>
                    </button>
                    <!-- Small error message text if invalid but touched -->
                    <p *ngIf="quoteForm.invalid && quoteForm.touched" class="text-rose-500 dark:text-rose-400 text-center text-sm font-bold mt-2">Please fill in all details.</p>
                </form>
            </div>

            <!-- Side Banner Panel (if no result) -->
            <div class="hidden md:block w-[40%] relative overflow-hidden bg-[#f4f4f5] dark:bg-neutral-800 border-l border-slate-200 dark:border-white/10" *ngIf="!quoteResult">
                <!-- Giant Cement-White Logo Background Watermark -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="absolute -bottom-16 -right-16 w-96 h-96 text-slate-300/60 dark:text-black/20 -rotate-12 z-0 pointer-events-none">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                
                <div class="absolute inset-0 flex flex-col justify-end p-12 relative z-10">
                    <div class="w-16 h-16 bg-gradient-to-tr from-yellow-600 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-yellow-500/30 border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h3 class="text-4xl font-black outfit-font mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">Quick<br>Estimates</h3>
                    <p class="text-[0.95rem] text-slate-600 dark:text-neutral-400 font-medium leading-relaxed">Our smart estimator processes your event details in milliseconds to provide an accurate cost projection for your coverage needs.</p>
                </div>
            </div>

            <!-- RESULT SIDE -->
            <div class="flex-1 w-full bg-neutral-950 text-white overflow-hidden relative" *ngIf="quoteResult">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>

                <div class="flex flex-col h-full items-center text-center p-8 md:p-14 animate-fade-in-up relative z-10">
                    
                    <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.8)] border-4 border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h2 class="text-4xl font-black outfit-font text-white mb-4">Your Estimate is Ready</h2>
                    <p class="text-neutral-300 font-medium mb-12 max-w-md mx-auto">Based on your event details, here is our smart premium projection.</p>
                    
                    <div class="w-full max-w-md bg-white/5 rounded-[2rem] p-10 mb-10 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <!-- Line Item -->
                        <div class="flex justify-between items-center pb-5 border-b border-white/10 mb-5 text-left">
                            <span class="text-neutral-400 font-bold uppercase tracking-wider text-xs">Event Category</span>
                            <span class="text-white font-black outfit-font text-lg">{{ quoteResult.eventType }}</span>
                        </div>
                        <div class="flex justify-between items-center pb-5 border-b border-white/10 mb-3 text-left">
                            <span class="text-neutral-400 font-bold uppercase tracking-wider text-xs">Coverage Limit</span>
                            <span class="text-white font-black outfit-font text-lg">{{ quoteResult.coverage | currency:'INR':'symbol':'1.0-0' }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-6 mt-6">
                            <div class="text-center">
                                <span class="text-[11px] text-emerald-500 font-black uppercase tracking-[0.4em] mb-4 block">Estimated Yearly Premium</span>
                                <span class="text-7xl text-white font-black outfit-font tracking-tighter leading-none">{{ quoteResult.premiumYearly | currency:'INR':'symbol':'1.0-0' }}</span>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-3 w-full">
                                <div class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                                   <p class="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Monthly</p>
                                   <p class="text-base font-black text-white">{{ quoteResult.premiumMonthly | currency:'INR':'symbol':'1.0-0' }}/mo</p>
                                </div>
                                <div class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                                   <p class="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">6 Months</p>
                                   <p class="text-base font-black text-white">{{ quoteResult.premium6Months | currency:'INR':'symbol':'1.0-0' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20 mb-10 text-left w-full max-w-lg shadow-sm">
                       <h4 class="text-base font-black text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2 outfit-font"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>Why is this "Free"?</h4>
                       <p class="text-blue-700/80 dark:text-blue-200/80 text-[0.95rem] font-medium leading-relaxed mb-4">Because you are not paying anything yet. This is simply a smart check to see how much comprehensive insurance would cost. It helps you decide whether you want the insurance and which policy is right for you!</p>
                       <div class="p-4 bg-orange-100/50 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-500/30">
                            <p class="text-orange-800 dark:text-orange-300 text-sm font-semibold flex items-start gap-2">
                                <span class="text-lg">⚠️</span>
                                <span><strong>Note on Risk Factors:</strong> This is a baseline AI estimation. Your final premium may vary, as additional deep risk-based factors (such as venue history, vendor safety records, and precise logistics) will be evaluated when you formally apply.</span>
                            </p>
                       </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                        <a routerLink="/register" class="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-500 hover:to-blue-500 text-white rounded-xl font-bold outfit-font text-center shadow-lg hover:-translate-y-1 transition-transform">Proceed to Register</a>
                        <button (click)="resetForm()" class="px-8 py-4 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 rounded-xl font-bold outfit-font transition-colors whitespace-nowrap">Recalculate</button>
                    </div>
                </div>
            </div>

          </div>
      </div>
    </div>
  `
})
export class FreeQuoteComponent implements OnInit {
    quoteForm!: FormGroup;
    isCalculating = false;
    quoteResult: any = null;
    todayDate: string = new Date().toISOString().split('T')[0];
    selectedDuration = 'Yearly';
    durations = ['Monthly', '6 Months', 'Yearly'];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.quoteForm = this.fb.group({
            eventType: ['Wedding', Validators.required],
            otherEventType: [''],
            budget: ['', [Validators.required, Validators.min(1000)]],
            date: ['', Validators.required],
            location: ['', Validators.required],
            attendees: ['', [Validators.required, Validators.min(1)]],
            fireworks: [false],
            alcohol: [false],
            outdoor: [false],
            vip: [false],
            otherRisk: [false],
            otherRiskDetail: [''],
        });
    }

    // AI-Simulated Quote Heuristics Algorithm
    calculateQuote() {
        if (this.quoteForm.invalid) {
            this.quoteForm.markAllAsTouched();
            return;
        }

        const val = this.quoteForm.value;
        const budget = Number(val.budget) || 100000;
        let type = val.eventType;
        const attendees = Number(val.attendees) || 0;

        // Base Decision Rules applied by Heuristics AI Layer
        let coverageMultiplier = 1.0;
        let baseRate = 0.02; // Default 2%

        if (type === 'Wedding') { baseRate = 0.02; coverageMultiplier = 1.0; } // As per example: 5L -> 10k
        else if (type === 'Concert') { baseRate = 0.035; coverageMultiplier = 1.0; } // As per example: 10L -> 35k
        else if (type === 'Corporate') { baseRate = 0.015; coverageMultiplier = 1.0; }
        else if (type === 'Festival') { baseRate = 0.04; coverageMultiplier = 1.2; }
        else {
            baseRate = 0.028;
            coverageMultiplier = 1.0;
            if (val.otherEventType && val.otherEventType.trim() !== '') {
                type = val.otherEventType.trim(); // Update type for result display
            }
        }

        let targetCoverage = budget * coverageMultiplier;

        // Base premium processing
        let calculatedPremium = targetCoverage * baseRate;

        // Additional AI Network Risk Parameters Context

        // Add Attendee Risk Vector
        calculatedPremium += (attendees * 15); // ₹15/head risk pool

        // AI Risk Weight Modifiers Array Multiplication
        let riskMultiplier = 1.0;
        if (val.fireworks) riskMultiplier += 0.15;
        if (val.alcohol) riskMultiplier += 0.08;
        if (val.outdoor) riskMultiplier += 0.05;
        if (val.vip) riskMultiplier += 0.10;

        // Dynamic analysis of "Other" risk
        if (val.otherRisk && val.otherRiskDetail && val.otherRiskDetail.trim().length > 0) {
            riskMultiplier += 0.12; // Flat 12% heuristic penalty for unstructured "Other" risk
            // Calculate word count to add slight heuristic complexity penalty
            const wordCount = val.otherRiskDetail.trim().split(/\s+/).length;
            riskMultiplier += (wordCount * 0.01); // 1% extra per word of risk description
        }

        calculatedPremium = calculatedPremium * riskMultiplier;

        const totalYearly = calculatedPremium;

        // Produce final Quote Artifact
        this.quoteResult = {
            eventType: type,
            coverage: targetCoverage,
            premiumYearly: Math.round(totalYearly),
            premium6Months: Math.round((totalYearly / 2) * 1.05),
            premiumMonthly: Math.round((totalYearly / 12) * 1.10)
        };
    }

    getPremiumForDuration() {
        if (!this.quoteResult) return 0;
        if (this.selectedDuration === 'Monthly') return this.quoteResult.premiumMonthly;
        if (this.selectedDuration === '6 Months') return this.quoteResult.premium6Months;
        return this.quoteResult.premiumYearly;
    }

    resetForm() {
        this.quoteResult = null;
        this.selectedDuration = 'Yearly';
        this.quoteForm.reset({ eventType: 'Wedding' });
    }
}

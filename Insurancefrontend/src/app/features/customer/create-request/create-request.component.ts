import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InsuranceRequestService } from '../../../core/services/insurance-request.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CreateInsuranceRequestDto } from '../../../core/models/insurance-request.models';
import { FormErrorsComponent } from '../../../shared/ui/form-errors/form-errors.component';
import { SuccessOverlayService } from '../../../shared/ui/success-overlay/success-overlay.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const eventDate = new Date(control.value);
    const now = new Date();

    if (eventDate <= now) {
        return { futureDate: true };
    }
    return null;
}

interface PolicyProductDto {
    id: number;
    productName: string;
    eventTypeSupported: string;
    isActive: boolean;
}

@Component({
    selector: 'app-create-request',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormErrorsComponent],
    template: `
    <div class="max-w-4xl w-full mx-auto px-4 py-12 animate-fade-in-up">
      <div class="mb-10 animate-fade-in-right">
        <h1 class="text-4xl font-black text-neutral-950 dark:text-white tracking-tight outfit-font">Create <span class="blue-gradient-text">Insurance Request</span></h1>
        <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl font-medium leading-relaxed">Protect your event with tailored coverage. Provide the details below to receive a professional insurance proposal.</p>
      </div>

      <div class="premium-card relative overflow-hidden animate-scale-in stagger-1">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-yellow-500 to-blue-500 shadow-lg shadow-blue-500/20"></div>
        
        <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="p-8 sm:p-12 divide-y divide-neutral-100 dark:divide-neutral-800">
          
          <div class="flex justify-end mb-4 h-4">
              <span *ngIf="isAutoSaving" class="text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Auto-saving Draft...</span>
          </div>

          <!-- Event Details Section -->
          <div class="pb-12">
             <div class="mb-10 flex items-center gap-5">
               <div class="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-blue-600/20 rotate-3 transition-transform">01</div>
               <div>
                  <h2 class="text-2xl font-black text-neutral-950 dark:text-white outfit-font">Event Information</h2>
                  <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Core details of your upcoming event</p>
               </div>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Event Type -->
                <div class="md:col-span-2 relative group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">Event Type</label>
                    <div class="relative">
                        <select formControlName="eventType" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all text-neutral-950 dark:text-white font-black outfit-font appearance-none">
                            <option value="" disabled selected>Select Category</option>
                            <option value="Concert">Concert</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Corporate Gala">Corporate Gala</option>
                            <option value="Birthday Party">Birthday Party</option>
                            <option value="Festival">Festival</option>
                            <option value="Conference">Conference</option>
                            <option value="Sports Event">Sports Event</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="Charity Event">Charity Event</option>
                            <option value="Trade Show">Trade Show</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-neutral-400">
                           <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                    </div>
                    <app-form-errors [control]="requestForm.controls.eventType" fieldName="Event Type"></app-form-errors>

                    @if (noProductWarning) {
                      <div class="mt-4 flex items-start gap-4 px-5 py-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl animate-fade-in-up">
                        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-amber-600 dark:text-amber-400"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                        </div>
                        <div>
                          <p class="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest">Product Note</p>
                          <p class="text-xs text-amber-700 dark:text-amber-500 mt-1 font-medium leading-relaxed">No active insurance logic matches <strong>"{{ requestForm.controls.eventType.value }}"</strong>. You may proceed; human oversight will calibrate coverage manually.</p>
                        </div>
                      </div>
                    }
                </div>
                
                <!-- Date -->
                <div class="group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">Date and Time</label>
                    <input type="datetime-local" formControlName="eventDate" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm font-black outfit-font text-neutral-950 dark:text-white transition-all uppercase tracking-tighter">
                    <app-form-errors [control]="requestForm.controls.eventDate" fieldName="Event Date"></app-form-errors>
                    @if (requestForm.controls.eventDate.errors?.['futureDate'] && requestForm.controls.eventDate.touched) {
                        <p class="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span class="w-1 h-1 rounded-full bg-red-500"></span> Error: Date must be in the future
                        </p>
                    }
                </div>

                <!-- Duration -->
                <div class="group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">Event Duration (Hours)</label>
                    <input type="number" formControlName="durationInHours" min="1" max="24" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all font-black outfit-font text-neutral-950 dark:text-white">
                    <app-form-errors [control]="requestForm.controls.durationInHours" fieldName="Duration"></app-form-errors>
                </div>

                <!-- Location -->
                <div class="md:col-span-2 relative group">
                    <div class="flex items-center justify-between mb-3 ml-1">
                        <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Venue / Location</label>
                        <button type="button" (click)="detectLocation()" [disabled]="detectingLocation"
                                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                [ngClass]="detectingLocation ? 'bg-neutral-100 text-neutral-400 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'">
                            @if (detectingLocation) {
                                <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                PULSING...
                            } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.831 13.831 0 002.673 1.97l.02.011a5.692 5.692 0 00.182.086zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>
                                Auto Locate
                            }
                        </button>
                    </div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-neutral-300 dark:text-neutral-700">
                                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="text" formControlName="location"
                               (input)="onLocationSearch($event)"
                               (focus)="showLocationResults = locationResults.length > 0"
                               autocomplete="off"
                               class="w-full pl-12 pr-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 placeholder-neutral-400 shadow-sm transition-all text-neutral-950 dark:text-white font-black outfit-font"
                               placeholder="Search for address or venue...">
                    </div>

                    <!-- Search Results Dropdown -->
                    @if (showLocationResults && locationResults.length > 0) {
                        <div class="absolute z-50 left-0 right-0 mt-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-pop-in">
                            @for (result of locationResults; track result.place_id) {
                                <button type="button" (click)="selectLocation(result)" class="w-full text-left px-5 py-4 hover:bg-blue-50 dark:hover:bg-neutral-900 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0 flex items-start gap-4">
                                    <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-600 dark:text-blue-400">
                                            <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.831 13.831 0 002.673 1.97l.02.011a5.692 5.692 0 00.182.086zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[11px] font-black text-neutral-950 dark:text-white uppercase tracking-tight truncate">{{ result.display_name.split(',')[0] }}</p>
                                        <p class="text-[9px] text-neutral-500 truncate mt-0.5 font-bold">{{ result.display_name }}</p>
                                    </div>
                                </button>
                            }
                        </div>
                    }

                    @if (searchingLocation) {
                        <p class="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">
                            <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Searching...
                        </p>
                    }

                    <app-form-errors [control]="requestForm.controls.location" fieldName="Location"></app-form-errors>
                </div>

                <!-- Attendees -->
                <div class="group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">Expected Attendees</label>
                    <input type="number" formControlName="expectedAttendees" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all font-black outfit-font text-neutral-950 dark:text-white">
                    <app-form-errors [control]="requestForm.controls.expectedAttendees" fieldName="Attendees"></app-form-errors>
                </div>

                <!-- Event Budget -->
                <div class="group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">Total Event Budget ($)</label>
                    <input type="number" formControlName="eventBudget" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all font-black outfit-font text-neutral-950 dark:text-white" placeholder="VAL_NUM">
                    <app-form-errors [control]="requestForm.controls.eventBudget" fieldName="Budget"></app-form-errors>
                </div>

                <!-- Special Risk Factors -->
                <div class="md:col-span-2 space-y-6 pt-8 border-t border-neutral-50 dark:border-neutral-800/50">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 ml-1">Special Risk Factors</label>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label class="flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800/50 bg-neutral-50/20 cursor-pointer hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                            <input type="checkbox" formControlName="hasAlcoholService" class="w-6 h-6 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 transition-all">
                            <div>
                                <p class="text-xs font-black text-neutral-950 dark:text-white outfit-font group-hover:text-blue-600 transition-colors uppercase tracking-widest">Alcohol Service</p>
                                <p class="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Event involves alcohol</p>
                            </div>
                        </label>
                        
                        <label class="flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800/50 bg-neutral-50/20 cursor-pointer hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                            <input type="checkbox" formControlName="isOutdoorVenue" class="w-6 h-6 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 transition-all">
                            <div>
                                <p class="text-xs font-black text-neutral-950 dark:text-white outfit-font group-hover:text-blue-600 transition-colors uppercase tracking-widest">Outdoor Venue</p>
                                <p class="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Subject to weather risks</p>
                            </div>
                        </label>
                        
                        <label class="flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800/50 bg-neutral-50/20 cursor-pointer hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                            <input type="checkbox" formControlName="hasPyrotechnics" class="w-6 h-6 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 transition-all">
                            <div>
                                <p class="text-xs font-black text-neutral-950 dark:text-white outfit-font group-hover:text-blue-600 transition-colors uppercase tracking-widest">Pyrotechnics</p>
                                <p class="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Fireworks or fire effects</p>
                            </div>
                        </label>
                        
                        <label class="flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800/50 bg-neutral-50/20 cursor-pointer hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                            <input type="checkbox" formControlName="hasOtherRisks" class="w-6 h-6 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 transition-all">
                            <div>
                                <p class="text-xs font-black text-neutral-950 dark:text-white outfit-font group-hover:text-blue-600 transition-colors uppercase tracking-widest">Other Risks</p>
                                <p class="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Additional custom hazards</p>
                            </div>
                        </label>
                    </div>

                    @if (requestForm.controls.hasOtherRisks.value) {
                        <div class="mt-6 animate-fade-in-up">
                            <label class="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 ml-1">Please specify other risks</label>
                            <input type="text" formControlName="otherRiskDetails" placeholder="Describe risk factors..." class="w-full px-5 py-4 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl bg-blue-50/20 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500 shadow-sm transition-all font-black outfit-font text-neutral-950 dark:text-white uppercase tracking-widest placeholder-blue-200">
                        </div>
                    }
                </div>

                <!-- Preferred Notes -->
                <div class="md:col-span-2 pt-6">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1 flex items-center justify-between">
                        Preferred Coverage Notes
                        <span class="text-[8px] text-neutral-400 dark:text-neutral-600 font-black bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-lg">Optional</span>
                    </label>
                    <textarea formControlName="preferredCoverageNotes" rows="4" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all font-black outfit-font text-neutral-950 dark:text-white resize-none placeholder-neutral-300" placeholder="Add any specific coverage requirements or notes..."></textarea>
                </div>

                <!-- Document Verification Section -->
                <div class="md:col-span-2 space-y-6 pt-8 border-t border-neutral-50 dark:border-neutral-800/50 animate-fade-in-up">
                    <div class="flex items-center gap-4 mb-2">
                        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-600 dark:text-emerald-400">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.242l7-7a3 3 0 000-4.242zm-1.414 1.414a1 1 0 010 1.414l-7 7a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0z" clip-rule="evenodd" />
                                <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-black text-neutral-950 dark:text-white outfit-font">Verification Documents</h3>
                            <p class="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Proof of identity or event arrangement</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="relative group">
                            <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 ml-1">Document Type</label>
                            <select formControlName="documentType" class="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/30 focus:bg-white dark:bg-neutral-950 focus:outline-none focus:border-blue-500/50 shadow-sm transition-all text-neutral-950 dark:text-white font-black outfit-font appearance-none">
                                <option value="" disabled selected>Select proof type</option>
                                <option value="IdentityProof">Government ID (Passport/Aadhar)</option>
                                <option value="VenueAgreement">Venue Rental Agreement</option>
                                <option value="EventArrangementProof">Event Management Contract</option>
                                <option value="FinancialProof">Financial Sponsorship Letter</option>
                                <option value="Other">Other Supporting Document</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 pt-6 text-neutral-400">
                                <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>

                        <div class="group relative">
                            <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3 ml-1">Upload File (PDF/Image)</label>
                            <div class="relative">
                                <input type="file" (change)="onFileSelected($event)" accept=".pdf,image/*" #fileInput class="hidden">
                                <button type="button" (click)="fileInput.click()" class="w-full px-5 py-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all flex items-center justify-between group shadow-sm">
                                    <div class="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span class="text-xs font-black outfit-font text-neutral-900 dark:text-white truncate max-w-[150px]">
                                            {{ selectedFileName || 'Choose File...' }}
                                        </span>
                                    </div>
                                    @if (requestForm.controls.documentData.value) {
                                        <span class="text-[8px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg animate-fade-in">LOADED</span>
                                    }
                                </button>
                            </div>
                            <app-form-errors [control]="requestForm.controls.documentData" fieldName="File"></app-form-errors>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          <!-- Coverage Setup -->
          <div class="py-12 bg-neutral-50/20 dark:bg-neutral-900/10 -mx-8 sm:-mx-12 px-8 sm:px-12 rounded-2xl border-y border-neutral-100 dark:border-neutral-800">
             <div class="mb-10 flex items-center gap-5">
               <div class="h-12 w-12 rounded-2xl bg-yellow-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-yellow-600/20 -rotate-3 transition-transform">02</div>
               <div>
                  <h2 class="text-2xl font-black text-neutral-950 dark:text-white outfit-font">Coverage Requirements</h2>
                  <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Desired limit and financial protection</p>
               </div>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="md:col-span-2 relative group">
                    <label class="block text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                        Coverage Limit ($)
                        <span class="px-2 py-0.5 rounded-lg bg-red-100 text-red-600 font-black text-[8px] uppercase tracking-widest border border-red-200">Required</span>
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <span class="text-blue-600 font-black text-2xl outfit-font">$</span>
                        </div>
                        <input type="number" formControlName="requestedCoverageAmount" class="w-full pl-12 pr-6 py-6 border-2 rounded-3xl bg-white dark:bg-neutral-950 focus:outline-none focus:ring-0 focus:border-blue-600 shadow-xl transition-all text-neutral-950 dark:text-white font-black text-4xl outfit-font leading-none tracking-tight animate-pulse-glow" placeholder="0.00"
                               [ngClass]="coverageExceedsBudget ? 'border-red-500 shadow-red-500/10' : 'border-neutral-100 dark:border-neutral-800 shadow-blue-500/5'">
                    </div>
                    <app-form-errors [control]="requestForm.controls.requestedCoverageAmount" fieldName="Coverage"></app-form-errors>

                    <!-- Error: Coverage exceeds budget -->
                    @if (coverageExceedsBudget) {
                      <div class="mt-6 flex items-start gap-5 px-6 py-5 bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-600 rounded-2xl animate-shake">
                        <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-red-600"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                        </div>
                        <div>
                          <p class="text-[10px] font-black text-red-800 dark:text-red-400 uppercase tracking-widest">Validation Error</p>
                          <p class="text-xs text-red-700 dark:text-red-500 mt-1 font-bold leading-relaxed">Coverage amount (<strong>{{ requestForm.controls.requestedCoverageAmount.value | currency }}</strong>) cannot exceed event budget (<strong>{{ requestForm.controls.eventBudget.value | currency }}</strong>).</p>
                        </div>
                      </div>
                    }
                  </div>
                  
                  <!-- Estimated Premium Display -->
                  @if (estimatedPremium > 0) {
                      <div class="md:col-span-2 premium-card p-10 !bg-neutral-950 text-white shadow-2xl relative overflow-hidden animate-pop-in mt-4 border-none">
                          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-bl-[140px] blur-3xl -mr-16 -mt-16"></div>
                          
                          <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                              <div>
                                  <p class="text-[11px] text-blue-300 font-black uppercase tracking-[0.4em] mb-4">Estimated Yearly Premium</p>
                                  <h3 class="text-7xl font-black outfit-font tracking-tighter leading-none text-white">{{ (selectedDuration === 'Yearly' ? estimatedPremium : (estimatedPremium * (selectedDuration === 'Monthly' ? 12 : 2) / 1.10)) | currency }}</h3>
                                  
                                  <div class="mt-6 flex flex-wrap gap-4">
                                      <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20">
                                          <p class="text-[8px] font-black uppercase tracking-widest text-blue-300">Or Monthly</p>
                                          <p class="text-sm font-black text-white">{{ (estimatedPremium / (selectedDuration === 'Yearly' ? 12 : 1)) | currency }}/mo</p>
                                      </div>
                                      <div class="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                          <p class="text-[8px] font-black uppercase tracking-widest text-neutral-400">Or 6-Months</p>
                                          <p class="text-sm font-black text-white">{{ (estimatedPremium / (selectedDuration === 'Yearly' ? 2 : 1)) | currency }}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="text-center sm:text-right hidden sm:block">
                                  <p class="text-xs font-black text-white uppercase tracking-widest mb-2 px-3 py-1 bg-blue-600 rounded-lg inline-block">Official Proposal Pending</p>
                                  <p class="text-[10px] text-neutral-300 font-medium max-w-[200px] leading-relaxed mt-2">Our agents will review your specific risks and provide a finalized quote via notification.</p>
                              </div>
                          </div>
                      </div>
                  }
             </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-12 flex flex-col sm:flex-row items-center justify-end gap-6 bg-neutral-950/5 dark:bg-white/5 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 sm:p-12">
             <button type="button" class="order-2 sm:order-1 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600 hover:text-red-500 transition-colors" (click)="goBack()">Cancel Request</button>

             <button type="submit" [disabled]="isLoading || coverageExceedsBudget" class="order-1 sm:order-2 group relative w-full sm:w-auto px-12 py-5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-[2rem] font-black outfit-font text-lg tracking-widest overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0">
               <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-yellow-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <span class="relative z-10 flex items-center justify-center gap-3">
                  @if (isLoading) {
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      INITIALIZING...
                  } @else {
                       Submit Request
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 group-hover:translate-x-1 transition-transform"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" /></svg>
                  }
               </span>
             </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateRequestComponent implements OnInit {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private requestService = inject(InsuranceRequestService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);
    private overlayService = inject(SuccessOverlayService);
    private apiBase = environment.apiBaseUrl;

    isLoading = false;
    noProductWarning = false;
    policyProducts: PolicyProductDto[] = [];

    // Auto-save & Draft state
    private destroy$ = new Subject<void>();
    private currentDraftId: number | null = null;
    isAutoSaving = false;

    // Location picker state
    locationResults: any[] = [];
    showLocationResults = false;
    searchingLocation = false;
    detectingLocation = false;
    locationError = '';
    private searchTimeout: any;
    selectedFileName = '';

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFileName = file.name;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.requestForm.patchValue({
                    documentData: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    }

    requestForm = this.fb.nonNullable.group({
        eventType: ['', [Validators.required]],
        eventDate: ['', [Validators.required, futureDateValidator]],
        durationInHours: [1, [Validators.required, Validators.min(1), Validators.max(24)]],
        location: ['', [Validators.required]],
        expectedAttendees: [100, [Validators.required, Validators.min(1)]],
        eventBudget: [0, [Validators.required, Validators.min(1)]],

        requestedCoverageAmount: [0, [Validators.required, Validators.min(1000)]],
        preferredCoverageNotes: [''],

        // Risk Factors
        hasAlcoholService: [false],
        isOutdoorVenue: [false],
        hasPyrotechnics: [false],
        hasOtherRisks: [false],
        otherRiskDetails: [''],

        // Document Upload
        documentType: ['', [Validators.required]],
        documentData: ['', [Validators.required]]
    });

    selectedDuration = 'Yearly';
    durations = ['Monthly', '6 Months', 'Yearly'];

    // Premium Calculation Signal/Property
    get estimatedPremium(): number {
        const coverage = this.requestForm.controls.requestedCoverageAmount.value || 0;
        const attendees = this.requestForm.controls.expectedAttendees.value || 0;
        const eventType = this.requestForm.controls.eventType.value;

        if (coverage <= 0) return 0;

        // Base Decision Rules
        let baseRate = 0.02;
        if (eventType === 'Concert') baseRate = 0.035;
        else if (eventType === 'Festival') baseRate = 0.04;
        else if (eventType === 'Corporate Gala') baseRate = 0.015;

        // Base Annual Calculation
        let yearlyPremium = coverage * baseRate;
        yearlyPremium += (attendees * 15);

        let riskMultiplier = 1.0;
        if (this.requestForm.controls.hasAlcoholService.value) riskMultiplier += 0.08;
        if (this.requestForm.controls.isOutdoorVenue.value) riskMultiplier += 0.05;
        if (this.requestForm.controls.hasPyrotechnics.value) riskMultiplier += 0.15;

        if (this.requestForm.controls.hasOtherRisks.value) {
            riskMultiplier += 0.12;
            const otherText = this.requestForm.controls.otherRiskDetails.value || '';
            const wordCount = otherText.trim().split(/\s+/).filter(w => w.length > 0).length;
            riskMultiplier += (wordCount * 0.01);
        }

        const totalYearly = yearlyPremium * riskMultiplier;

        if (this.selectedDuration === 'Monthly') {
            return Math.round((totalYearly / 12) * 1.10);
        } else if (this.selectedDuration === '6 Months') {
            return Math.round((totalYearly / 2) * 1.05);
        }
        return Math.round(totalYearly);
    }

    get coverageExceedsBudget(): boolean {
        const coverage = this.requestForm.controls.requestedCoverageAmount.value;
        const budget = this.requestForm.controls.eventBudget.value;
        return budget > 0 && coverage > 0 && coverage > budget;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        // Close location dropdown when clicking outside
        this.showLocationResults = false;
    }

    ngOnInit() {
        this.fetchActiveProducts();

        // Listen for changes to handle no-product warning
        this.requestForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.checkEventTypeProduct();
        });

        // Auto-save Draft feature
        this.requestForm.valueChanges.pipe(
            debounceTime(3000), // Save after 3 seconds of silence
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.saveDraft();
        });

        // Check for Draft Resumption
        const draftId = this.route.snapshot.queryParamMap.get('draftId');
        if (draftId) {
            this.currentDraftId = Number(draftId);
            this.loadDraft(this.currentDraftId);
        }
    }

    private loadDraft(id: number) {
        this.isLoading = true;
        this.requestService.getById(id).subscribe({
            next: (data) => {
                this.isLoading = false;

                // Patch form with draft data
                this.requestForm.patchValue({
                    eventType: data.eventType || '',
                    eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 16) : '',
                    durationInHours: data.durationInHours,
                    location: data.location,
                    expectedAttendees: data.expectedAttendees,
                    eventBudget: Number(data.eventBudget),
                    requestedCoverageAmount: Number(data.requestedCoverageAmount),
                    preferredCoverageNotes: data.preferredCoverageNotes || '',
                    isOutdoorVenue: data.isOutdoorVenue,
                    hasAlcoholService: data.alcoholServed,
                    hasPyrotechnics: data.hasFireworks,
                    documentType: data.documentType || '',
                    // Not patching back documentData (base64) as it might be too heavy for reactive form patch initially, 
                    // but usually, we would show a 'File Uploaded' state
                });

                this.checkEventTypeProduct();
            },
            error: () => {
                this.isLoading = false;
                this.toastService.error('Failed to load draft details.');
                this.router.navigate(['/customer/dashboard']);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private fetchActiveProducts() {
        this.http.get<PolicyProductDto[]>(`${this.apiBase}/admin/policy-products?isActive=true`).subscribe({
            next: (products) => {
                this.policyProducts = products;
                this.checkEventTypeProduct(); // Initial check after products are loaded
            },
            error: () => {
                // If failed to load products, we won't show warnings
            }
        });
    }

    checkEventTypeProduct() {
        const eventType = this.requestForm.controls.eventType.value;
        if (!eventType || this.policyProducts.length === 0) {
            this.noProductWarning = false;
            return;
        }

        // Check if any active product supports this event type
        const hasProduct = this.policyProducts.some(
            p => p.eventTypeSupported.toLowerCase() === eventType.toLowerCase()
        );

        this.noProductWarning = !hasProduct;
    }

    // --- Location Picker Methods ---

    onLocationSearch(event: Event) {
        const query = (event.target as HTMLInputElement).value;
        this.locationError = '';

        if (query.length < 3) {
            this.locationResults = [];
            this.showLocationResults = false;
            return;
        }

        // Debounce: clear previous timeout
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchingLocation = true;
            this.http.get<any[]>('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: '1',
                    limit: '6'
                },
                headers: {
                    'Accept': 'application/json'
                }
            }).subscribe({
                next: (results) => {
                    this.locationResults = results;
                    this.showLocationResults = results.length > 0;
                    this.searchingLocation = false;
                },
                error: () => {
                    this.searchingLocation = false;
                    this.locationError = 'Failed to search locations. You can type manually.';
                }
            });
        }, 500);
    }

    selectLocation(result: any) {
        this.requestForm.controls.location.setValue(result.display_name);
        this.showLocationResults = false;
        this.locationResults = [];
    }

    detectLocation() {
        this.locationError = '';

        if (!navigator.geolocation) {
            this.locationError = 'Geolocation is not supported by your browser.';
            return;
        }

        this.detectingLocation = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Reverse geocode using Nominatim
                this.http.get<any>('https://nominatim.openstreetmap.org/reverse', {
                    params: {
                        lat: lat.toString(),
                        lon: lon.toString(),
                        format: 'json',
                        addressdetails: '1'
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                }).subscribe({
                    next: (result) => {
                        this.requestForm.controls.location.setValue(result.display_name);
                        this.detectingLocation = false;
                    },
                    error: () => {
                        this.detectingLocation = false;
                        this.locationError = 'Could not determine address from your location.';
                    }
                });
            },
            (error) => {
                this.detectingLocation = false;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        this.locationError = 'Location access denied. Please allow location permission in your browser.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        this.locationError = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        this.locationError = 'Location request timed out. Please try again.';
                        break;
                    default:
                        this.locationError = 'An unknown error occurred.';
                        break;
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    private mapFormToDto(): CreateInsuranceRequestDto {
        const formValue = this.requestForm.getRawValue();
        return {
            ...formValue,
            eventDate: formValue.eventDate ? new Date(formValue.eventDate).toISOString() : new Date().toISOString(),
            isOutdoorVenue: formValue.isOutdoorVenue,
            hasFireworks: formValue.hasPyrotechnics,
            alcoholServed: formValue.hasAlcoholService,
            hasVipPresence: false, // Default since not in form yet
            specialNotes: formValue.hasOtherRisks ? formValue.otherRiskDetails : '',
            documentType: formValue.documentType,
            documentData: formValue.documentData
        };
    }

    private saveDraft() {
        // Only save draft if at least some data is present
        const val = this.requestForm.getRawValue();
        if (!val.eventType && !val.location && !val.eventDate) return;

        this.isAutoSaving = true;
        const dto = this.mapFormToDto();

        if (this.currentDraftId) {
            this.requestService.updateDraft(this.currentDraftId, dto).pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.isAutoSaving = false,
                error: () => this.isAutoSaving = false
            });
        } else {
            this.requestService.createDraft(dto).pipe(takeUntil(this.destroy$)).subscribe({
                next: (res) => {
                    this.currentDraftId = res.requestId;
                    this.isAutoSaving = false;
                },
                error: () => this.isAutoSaving = false
            });
        }
    }

    onSubmit() {
        if (this.requestForm.invalid) {
            this.requestForm.markAllAsTouched();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Block if coverage exceeds budget
        if (this.coverageExceedsBudget) {
            this.toastService.error('Coverage amount cannot exceed total event budget.');
            return;
        }

        this.isLoading = true;
        const dto = this.mapFormToDto();

        const resObs = this.currentDraftId
            ? this.requestService.submitDraft(this.currentDraftId, dto)
            : this.requestService.createRequest(dto);

        resObs.subscribe({
            next: () => {
                this.isLoading = false;

                this.overlayService.show({
                    title: 'Request Submitted!',
                    message: 'Your event insurance request has been successfully created. We will review it shortly.',
                    icon: 'success',
                    duration: 3500
                });

                this.router.navigate(['/customer/dashboard']);
            },
            error: (err) => {
                this.isLoading = false;
                this.toastService.error(err.error?.error || 'Failed to submit request');
            }
        });
    }

    goBack() {
        this.router.navigate(['/customer/dashboard']);
    }
}

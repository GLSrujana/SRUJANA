import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InsuranceRequestService } from '../../../core/services/insurance-request.service';
import { TokenService } from '../../../core/auth/token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ActivePolicyDto {
  id: number;
  policyNumber: string;
  policyName: string;
  totalPremium: number;
  isPremiumPaid: boolean;
  nextPaymentDueDate?: string;
  nextPaymentAmount: number;
  startDateUtc: string;
  endDateUtc: string;
}

import { InsuranceCalendarComponent, CalendarPolicy } from './insurance-calendar/insurance-calendar.component';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, InsuranceCalendarComponent],
    template: `
    <div class="h-full flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in-up">
      <!-- Header Area -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div class="animate-fade-in-right flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
          <div>
            <h1 class="text-4xl font-black text-neutral-900 dark:text-white tracking-tight outfit-font line-clamp-1">Welcome, <span class="blue-gradient-text">{{ userName }}</span></h1>
            <p class="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-bold tracking-[0.2em] flex items-center gap-2 uppercase">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURE & ONLINE
            </p>
          </div>
          <!-- Live Clock & Date -->
          <div class="flex items-center gap-4 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
             <div class="flex flex-col">
                <span class="text-xs font-black outfit-font text-blue-600 dark:text-blue-400 tracking-tighter">{{ currentTime | date:'h:mm:ss a' }}</span>
                <span class="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">{{ currentTime | date:'EEEE, MMM d' }}</span>
             </div>
             <div class="w-px h-6 bg-neutral-200 dark:bg-neutral-700"></div>
             <div class="text-[10px] font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-widest leading-tight">
                {{ requests().length }}<br><span class="text-neutral-400 text-[8px]">Protections</span>
             </div>
          </div>
        </div>
        <button (click)="showCalendar = true" class="group relative inline-flex items-center justify-center px-8 py-3.5 font-black text-white transition-all duration-300 bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 active:translate-y-0 overflow-hidden shadow-xl">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span class="relative z-10 flex items-center gap-2.5 outfit-font tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Insurance Calendar
            </span>
        </button>
      </div>

      <!-- Calendar Modal -->
      <app-insurance-calendar 
        *ngIf="showCalendar" 
        [policies]="calendarPolicies" 
        (close)="showCalendar = false">
      </app-insurance-calendar>

      <!-- Action Required Banner (Payments Due) -->
      @if (actionRequiredPolicies.length > 0) {
        <div class="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-6 shadow-xl shadow-rose-500/20 text-white animate-fade-in-up">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-black outfit-font tracking-wide text-white">Action Required</h3>
                        <p class="text-rose-100 font-medium text-sm">You have {{ actionRequiredPolicies.length }} premium payment(s) due.</p>
                    </div>
                </div>
                <div class="flex flex-col gap-2 w-full md:w-auto">
                    @for (p of actionRequiredPolicies; track p.id) {
                        <div class="flex items-center justify-between gap-6 bg-black/10 rounded-xl px-4 py-2 border border-white/10 w-full">
                            <div>
                                <p class="text-[10px] uppercase font-black tracking-widest text-white/70">{{ p.policyNumber }}</p>
                                <p class="font-bold text-sm">{{ p.nextPaymentAmount | currency }} Due <span class="text-rose-200">({{ p.nextPaymentDueDate | date:'MMM d' }})</span></p>
                            </div>
                            <a routerLink="/customer/active-policies" class="px-4 py-1.5 bg-white text-rose-600 font-black text-xs rounded-lg hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap">Pay Now</a>
                        </div>
                    }
                </div>
            </div>
        </div>
      }

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
        <!-- Total Requests -->
        <div class="premium-card p-8 flex flex-col relative overflow-hidden group animate-scale-in stagger-1">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-125 duration-700"></div>
            <div class="flex items-center gap-5 mb-8">
                <div class="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-inner relative z-10 transition-transform group-hover:rotate-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Total Requests</h2>
                    @if (isLoading()) {
                        <div class="h-10 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                    } @else {
                        <p class="text-4xl font-black text-neutral-900 dark:text-white outfit-font leading-none">{{ requests().length }}</p>
                    }
                </div>
            </div>
            <a routerLink="/customer/requests" class="group/link inline-flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 mt-auto hover:gap-3 transition-all z-10 outfit-font tracking-wide">
                LANDSCAPE VIEW
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>

        <!-- Approved Claims Card -->
        <div class="premium-card p-8 flex flex-col relative overflow-hidden group animate-scale-in stagger-2 opacity-80 hover:opacity-100 transition-opacity">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-125 duration-700"></div>
            <div class="flex items-center gap-5 mb-8">
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner relative z-10 transition-transform group-hover:-rotate-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Approved Claims</h2>
                    <p class="text-4xl font-black text-neutral-300 dark:text-neutral-700 outfit-font leading-none" [class.text-emerald-500]="approvedClaimsCount > 0">{{ approvedClaimsCount.toString().padStart(2, '0') }}</p>
                </div>
            </div>
            <a routerLink="/customer/claims" class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 mt-auto uppercase tracking-widest z-10 transition-colors group-hover:underline cursor-pointer">Track Claims Status</a>
        </div>

        <!-- Active Policies Card -->
        <div class="premium-card p-8 flex flex-col relative overflow-hidden group animate-scale-in stagger-3 opacity-80 hover:opacity-100 transition-opacity">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-125 duration-700"></div>
            <div class="flex items-center gap-5 mb-8">
                <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-inner relative z-10 transition-transform group-hover:rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Active Policies</h2>
                    <p class="text-4xl font-black text-neutral-300 dark:text-neutral-700 outfit-font leading-none" [class.text-blue-500]="activePoliciesCount > 0">{{ activePoliciesCount.toString().padStart(2, '0') }}</p>
                </div>
            </div>
            <a routerLink="/customer/active-policies" class="text-[9px] font-black text-blue-600 dark:text-blue-400 mt-auto uppercase tracking-widest z-10 transition-colors group-hover:underline cursor-pointer">View Active Policies</a>
        </div>

      </div>

      <!-- Recent Requests List -->
      <div class="premium-card overflow-hidden flex-1 flex flex-col animate-fade-in-up stagger-4 shadow-xl">
        <div class="px-8 py-6 border-b border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h3 class="text-2xl font-black text-rose-600 dark:text-rose-400 outfit-font flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 animate-pulse">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Action Required
                </h3>
                <p class="text-xs font-black text-rose-800/60 dark:text-rose-200/60 uppercase tracking-widest mt-1">Requests requiring your immediate attention</p>
            </div>
            @if (requests().length > 0) {
              <a routerLink="/customer/requests" class="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all uppercase tracking-wider outfit-font shadow-lg shadow-rose-600/30">Expand All</a>
            }
        </div>
        
        <div class="p-0 overflow-x-auto custom-scrollbar">
            @if (isLoading()) {
                <div class="p-8 space-y-6">
                    @for (i of [1,2,3]; track i) {
                        <div class="animate-pulse flex items-center gap-6">
                            <div class="h-14 w-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl"></div>
                            <div class="flex-1 space-y-3">
                                <div class="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-1/4"></div>
                                <div class="h-3 bg-neutral-50 dark:bg-neutral-900 rounded-md w-1/3"></div>
                            </div>
                            <div class="h-8 w-24 bg-neutral-100 dark:bg-neutral-800 rounded-full"></div>
                        </div>
                    }
                </div>
            } @else if (error()) {
                <div class="p-12 text-center text-red-500">
                    <div class="inline-flex p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4 animate-shake text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <p class="font-black outfit-font text-lg">{{ error() }}</p>
                    <button (click)="ngOnInit()" class="mt-4 text-xs font-bold text-neutral-500 underline underline-offset-4">Retry Sync</button>
                </div>
            } @else if (sortedRequests().length === 0) {
                <div class="p-20 text-center flex flex-col items-center">
                    <div class="w-24 h-24 bg-rose-50 dark:bg-rose-950/30 rounded-[2.5rem] flex items-center justify-center mb-6 text-rose-400 dark:text-rose-600 shadow-inner group cursor-default">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-neutral-900 dark:text-white font-black text-2xl mb-2 outfit-font tracking-tight">Everything is Clear</h3>
                    <p class="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm font-medium leading-relaxed">You have no requests requiring immediate attention. All your active submissions are currently being handled by our team.</p>
                </div>
            } @else {
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-neutral-50/50 dark:bg-neutral-900/50 text-[10px] uppercase tracking-widest text-neutral-400 font-black border-b border-neutral-100 dark:border-neutral-800">
                            <th class="px-8 py-5">Identifer</th>
                            <th class="px-8 py-5">Event Intelligence</th>
                            <th class="px-8 py-5">Assigned Support</th>
                            <th class="px-8 py-5">Current Phase</th>
                            <th class="px-8 py-5">Status Note</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-50 dark:divide-neutral-800 text-sm">
                        @for (req of sortedRequests(); track req.requestId) {
                            <tr class="hover:bg-rose-50/10 dark:hover:bg-rose-900/5 transition-all group/row cursor-pointer" 
                                [routerLink]="req.status === 8 ? ['/customer/create-request'] : null" 
                                [queryParams]="req.status === 8 ? { draftId: req.requestId } : null">
                                <td class="px-8 py-6 font-black text-neutral-950 dark:text-white outfit-font">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-neutral-400 mb-1">REQ_ID</span>
                                        <div class="flex items-center">
                                            <span class="inline-flex items-center justify-center w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-400 mr-2 group-hover/row:bg-rose-600 group-hover/row:text-white transition-colors">#</span>
                                            REQ-{{ req.requestId.toString().padStart(4, '0') }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover/row:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="font-black text-neutral-950 dark:text-white outfit-font tracking-tight">{{ req.eventType || 'Event' }}</p>
                                            <p class="text-[10px] text-neutral-500 font-bold tracking-tight mt-0.5 truncate max-w-[150px]">{{ req.location }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="space-y-2">
                                        @if (req.assignedAgentName) {
                                            <div class="flex items-center gap-2">
                                                <div class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-[9px] font-black text-neutral-400 leading-none uppercase tracking-tighter mb-0.5">Assigned Agent</span>
                                                    <span class="text-xs font-black text-neutral-900 dark:text-white outfit-font leading-none truncate">{{ req.assignedAgentName }}</span>
                                                </div>
                                            </div>
                                        }
                                        @if (req.assignedClaimsOfficerName) {
                                            <div class="flex items-center gap-2">
                                                <div class="w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1a3 3 0 013-3 3.005 3.005 0 012.25-2.906z" /></svg>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-[9px] font-black text-neutral-400 leading-none uppercase tracking-tighter mb-0.5">Claims Officer</span>
                                                    <span class="text-xs font-black text-neutral-900 dark:text-white outfit-font leading-none truncate">{{ req.assignedClaimsOfficerName }}</span>
                                                </div>
                                            </div>
                                        } @else {
                                            <div class="flex items-center gap-2">
                                                <div class="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1a3 3 0 013-3 3.005 3.005 0 012.25-2.906z" /></svg>
                                                </div>
                                                <span class="text-[10px] text-neutral-400 font-bold italic">Not assigned yet</span>
                                            </div>
                                        }
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                   <span class="inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300" 
                                         [ngClass]="getStatusClasses(req.status)">
                                      {{ getStatusText(req.status) }}
                                   </span>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="max-w-[200px] flex items-center justify-between gap-4">
                                        <p class="text-[10px] text-neutral-500 font-medium leading-relaxed italic line-clamp-2">
                                            @if (req.status === 6) {
                                                Additional information is required from your side to proceed with this request. Please contact your agent.
                                            } @else if (req.status === 5) {
                                                This request has been rejected. Check for agent remarks or contact support.
                                            } @else if (req.status === 8) {
                                                This request was partially completed. Click resume to finish your application.
                                            } @else {
                                                {{ req.submittedAtUtc | date:'mediumDate' }} • {{ req.submittedAtUtc | date:'shortTime' }}
                                            }
                                        </p>
                                        @if (req.status === 8) {
                                            <div class="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">Resume</div>
                                        }
                                    </div>
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
export class CustomerDashboardComponent implements OnInit {
    private requestService = inject(InsuranceRequestService);
    private tokenService = inject(TokenService);
    private http = inject(HttpClient);

    readonly requests = this.requestService.requests;
    readonly isLoading = this.requestService.isLoading;
    readonly error = this.requestService.error;

    userName: string = 'User';
    activePoliciesCount: number = 0;
    approvedClaimsCount: number = 0;
    actionRequiredPolicies: ActivePolicyDto[] = [];
    
    currentTime: Date = new Date();
    private clockInterval?: any;

    showCalendar: boolean = false;
    calendarPolicies: CalendarPolicy[] = [];

    ngOnInit() {
        this.userName = localStorage.getItem('fullName') || 'User';
        this.requestService.getMyRequests().subscribe();
        
        // Start live clock
        this.clockInterval = setInterval(() => {
            this.currentTime = new Date();
        }, 1000);
        
        // Fetch active policies to get count and check for due payments
        this.http.get<ActivePolicyDto[]>(`${environment.apiBaseUrl}/active-policies/customer-active-policies`)
            .subscribe(policies => {
                this.activePoliciesCount = policies.length;
                this.calendarPolicies = policies.map(p => ({
                    id: p.id,
                    policyNumber: p.policyNumber,
                    policyName: p.policyName,
                    startDate: new Date(p.startDateUtc),
                    endDate: new Date(p.endDateUtc),
                    status: 'Active',
                    nextPaymentDate: p.nextPaymentDueDate ? new Date(p.nextPaymentDueDate) : undefined
                }));
                this.actionRequiredPolicies = policies.filter(p => {
                    if (p.isPremiumPaid || !p.nextPaymentDueDate) return false;
                    const dueDate = new Date(p.nextPaymentDueDate);
                    const now = new Date();
                    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
                    return diffDays <= 7;
                });
            });

        // Fetch approved claims to get count
        this.http.get<any[]>(`${environment.apiBaseUrl}/claims/customer-claims`)
            .subscribe(claims => {
                this.approvedClaimsCount = claims.filter(c => c.status === 3 || c.status === 5).length;
            });
    }

    ngOnDestroy() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }

    // Helper to slice and sort only requests that are in 'trouble' or need action
    sortedRequests() {
        return this.requests()
            .filter(r => r.status === 6 || r.status === 5 || r.status === 8) // Info Required OR Rejected OR Draft
            .sort((a, b) => new Date(b.submittedAtUtc).getTime() - new Date(a.submittedAtUtc).getTime());
    }

    getStatusText(status: number): string {
        const labels: Record<number, string> = {
            1: 'Submitted',
            2: 'Assigned',
            3: 'Suggestions Sent',
            4: 'Converted',
            5: 'Rejected',
            6: 'Info Required',
            7: 'Closed',
            8: 'Draft (Resume)'
        };
        return labels[status] || 'Unknown';
    }

    getStatusClasses(status: number): string {
        switch (status) {
            case 1: return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 badge-glow-warning';
            case 2: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 3: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 4: return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 badge-glow-success';
            case 5: return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50 badge-glow-error';
            case 6: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 badge-glow-info';
            case 8: return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50 animate-pulse';
            default: return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200';
        }
    }
}

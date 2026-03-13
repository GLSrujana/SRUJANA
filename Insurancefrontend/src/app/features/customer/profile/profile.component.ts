import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/auth/token.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-4xl mx-auto w-full py-12 animate-fade-in-up">
      <!-- Profile Header -->
      <div class="premium-card p-10 relative overflow-hidden group mb-8">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-bl-[200px] -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-1000"></div>
        
        <div class="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <!-- Avatar Container -->
          <div class="relative">
            <div class="absolute inset-0 bg-blue-600 rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
            <div class="relative w-40 h-40 rounded-[3rem] bg-gradient-to-tr from-blue-600 to-yellow-500 flex items-center justify-center text-6xl font-black text-white shadow-2xl border-4 border-white dark:border-neutral-800 ring-1 ring-neutral-200/50 transform hover:rotate-3 transition-transform duration-500">
              {{ initials }}
            </div>
            <div class="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-emerald-500 border-4 border-white dark:border-neutral-900 flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="text-center md:text-left">
            <h1 class="text-4xl font-black text-neutral-900 dark:text-white outfit-font tracking-tight mb-2 uppercase">{{ fullName }}</h1>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <span class="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-200/50 dark:border-blue-700/30">
                Verified {{ role }}
              </span>
              <span class="px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-black uppercase tracking-widest border border-neutral-200/50 dark:border-neutral-700/30">
                ID: CUST-{{ (userId || 0).toString().padStart(4, '0') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Account Details -->
        <div class="premium-card p-8 animate-scale-in stagger-1">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 class="text-lg font-black text-neutral-900 dark:text-white outfit-font uppercase tracking-tight">Account Details</h2>
          </div>

          <div class="space-y-6">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Full Name</span>
              <p class="text-neutral-900 dark:text-white font-black outfit-font">{{ fullName }}</p>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Email Address</span>
              <p class="text-neutral-900 dark:text-white font-black outfit-font">{{ email }}</p>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Account Type</span>
              <p class="text-blue-600 dark:text-blue-400 font-black outfit-font">{{ role }} Portal Access</p>
            </div>
          </div>
        </div>

        <!-- Security & Activity -->
        <div class="premium-card p-8 animate-scale-in stagger-2">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
              </svg>
            </div>
            <h2 class="text-lg font-black text-neutral-900 dark:text-white outfit-font uppercase tracking-tight">Security Settings</h2>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div class="flex flex-col">
                <span class="text-xs font-black text-neutral-900 dark:text-white outfit-font">Two-Factor Protection</span>
                <span class="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Extra Safety Active</span>
              </div>
              <div class="w-10 h-5 rounded-full bg-emerald-500/20 flex items-center px-1">
                <div class="w-3 h-3 rounded-full bg-emerald-500 ml-auto"></div>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 opacity-60">
              <div class="flex flex-col">
                <span class="text-xs font-black text-neutral-900 dark:text-white outfit-font">Idle Auto-Logout</span>
                <span class="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Off - Turn on for safety</span>
              </div>
              <div class="w-10 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center px-1">
                <div class="w-3 h-3 rounded-full bg-white"></div>
              </div>
            </div>

            <button class="w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-black uppercase tracking-widest outfit-font hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-neutral-500/10">
              Update Security Settings
            </button>
          </div>
        </div>

      </div>

      <!-- Action Footer -->
      <div class="mt-12 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
        Last synchronized: {{ today | date:'mediumTime' }} UTC
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class ProfileComponent implements OnInit {
    private tokenService = inject(TokenService);

    fullName: string = '';
    email: string = '';
    role: string = '';
    initials: string = '';
    userId: number | null = null;
    today = new Date();

    ngOnInit() {
        this.fullName = localStorage.getItem('fullName') || 'User';
        this.email = localStorage.getItem('email') || 'user@eventsure.com';
        this.role = this.tokenService.getRole() || 'Member';
        this.userId = Number(localStorage.getItem('userId')) || null;
        this.initials = this.getInitials(this.fullName);
    }

    private getInitials(name: string): string {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.length > 0 ? name[0].toUpperCase() : 'U';
    }
}

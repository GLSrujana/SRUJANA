import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/auth/token.service';

@Component({
    selector: 'app-floating-support',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      
      <!-- Support Panel -->
      <div 
        *ngIf="isOpen()"
        class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 shadow-2xl rounded-[2rem] p-6 w-72 backdrop-blur-xl animate-scale-in origin-bottom-right pointer-events-auto"
      >
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l4.5-4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h3 class="text-sm font-black text-neutral-900 dark:text-white outfit-font">{{ role === 'Agent' ? 'Admin Desk' : 'Support' }}</h3>
                <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mt-1">Active</p>
            </div>
        </div>

        <div class="space-y-4">
            @if (role === 'Agent') {
                <!-- Admin Hotline -->
                <a href="tel:+18005550199" class="flex flex-col p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 group">
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">Direct Line</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">Contact Admin</span>
                </a>

                <!-- Priority Email -->
                <a href="mailto:admin-support@eventsure.com" class="flex flex-col p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 group">
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">Priority Email</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white group-hover:text-yellow-600 transition-colors">Email Admin</span>
                </a>
            } @else {
                <!-- Global Hotline -->
                <a href="tel:+18001234567" class="flex flex-col p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 group">
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">24/7 Support</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">Call Hotline</span>
                </a>

                <!-- Claims Assistance -->
                <a href="tel:+18009876543" class="flex flex-col p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 group">
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">Claim Desk</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white group-hover:text-yellow-600 transition-colors">Call Claims</span>
                </a>

                <!-- Local Support -->
                <a href="tel:+919876543210" class="flex flex-col p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 group">
                    <span class="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">Help Desk</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">Local Support</span>
                </a>
            }
        </div>

        <div class="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <p class="text-[10px] text-neutral-400 font-medium text-center italic">"Excellence in every interaction."</p>
        </div>
      </div>

      <!-- Trigger Button -->
      <button 
        (click)="toggle()"
        class="pointer-events-auto h-16 w-16 rounded-[2rem] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-tr from-blue-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 transition-transform duration-500 group-hover:rotate-12">
            <svg *ngIf="!isOpen()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <svg *ngIf="isOpen()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        
        <!-- Ripple effect decoration -->
        <div class="absolute inset-0 rounded-full bg-blue-500 opacity-20 scale-0 group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
      </button>

    </div>
  `,
    styles: [`
    :host { display: contents; }
  `]
})
export class FloatingSupportComponent implements OnInit {
    private tokenService = inject(TokenService);

    isOpen = signal(false);
    role: string | null = null;

    ngOnInit() {
        this.role = this.tokenService.getRole();
    }

    toggle() {
        this.isOpen.update(v => !v);
    }
}

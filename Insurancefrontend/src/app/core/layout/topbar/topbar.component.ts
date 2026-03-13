import { Component, inject, PLATFORM_ID, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../auth/token.service';
import { AuthService } from '../../auth/auth.service';
import { NotificationsBellComponent } from '../../notifications/ui/notifications-bell/notifications-bell.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, NotificationsBellComponent, RouterLink],
  template: `
    <header class="h-20 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div class="flex items-center gap-6">
        <!-- Mobile Menu Toggle -->
        <button (click)="toggleSidebar.emit()" class="md:hidden p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Breadcrumb / Page Title -->
        <div class="hidden sm:flex items-center gap-3 py-1.5 px-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 animate-fade-in-right">
           <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-400 group cursor-default">
              <span class="hover:text-blue-500 transition-colors">Overview</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-neutral-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
              <span class="text-blue-600 dark:text-blue-400 font-black">{{ currentRole }} PORTAL</span>
           </div>
        </div>
      </div>

      <div class="flex items-center gap-4 sm:gap-6">
        
        <!-- Theme Toggle -->
        <button (click)="toggleTheme()" class="relative p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-neutral-200/50 dark:border-neutral-800 shadow-sm hover:shadow-md active:scale-95 group overflow-hidden">
          <div class="relative z-10 transition-transform duration-500 group-hover:rotate-[30deg]">
              <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
          </div>
          <div class="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-[90%] transition-transform opacity-10"></div>
        </button>

        <div class="h-10 scale-90">
            <app-notifications-bell></app-notifications-bell>
        </div>

        <div class="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>

        <!-- User Profile Dropdown -->
        <div class="relative group">
            <button class="flex items-center gap-3 p-1 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all focus:outline-none group/btn">
                <div class="text-right hidden md:block mr-1">
                    <p class="text-xs font-black text-neutral-900 dark:text-white leading-none mb-1.5 outfit-font">{{ userName }}</p>
                    <div class="flex items-center justify-end gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <p class="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">{{ userRole }}</p>
                    </div>
                </div>
                <!-- Premium Avatar -->
                <div class="relative">
                    <div class="absolute inset-0 bg-blue-600 rounded-2xl blur-md opacity-20 group-hover/btn:opacity-40 transition-opacity"></div>
                    <div class="relative h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-yellow-500 text-white flex items-center justify-center font-black text-sm shadow-xl border-2 border-white dark:border-neutral-800 ring-1 ring-neutral-200/50 dark:ring-neutral-700/50 transition-transform group-hover/btn:scale-105 active:scale-95 duration-300">
                        {{ userInitials }}
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-400 group-hover/btn:text-blue-600 transition-colors hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
            
            <!-- Enhanced Dropdown Menu -->
            <div class="absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-neutral-100 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 transform origin-top-right z-50 overflow-hidden">
                <div class="p-6 bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-100 dark:border-neutral-800">
                    <p class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Logged in as</p>
                    <p class="text-sm font-black text-neutral-900 dark:text-white truncate outfit-font">{{ userName }}</p>
                    <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1 font-medium">{{ userEmail }}</p>
                </div>
                <div class="p-3">
                    <button routerLink="/profile" class="w-full text-left flex items-center gap-3 px-4 py-3 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl transition-all group/item">
                        <div class="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/40 group-hover/item:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        Profile Settings
                    </button>
                    <button (click)="logout()" class="w-full text-left flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all group/logout">
                        <div class="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 group-hover/logout:bg-red-600 group-hover/logout:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        Secure Logout
                    </button>
                </div>
            </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string = 'Unknown User';
  userEmail: string = '';
  userRole: string = 'No Role';
  userInitials: string = 'U';
  currentRole: string = 'System';
  isDarkMode: boolean = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userName = localStorage.getItem('fullName') || 'Unknown User';
      this.userEmail = localStorage.getItem('email') || '';
      this.userRole = this.tokenService.getRole() || 'No Role';
      this.currentRole = this.userRole;
      this.userInitials = this.getInitials(this.userName);

      // Initialize theme based on preference
      const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        this.setDarkMode(true);
      }
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.isDarkMode);
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode = isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  private getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.length > 0 ? name[0].toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }
}

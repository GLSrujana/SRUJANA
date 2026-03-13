import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../auth/token.service';
import { UserRole } from '../../auth/auth.models';
import { MENU_CONFIG, MenuItem } from '../menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Overlay -->
    @if (isOpen) {
      <div 
        class="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 transition-opacity md:hidden"
        (click)="closeSidebar.emit()">
      </div>
    }

    <!-- Sidebar Container -->
    <aside 
      class="fixed md:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-all duration-500 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none"
      [class.-translate-x-full]="!isOpen">
      
      <!-- Brand Header -->
      <div class="h-20 flex flex-col justify-center px-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/50">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 group cursor-pointer" routerLink="/">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white transform group-hover:rotate-6 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08z" clip-rule="evenodd" />
                 </svg>
              </div>
              <div>
                <h1 class="text-xl font-black tracking-tight text-neutral-900 dark:text-white outfit-font">Event<span class="text-blue-600">Sure</span></h1>
                <p class="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">Premium Suite</p>
              </div>
            </div>
            <!-- Mobile Close Button -->
            <button (click)="closeSidebar.emit()" class="md:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
      </div>

      <!-- Enhanced Role Badge -->
      <div class="px-6 py-6">
        <div class="relative group">
            <div class="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span class="relative flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-sm transition-all duration-300 group-hover:border-blue-300">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              {{ currentRole }} Gateway
            </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
        @for (item of mainMenuItems; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="!bg-blue-600 !text-white shadow-lg shadow-blue-600/20 active-link"
             [routerLinkActiveOptions]="{exact: item.path === '/notifications' ? false : true}"
             (click)="closeSidebar.emit()"
             class="group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-neutral-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 overflow-hidden">
             <!-- Active Glow Effect -->
             <div class="absolute inset-y-0 left-0 w-1.5 bg-white rounded-r-full transform -translate-x-full transition-transform duration-300 group-[.active-link]:translate-x-0"></div>
             
             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-all duration-300 group-hover:scale-110" [ngClass]="{'text-white': rla.isActive, 'text-neutral-400 dark:text-neutral-500 group-hover:text-blue-500': !rla.isActive}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" #rla="routerLinkActive" routerLinkActive>
               <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
             </svg>
             <span class="tracking-tight">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom Branding -->
      <div class="p-6 border-t border-neutral-100 dark:border-neutral-800">
         <div class="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-200/50 dark:border-neutral-800">
            <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</p>
            <div class="flex items-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-500">System Online</span>
            </div>
         </div>
      </div>
      
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
  `]
})
export class SidebarComponent {
  private tokenService = inject(TokenService);

  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  currentRole: UserRole | null = this.tokenService.getRole();
  mainMenuItems: MenuItem[] = [];

  constructor() {
    this.buildMenu();
  }

  private buildMenu(): void {
    if (!this.currentRole) return;
    const items = MENU_CONFIG[this.currentRole] || [];

    this.mainMenuItems = items;
  }
}

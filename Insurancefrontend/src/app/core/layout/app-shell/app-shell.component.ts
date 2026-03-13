import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen w-full bg-neutral-50 dark:bg-neutral-900 overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      <!-- Sidebar -->
      <app-sidebar 
        [isOpen]="isSidebarOpen" 
        (closeSidebar)="isSidebarOpen = false">
      </app-sidebar>

      <!-- Main Content Area -->
      <div class="flex w-full flex-col flex-1 overflow-hidden relative">
        <!-- Topbar -->
        <app-topbar (toggleSidebar)="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <!-- Main Scrolling Content -->
        <main class="flex-1 overflow-y-auto w-full custom-scrollbar">
          <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full h-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
  `]
})
export class AppShellComponent {
  isSidebarOpen = false;
}

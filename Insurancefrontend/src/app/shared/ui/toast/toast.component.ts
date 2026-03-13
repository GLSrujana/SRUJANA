import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-80 max-w-[90vw]">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto p-4 rounded-lg shadow-lg text-white font-medium flex items-center justify-between transition-all duration-300 animate-fade-in-down"
          [ngClass]="getToastClasses(toast.type)">
          
          <div class="flex items-center gap-3">
            @switch (toast.type) {
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('error') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('info') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            }
            <span class="break-words">{{ toast.message }}</span>
          </div>

          <button 
            type="button" 
            (click)="removeToast(toast.id)"
            class="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none shrink-0"
            aria-label="Close">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);

    getToastClasses(type: ToastType): string {
        switch (type) {
            case 'success':
                return 'bg-green-600 border border-green-700';
            case 'error':
                return 'bg-red-600 border border-red-700';
            case 'info':
                return 'bg-blue-600 border border-blue-700';
            default:
                return 'bg-gray-800 border border-gray-900';
        }
    }

    removeToast(id: number): void {
        this.toastService.remove(id);
    }
}

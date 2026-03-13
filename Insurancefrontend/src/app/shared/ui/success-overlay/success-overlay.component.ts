import { Component, Injectable, ApplicationRef, EnvironmentInjector, createComponent, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OverlayConfig {
    title: string;
    message: string;
    icon: 'success' | 'payment';
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class SuccessOverlayService {
    private overlayState = new BehaviorSubject<{ show: boolean, config?: OverlayConfig }>({ show: false });
    overlayState$ = this.overlayState.asObservable();

    show(config: OverlayConfig) {
        this.overlayState.next({ show: true, config });
        if (config.duration) {
            setTimeout(() => this.hide(), config.duration);
        } else {
            // Default hide after 3 seconds
            setTimeout(() => this.hide(), 3000);
        }
    }

    hide() {
        this.overlayState.next({ show: false });
    }
}

@Component({
    selector: 'app-success-overlay',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="(overlayState$ | async)?.show" class="fixed inset-0 z-[100] flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300" 
             [class.opacity-0]="isClosing" [class.opacity-100]="!isClosing">
        </div>
        
        <!-- Modal -->
        <div class="relative w-full max-w-sm p-8 bg-white dark:bg-black rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 text-center animate-pop-in"
             [class.scale-95]="isClosing" [class.opacity-0]="isClosing">
            
            <!-- Success Icon Animation -->
            <div *ngIf="(overlayState$ | async)?.config?.icon === 'success'" class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6 relative">
               <div class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
               <svg class="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
               </svg>
            </div>

            <!-- Payment Icon Animation -->
            <div *ngIf="(overlayState$ | async)?.config?.icon === 'payment'" class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white dark:bg-black mb-6 relative ring-4 ring-blue-500/20">
               <svg class="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
               </svg>
            </div>

            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{{ (overlayState$ | async)?.config?.title }}</h3>
            <p class="text-neutral-500 dark:text-neutral-400 font-medium">{{ (overlayState$ | async)?.config?.message }}</p>
        </div>
    </div>
  `
})
export class SuccessOverlayComponent {
    overlayState$: Observable<{ show: boolean, config?: OverlayConfig }>;
    isClosing = false;

    constructor(private service: SuccessOverlayService) {
        this.overlayState$ = this.service.overlayState$;
        this.overlayState$.subscribe(state => {
            if (!state.show) {
                this.isClosing = true;
                setTimeout(() => { this.isClosing = false; }, 300); // Wait for transition
            }
        });
    }
}

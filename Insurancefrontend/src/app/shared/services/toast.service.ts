import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private nextId = 0;

    // Expose toasts as a readonly signal
    private toastsSignal = signal<Toast[]>([]);
    public toasts = this.toastsSignal.asReadonly();

    constructor() { }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error');
    }

    info(message: string): void {
        this.show(message, 'info');
    }

    private show(message: string, type: ToastType): void {
        const id = this.nextId++;
        const newToast: Toast = { id, message, type };

        setTimeout(() => {
            this.toastsSignal.update(toasts => [...toasts, newToast]);
        });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: number): void {
        this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
    }
}

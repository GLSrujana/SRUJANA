import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarPolicy {
    id: number;
    policyNumber: string;
    policyName: string;
    startDate: Date;
    endDate: Date;
    status: string;
    nextPaymentDate?: Date;
}

@Component({
    selector: 'app-insurance-calendar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40 animate-fade-in" (click)="onClose()">
        <div class="bg-white dark:bg-neutral-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-black outfit-font text-neutral-900 dark:text-white tracking-tight">Insure<span class="blue-gradient-text">Calendar</span></h2>
                    </div>
                </div>
                <button (click)="onClose()" class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6">
                <!-- Month Navigator -->
                <div class="flex items-center justify-between mb-6 px-4">
                    <h3 class="text-lg font-black outfit-font text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">
                        {{ currentMonthName }} <span class="text-blue-500">{{ currentYear }}</span>
                    </h3>
                    <div class="flex gap-1.5">
                        <button (click)="prevMonth()" class="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-all border border-blue-100 dark:border-blue-900/40">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button (click)="nextMonth()" class="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-all border border-blue-100 dark:border-blue-900/40">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1.5 mb-6 text-center animate-fade-in">
                    <!-- Weekdays -->
                    <div *ngFor="let day of weekDays" class="py-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">{{ day }}</div>
                    
                    <!-- Blank cells for start of month -->
                    <div *ngFor="let empty of emptyCells" class="bg-neutral-50/30 dark:bg-neutral-900/10 rounded-2xl aspect-square"></div>
                    
                    <!-- Day cells -->
                    <div *ngFor="let day of daysInMonth" 
                         [ngClass]="getDayClasses(day)"
                         class="relative p-1.5 rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer shadow-sm border border-transparent hover:scale-105 hover:shadow-lg active:scale-95">
                        
                        <span class="text-sm font-black outfit-font" [ngClass]="isToday(day) ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'">{{ day }}</span>
                        
                        <!-- Event Indicators -->
                        <div class="flex flex-wrap gap-1 mt-1 justify-center max-w-full">
                            <div *ngFor="let event of getEventsForDay(day)" 
                                 [ngClass]="getEventIndicatorClass(event, day)"
                                 class="w-2 h-2 rounded-full transition-all group-hover:scale-110 ring-1 ring-white dark:ring-neutral-950">
                            </div>
                        </div>

                        <!-- Notification Badge (Premium/Expiry) -->
                        <div *ngIf="hasNotification(day)" 
                             class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm animate-pulse z-10">
                        </div>

                        <!-- Tooltip Overlay on click or hover (simulated) -->
                        <div *ngIf="getEventsForDay(day).length > 0" 
                             class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-neutral-900 dark:bg-neutral-800 text-white p-3 rounded-xl text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl pointer-events-none">
                            <div *ngFor="let event of getEventsForDay(day)" class="mb-2 last:mb-0 border-l-2 pl-2" [ngClass]="getEventBorderClass(event, day)">
                                <p class="font-black text-[9px] uppercase tracking-widest text-neutral-400">{{ getEventTypeLabel(event, day) }}</p>
                                <p class="font-bold truncate">{{ event.policyName }}</p>
                                <p class="text-[8px] opacity-70">{{ event.policyNumber }}</p>
                            </div>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900 dark:border-t-neutral-800"></div>
                        </div>
                    </div>
                </div>

                <!-- Legend -->
                <div class="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-4 items-center justify-center text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded bg-emerald-500"></div>
                        <span>Start Date</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded bg-rose-500"></div>
                        <span>Expiry Date</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-full h-1 bg-blue-200 dark:bg-blue-900 shadow-[0_0_10px_rgba(139,92,246,0.3)] min-w-[30px] rounded-full"></div>
                        <span>Active Period</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-white dark:border-neutral-800 shadow-sm"></div>
                        <span>Attention Required</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded bg-blue-600 outline outline-2 outline-offset-2 outline-blue-600"></div>
                        <span>Today</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .blue-gradient-text {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .outfit-font { font-family: 'Outfit', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    `]
})
export class InsuranceCalendarComponent implements OnInit {
    @Input() policies: CalendarPolicy[] = [];
    @Output() close = new EventEmitter<void>();

    currentDate = new Date();
    viewDate = new Date();
    
    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysInMonth: number[] = [];
    emptyCells: number[] = [];

    get currentMonthName(): string {
        return this.viewDate.toLocaleString('default', { month: 'long' });
    }

    get currentYear(): number {
        return this.viewDate.getFullYear();
    }

    ngOnInit() {
        this.generateCalendar();
    }

    generateCalendar() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();
        
        this.emptyCells = Array(firstDay).fill(0);
        this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
    }

    prevMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.generateCalendar();
    }

    onClose() {
        this.close.emit();
    }

    isToday(day: number): boolean {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        return d.toDateString() === this.currentDate.toDateString();
    }

    getDayClasses(day: number): string {
        if (this.isToday(day)) {
            return 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-500 scale-105 z-10';
        }

        const events = this.getEventsForDay(day);
        if (events.length > 0) {
            return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/50 shadow-inner';
        }

        return 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 hover:border-neutral-300';
    }

    hasNotification(day: number): boolean {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        d.setHours(0, 0, 0, 0);

        return this.policies.some(p => {
            // Check for payment due
            if (p.nextPaymentDate) {
                const payDate = new Date(p.nextPaymentDate);
                payDate.setHours(0, 0, 0, 0);
                if (d.getTime() === payDate.getTime()) return true;
                
                // Also notify if it's within 7 days of today
                const diffTime = payDate.getTime() - this.currentDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (d.getTime() === this.currentDate.getTime() && diffDays <= 7 && diffDays >= 0) return true;
            }

            // Check for expiry within 7 days
            const expDate = new Date(p.endDate);
            expDate.setHours(0, 0, 0, 0);
            if (d.getTime() === expDate.getTime()) return true;
            
            const expDiffTime = expDate.getTime() - this.currentDate.getTime();
            const expDiffDays = Math.ceil(expDiffTime / (1000 * 60 * 60 * 24));
            if (d.getTime() === this.currentDate.getTime() && expDiffDays <= 7 && expDiffDays >= 0) return true;

            return false;
        });
    }

    getEventsForDay(day: number): CalendarPolicy[] {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        d.setHours(0, 0, 0, 0);

        return this.policies.filter(p => {
            const start = new Date(p.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(p.endDate);
            end.setHours(0, 0, 0, 0);
            
            return (d.getTime() >= start.getTime() && d.getTime() <= end.getTime());
        });
    }

    getEventIndicatorClass(event: CalendarPolicy, day: number): string {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        d.setHours(0, 0, 0, 0);
        
        const start = new Date(event.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(event.endDate);
        end.setHours(0, 0, 0, 0);

        if (d.getTime() === start.getTime()) return 'bg-emerald-500';
        if (d.getTime() === end.getTime()) return 'bg-rose-500';
        return 'bg-blue-400 opacity-60';
    }

    getEventBorderClass(event: CalendarPolicy, day: number): string {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        d.setHours(0, 0, 0, 0);
        
        const start = new Date(event.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(event.endDate);
        end.setHours(0, 0, 0, 0);

        if (d.getTime() === start.getTime()) return 'border-emerald-500';
        if (d.getTime() === end.getTime()) return 'border-rose-500';
        return 'border-blue-500';
    }

    getEventTypeLabel(event: CalendarPolicy, day: number): string {
        const d = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
        d.setHours(0, 0, 0, 0);
        
        const start = new Date(event.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(event.endDate);
        end.setHours(0, 0, 0, 0);

        if (d.getTime() === start.getTime()) return 'Insurance Start';
        if (d.getTime() === end.getTime()) return 'Insurance Expiry ⚠️';
        
        if (event.nextPaymentDate) {
            const pay = new Date(event.nextPaymentDate);
            pay.setHours(0, 0, 0, 0);
            if (d.getTime() === pay.getTime()) return 'Premium Due 💸';
        }

        return 'Active Protection';
    }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, catchError, of } from 'rxjs';
import { NotificationService } from '../../core/notifications/notification.service';
import { NotificationDto } from '../../core/notifications/notification.models';
import { ToastService } from '../../shared/services/toast.service';

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight outfit-font">Notifications</h1>
          <p class="mt-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">
            {{ unreadCount > 0 ? unreadCount + ' unread alerts' : 'All caught up' }}
          </p>
        </div>
        @if (unreadCount > 0) {
          <button 
            (click)="markAllAsRead()"
            [disabled]="isMarkingAll"
            class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-60 border border-blue-500">
            @if (isMarkingAll) {
              <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            }
            Mark all as read
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex gap-4">
              <div class="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl flex-shrink-0"></div>
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                <div class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Loaded Data -->
      @if (!loading) {
        
        <!-- Empty State -->
        @if (notifications.length === 0) {
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 p-16 text-center flex flex-col items-center">
            <div class="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>
            <h3 class="text-xl font-black text-neutral-800 dark:text-white mb-1">All Clear!</h3>
            <p class="text-neutral-400 dark:text-neutral-500 text-sm max-w-xs">You have no notifications. New alerts from your insurance activity will appear here.</p>
          </div>
        }

        <!-- Notifications List -->
        @if (notifications.length > 0) {
          <div class="space-y-3">
            @for (notification of notifications; track notification.id) {
              <div 
                class="group bg-white dark:bg-neutral-900 rounded-2xl border p-5 transition-all duration-200 hover:shadow-md"
                [ngClass]="!notification.isRead
                  ? 'border-blue-200 dark:border-blue-800/60 bg-blue-50/30 dark:bg-blue-900/5 shadow-sm'
                  : 'border-neutral-100 dark:border-neutral-800'">
                
                <div class="flex items-start gap-4">
                  <!-- Icon Dot -->
                  <div class="mt-0.5 flex-shrink-0">
                    @if (!notification.isRead) {
                      <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                      </div>
                    } @else {
                      <div class="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-neutral-400">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    }
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="text-sm font-black" [ngClass]="!notification.isRead ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'">
                        {{ notification.title || 'System Notification' }}
                      </h3>
                      @if (!notification.isRead) {
                        <span class="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-md">NEW</span>
                      }
                      <span class="text-[10px] text-neutral-400 font-medium ml-auto">{{ notification.createdAtUtc | date:'MMM d, y · h:mm a' }}</span>
                    </div>
                    <p class="text-sm" [ngClass]="!notification.isRead ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'">
                      {{ notification.message }}
                    </p>
                  </div>

                  <!-- Mark Read Button -->
                  @if (!notification.isRead) {
                    <button 
                      (click)="markAsRead(notification.id)"
                      [disabled]="markingId === notification.id"
                      title="Mark as read"
                      class="shrink-0 p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100">
                      @if (markingId === notification.id) {
                        <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      }
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
    private notificationService = inject(NotificationService);
    private toast = inject(ToastService);

    notifications: NotificationDto[] = [];
    loading = true;
    unreadCount = 0;
    markingId: number | null = null;
    isMarkingAll = false;
    private sub: Subscription | null = null;

    ngOnInit() {
        this.sub = this.notificationService.refresh$.pipe(
            switchMap(() => {
                return this.notificationService.getMyNotifications().pipe(
                    catchError(() => of([]))
                );
            })
        ).subscribe((data) => {
            this.notifications = data.sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
            this.unreadCount = this.notifications.filter(n => !n.isRead).length;
            this.loading = false;
        });
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    markAsRead(id: number) {
        this.markingId = id;
        // Optimistic local update
        const n = this.notifications.find(x => x.id === id);
        if (n) { n.isRead = true; this.unreadCount = this.notifications.filter(x => !x.isRead).length; }

        this.notificationService.markAsRead(id).subscribe({
            next: () => { this.markingId = null; },
            error: () => {
                // Revert on error
                if (n) { n.isRead = false; this.unreadCount = this.notifications.filter(x => !x.isRead).length; }
                this.markingId = null;
                this.toast.error('Could not mark as read. Try again.');
            }
        });
    }

    markAllAsRead() {
        this.isMarkingAll = true;
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                this.isMarkingAll = false;
                this.toast.success('All notifications cleared');
            },
            error: () => {
                this.isMarkingAll = false;
            }
        });
    }
}

import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer, merge } from 'rxjs';
import { NotificationService } from '../../notification.service';
import { TokenService } from '../../../auth/token.service';
import { NotificationDto } from '../../notification.models';

@Component({
  selector: 'app-notifications-bell',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button (click)="goToNotifications()" class="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
      @if (unreadCount > 0) {
        <span class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      }
    </button>
  `
})
export class NotificationsBellComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private sub: Subscription | null = null;
  unreadCount = 0;

  ngOnInit() {
    if (!this.tokenService.isLoggedIn()) return;

    this.sub = merge(this.notificationService.refresh$, timer(0, 15000)).pipe(
      switchMap(() => this.notificationService.getMyNotifications())
    ).subscribe({
      next: (notifications: NotificationDto[]) => {
        this.unreadCount = notifications.filter(n => !n.isRead).length;
        this.cdr.markForCheck();
      },
      error: () => {
        // Silent fail on bell
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}

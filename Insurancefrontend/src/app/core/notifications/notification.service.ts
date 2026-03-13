import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpBaseService } from '../utils/http-base.service';
import { NotificationDto } from './notification.models';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private base = inject(HttpBaseService);

    private refreshSubject = new BehaviorSubject<void>(undefined);
    refresh$ = this.refreshSubject.asObservable();

    triggerRefresh() {
        this.refreshSubject.next();
    }

    getMyNotifications(): Observable<NotificationDto[]> {
        const url = this.base.buildUrl('/notifications/user-notifications');
        return this.http.get<NotificationDto[]>(url);
    }

    markAsRead(id: number): Observable<void> {
        const url = this.base.buildUrl(`/notifications/${id}/read`);
        return this.http.put<void>(url, {}).pipe(
            tap(() => this.triggerRefresh())
        );
    }

    markAllAsRead(): Observable<void> {
        const url = this.base.buildUrl('/notifications/mark-all-read');
        return this.http.put<void>(url, {}).pipe(
            tap(() => this.triggerRefresh())
        );
    }
}

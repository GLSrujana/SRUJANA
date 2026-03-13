import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((err: any) => {
            let errorMsg = 'An unknown error occurred';

            if (err instanceof HttpErrorResponse) {
                // Handle standard backend error shape: { error: "message", status: 400 }
                if (err.error && typeof err.error === 'object' && err.error.error) {
                    errorMsg = err.error.error;
                } else if (err.message) {
                    errorMsg = err.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            // Show toast via ToastService
            toastService.error(errorMsg);

            // Re-throw the error
            return throwError(() => err);
        })
    );
};

import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { ToastService } from './shared/services/toast.service';
import { SuccessOverlayComponent } from './shared/ui/success-overlay/success-overlay.component';
import { FloatingSupportComponent } from './shared/ui/floating-support/floating-support.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, SuccessOverlayComponent, FloatingSupportComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('event-insurance-frontend');
  private toastService = inject(ToastService);

  constructor() {
    // Temporarily testing the ToastService
    setTimeout(() => {
      this.toastService.success('Hello from EventSure!');
    }, 1000);
  }
}

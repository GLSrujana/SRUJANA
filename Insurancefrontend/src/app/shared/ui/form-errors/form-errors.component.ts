import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-errors',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (control && control.invalid && (control.dirty || control.touched)) {
      <div class="mt-1.5 text-sm text-red-500 flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <div class="flex flex-col">
          @if (control.errors?.['required']) { <span>{{ fieldName }} is required.</span> }
          @if (control.errors?.['email']) { <span>Please enter a valid email address.</span> }
          @if (control.errors?.['minlength']) { <span>{{ fieldName }} must be at least {{ control.errors?.['minlength'].requiredLength }} characters.</span> }
          <!-- Add more generic handlers here as needed -->
        </div>
      </div>
    }
  `
})
export class FormErrorsComponent {
    @Input() control!: AbstractControl | null;
    @Input() fieldName: string = 'Field';
}

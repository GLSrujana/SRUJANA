import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface PolicyProductDto {
  id: number;
  productName: string;
  description: string;
  eventTypeSupported: string;
  baseRate: number;
  minCoverageAmount: number;
  maxCoverageAmount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-policy-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in-up">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Policy Products</h1>
          <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium">Manage the catalog of insurance policy products.</p>
        </div>
        <button (click)="showCreateForm = !showCreateForm" class="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
          {{ showCreateForm ? 'Cancel' : '+ New Product' }}
        </button>
      </div>

      <!-- Create Form -->
      @if (showCreateForm) {
        <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden mb-8">
          <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50"><h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Create Policy Product</h3></div>
          <div class="p-6">
            <form (ngSubmit)="createProduct()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Product Name</label>
                <input type="text" [(ngModel)]="newProduct.productName" name="productName" required
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
              </div>
              <div class="relative">
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Event Type Supported</label>
                <select [(ngModel)]="newProduct.eventTypeSupported" name="eventType" required class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm appearance-none">
                    <option value="" disabled selected>Select an event type</option>
                    <option value="Concert">Concert</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Festival">Festival</option>
                    <option value="Conference">Conference</option>
                    <option value="Sports Event">Sports Event</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Charity Event">Charity Event</option>
                    <option value="Trade Show">Trade Show</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-neutral-500 dark:text-neutral-400">
                    <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Base Rate <span class="text-neutral-400 font-normal">(e.g. 0.03 = 3%)</span></label>
                <input type="number" step="0.001" min="0.001" max="1" [(ngModel)]="newProduct.baseRate" name="baseRate" required placeholder="0.03"
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
                <p class="text-[10px] text-neutral-400 mt-1 font-medium">Decimal fraction — 0.02 = 2%, 0.05 = 5%, 0.10 = 10%</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Description</label>
                <input type="text" [(ngModel)]="newProduct.description" name="description"
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Min Coverage</label>
                <input type="number" [(ngModel)]="newProduct.minCoverageAmount" name="minCoverage" required
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">Max Coverage</label>
                <input type="number" [(ngModel)]="newProduct.maxCoverageAmount" name="maxCoverage" required
                  class="block w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm">
              </div>
              <div class="md:col-span-2">
                <button type="submit" [disabled]="isCreating()" class="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                  @if (isCreating()) { Creating... } @else { Create Product }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Products Table -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">Product Catalog</h3>
          <div class="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">{{ products().length }} Products</div>
        </div>
        <div class="overflow-x-auto min-h-[200px]">
          @if (isLoading()) {
            <div class="p-6"><div class="animate-pulse h-32 bg-neutral-100 dark:bg-neutral-800 rounded"></div></div>
          } @else if (products().length === 0) {
            <div class="p-12 text-center text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">No policy products created yet. Click "+ New Product" to start.</div>
          } @else {
            <table class="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr class="bg-white dark:bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4">Name</th>
                  <th class="px-6 py-4">Event Type</th>
                  <th class="px-6 py-4">Rate</th>
                  <th class="px-6 py-4">Coverage Range</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-sm">
                @for (p of products(); track p.id) {
                  <tr class="hover:bg-neutral-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-200">{{ p.id }}</td>
                    <td class="px-6 py-4 font-bold text-neutral-900 dark:text-white">{{ p.productName }}</td>
                    <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300">{{ p.eventTypeSupported }}</td>
                    <td class="px-6 py-4 font-bold text-blue-600">{{ (p.baseRate * 100).toFixed(1) }}%</td>
                    <td class="px-6 py-4 text-neutral-600 dark:text-neutral-300">{{ p.minCoverageAmount | currency:'USD':'symbol':'1.0-0' }} — {{ p.maxCoverageAmount | currency:'USD':'symbol':'1.0-0' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold" [ngClass]="p.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">{{ p.isActive ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="startEdit(p)" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm">
                          Edit
                        </button>
                        <button (click)="toggleActive(p)" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          [ngClass]="p.isActive ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100' : 'text-green-700 bg-green-50 border border-green-200 hover:bg-green-100'">
                          {{ p.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Inline Edit Row -->
                  @if (editingProductId === p.id) {
                    <tr class="bg-blue-50/30 border-b border-blue-100">
                      <td colspan="7" class="px-6 py-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label class="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1 block">Product Name</label>
                            <input type="text" [(ngModel)]="editProduct.productName" name="editName" class="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                          </div>
                          <div>
                            <label class="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1 block">Base Rate <span class="text-neutral-400">(0.03 = 3%)</span></label>
                            <input type="number" step="0.001" min="0.001" max="1" [(ngModel)]="editProduct.baseRate" name="editRate" class="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                          </div>
                          <div>
                            <label class="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1 block">Min Coverage</label>
                            <input type="number" [(ngModel)]="editProduct.minCoverageAmount" name="editMin" class="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                          </div>
                          <div>
                            <label class="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1 block">Max Coverage</label>
                            <input type="number" [(ngModel)]="editProduct.maxCoverageAmount" name="editMax" class="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                          </div>
                        </div>
                        <div class="flex items-center gap-3 mt-3">
                          <button (click)="saveEdit()" class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                            Save Changes
                          </button>
                          <button (click)="editingProductId = null" class="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors">
                            Cancel
                          </button>
                          <span class="text-xs text-neutral-400 ml-2">Current: {{ (editProduct.baseRate * 100).toFixed(1) }}% of coverage</span>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminPolicyProductsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiBase = environment.apiBaseUrl;

  products = signal<PolicyProductDto[]>([]);
  isLoading = signal(true);
  isCreating = signal(false);
  showCreateForm = false;

  newProduct = { productName: '', eventTypeSupported: '', baseRate: 0, description: '', minCoverageAmount: 0, maxCoverageAmount: 0 };

  editingProductId: number | null = null;
  editProduct: any = {};

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.isLoading.set(true);
    this.http.get<PolicyProductDto[]>(`${this.apiBase}/admin/policy-products`).subscribe({
      next: data => { this.products.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  createProduct() {
    this.isCreating.set(true);
    this.http.post(`${this.apiBase}/admin/policy-products`, this.newProduct).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showCreateForm = false;
        this.newProduct = { productName: '', eventTypeSupported: '', baseRate: 0, description: '', minCoverageAmount: 0, maxCoverageAmount: 0 };
        this.loadProducts();
      },
      error: (err) => { this.isCreating.set(false); alert(err.error?.error || 'Failed.'); }
    });
  }

  startEdit(p: PolicyProductDto) {
    this.editingProductId = p.id;
    this.editProduct = {
      productName: p.productName,
      eventTypeSupported: p.eventTypeSupported,
      baseRate: p.baseRate,
      minCoverageAmount: p.minCoverageAmount,
      maxCoverageAmount: p.maxCoverageAmount,
      description: p.description,
      isActive: p.isActive
    };
  }

  saveEdit() {
    if (!this.editingProductId) return;
    this.http.put(`${this.apiBase}/admin/policy-products/${this.editingProductId}`, this.editProduct).subscribe({
      next: () => {
        this.editingProductId = null;
        this.loadProducts();
      },
      error: (err) => alert(err.error?.error || 'Failed to update.')
    });
  }

  toggleActive(p: PolicyProductDto) {
    this.http.patch(`${this.apiBase}/admin/policy-products/${p.id}/active?isActive=${!p.isActive}`, {}).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert(err.error?.error || 'Failed.')
    });
  }
}

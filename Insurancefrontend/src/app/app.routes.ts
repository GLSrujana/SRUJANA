import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Auth Components
import { LoginComponent } from './features/public/login/login.component';
import { RegisterComponent } from './features/public/register/register.component';
import { LandingComponent } from './features/public/landing/landing.component';
import { AboutComponent } from './features/public/about/about.component';
import { FreeQuoteComponent } from './features/public/free-quote/free-quote.component';
import { FaqComponent } from './features/public/faq/faq.component';

// Layout App Shell
import { AppShellComponent } from './core/layout/app-shell/app-shell.component';

// Customer
import { CustomerDashboardComponent } from './features/customer/dashboard/customer-dashboard.component';
import { CreateRequestComponent } from './features/customer/create-request/create-request.component';
import { MyRequestsComponent } from './features/customer/requests/my-requests.component';
import { SuggestionsComponent } from './features/customer/suggestions/suggestions.component';
import { MyApplicationsComponent } from './features/customer/applications/my-applications.component';
import { CustomerActivePoliciesComponent } from './features/customer/active-policies/customer-active-policies.component';
import { CustomerClaimsComponent } from './features/customer/claims/customer-claims.component';
import { CustomerCertificatesComponent } from './features/customer/certificates/customer-certificates.component';

// Agent
import { AgentDashboardComponent } from './features/agent/dashboard/agent-dashboard.component';
import { AssignedRequestsComponent } from './features/agent/assigned-requests/assigned-requests.component';
import { AgentRequestReviewComponent } from './features/agent/assigned-requests/agent-request-review.component';
import { AgentCommissionsComponent } from './features/agent/commissions/agent-commissions.component';

// Admin
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { UnassignedRequestsComponent } from './features/admin/unassigned-requests/unassigned-requests.component';
import { AdminPolicyProductsComponent } from './features/admin/policy-products/admin-policy-products.component';
import { AdminPolicyApplicationsComponent } from './features/admin/policy-applications/admin-policy-applications.component';
import { AdminCommissionsComponent } from './features/admin/commissions/admin-commissions.component';

// Claims Officer
import { ClaimsOfficerDashboardComponent } from './features/claims-officer/dashboard/claims-officer-dashboard.component';
import { ClaimsOfficerPendingComponent } from './features/claims-officer/claims-pending/claims-officer-pending.component';

export const routes: Routes = [
    // Public Routes
    { path: '', component: LandingComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'get-quote', component: FreeQuoteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Protected App Shell Routes
    {
        path: '',
        component: AppShellComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                pathMatch: 'full',
                redirectTo: 'customer/dashboard' // Fallback (but real dashboards depend on role)
            },
            // ───── Customer Routes ─────
            {
                path: 'customer/dashboard',
                component: CustomerDashboardComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/create-request',
                component: CreateRequestComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/requests',
                component: MyRequestsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/requests/:id/suggestions',
                component: SuggestionsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/applications',
                component: MyApplicationsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/active-policies',
                component: CustomerActivePoliciesComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/certificates',
                component: CustomerCertificatesComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            {
                path: 'customer/claims',
                component: CustomerClaimsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Customer'] }
            },
            // ───── Agent Routes ─────
            {
                path: 'agent/dashboard',
                component: AgentDashboardComponent,
                canMatch: [roleGuard],
                data: { roles: ['Agent'] }
            },
            {
                path: 'agent/assigned-requests',
                component: AssignedRequestsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Agent'] }
            },
            {
                path: 'agent/requests/:id/review',
                component: AgentRequestReviewComponent,
                canMatch: [roleGuard],
                data: { roles: ['Agent'] }
            },
            {
                path: 'agent/commissions',
                component: AgentCommissionsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Agent'] }
            },
            // ───── Admin Routes ─────
            {
                path: 'admin/dashboard',
                component: AdminDashboardComponent,
                canMatch: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/unassigned-requests',
                component: UnassignedRequestsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/policy-products',
                component: AdminPolicyProductsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/policy-applications',
                component: AdminPolicyApplicationsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/commissions',
                component: AdminCommissionsComponent,
                canMatch: [roleGuard],
                data: { roles: ['Admin'] }
            },
            // ───── Claims Officer Routes ─────
            {
                path: 'claimsofficer/dashboard',
                component: ClaimsOfficerDashboardComponent,
                canMatch: [roleGuard],
                data: { roles: ['ClaimsOfficer'] }
            },
            {
                path: 'claimsofficer/claims-pending',
                component: ClaimsOfficerPendingComponent,
                canMatch: [roleGuard],
                data: { roles: ['ClaimsOfficer'] }
            },
            // ───── Shared Routes ─────
            {
                path: 'profile',
                loadComponent: () => import('./features/customer/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/notifications/notifications-page.component').then(m => m.NotificationsPageComponent)
            }
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'login' }
];

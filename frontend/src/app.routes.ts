import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { BusinessPage } from './app/pages/business/business-page';
import { authGuard } from './app/core/guards/auth.guard';
import { roleGuard } from './app/core/guards/role.guard';
import { Contact } from './app/pages/contact/contact';
import { PublicOffers } from './app/pages/landing/public-offers';
import { RhOffers } from './app/pages/rh/offers/rh-offers';
import { RhProfile } from './app/pages/rh/profile/rh-profile';
import { CandidateOffers } from './app/pages/candidat/offers/candidate-offers';
import { CandidateApplications } from './app/pages/candidat/applications/candidate-applications';
import { RhApplications } from './app/pages/rh/applications/rh-applications';
import { CandidateProfile } from './app/pages/candidat/profile/candidate-profile';
import { RhDashboard } from './app/pages/rh/dashboard/rh-dashboard';
import { CandidateDashboard } from './app/pages/candidat/dashboard/candidate-dashboard';

export const appRoutes: Routes = [
    { path: '', component: Landing, pathMatch: 'full' },
    { path: 'landing', redirectTo: '', pathMatch: 'full' },
    { path: 'offres', component: PublicOffers },
    { path: 'contact', component: Contact },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: RhDashboard, canActivate: [roleGuard], data: { roles: ['RH'] } },
            { path: 'rh/offres', component: RhOffers, canActivate: [roleGuard], data: { roles: ['RH'] } },
            { path: 'rh/demandes', component: RhApplications, canActivate: [roleGuard], data: { roles: ['RH'] } },
            { path: 'rh/profile', component: RhProfile, canActivate: [roleGuard], data: { roles: ['RH'] } },
            { path: 'candidat/dashboard', component: CandidateDashboard, canActivate: [roleGuard], data: { roles: ['CANDIDAT'] } },
            { path: 'candidat/offres', component: CandidateOffers, canActivate: [roleGuard], data: { roles: ['CANDIDAT'] } },
            { path: 'candidat/mes-demandes', component: CandidateApplications, canActivate: [roleGuard], data: { roles: ['CANDIDAT'] } },
            { path: 'candidat/profile', component: CandidateProfile, canActivate: [roleGuard], data: { roles: ['CANDIDAT'] } },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

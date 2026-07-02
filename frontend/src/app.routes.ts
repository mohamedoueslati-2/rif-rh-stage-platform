import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { BusinessPage } from './app/pages/business/business-page';
import { authGuard } from './app/core/guards/auth.guard';
import { roleGuard } from './app/core/guards/role.guard';
import { Contact } from './app/pages/contact/contact';

export const appRoutes: Routes = [
    { path: '', component: Landing, pathMatch: 'full' },
    { path: 'landing', redirectTo: '', pathMatch: 'full' },
    { path: 'offres', component: BusinessPage, data: { title: 'Offres de stage' } },
    { path: 'contact', component: Contact },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [roleGuard], data: { roles: ['RH'] } },
            { path: 'rh/offres', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['RH'], title: 'Gestion des offres de stage' } },
            { path: 'rh/demandes', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['RH'], title: 'Gestion des demandes' } },
            { path: 'rh/profile', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['RH'], title: 'Profil RH' } },
            { path: 'candidat/dashboard', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['CANDIDAT'], title: 'Dashboard candidat' } },
            { path: 'candidat/offres', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['CANDIDAT'], title: 'Offres de stage - consulter et postuler' } },
            { path: 'candidat/mes-demandes', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['CANDIDAT'], title: 'Mes demandes' } },
            { path: 'candidat/profile', component: BusinessPage, canActivate: [roleGuard], data: { roles: ['CANDIDAT'], title: 'Profil candidat' } },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

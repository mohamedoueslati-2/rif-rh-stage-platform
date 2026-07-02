import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@/app/pages/auth/services/auth.service';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul>`
})
export class AppMenu {
    private readonly authService = inject(AuthService);
    model: MenuItem[] = [];

    ngOnInit(): void {
        if (this.authService.getRole() === 'CANDIDAT') {
            this.model = [
                {
                    label: 'Navigation',
                    items: [
                        { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/candidat/dashboard'] },
                        { label: 'Offres de stage', icon: 'pi pi-fw pi-briefcase', routerLink: ['/candidat/offres'] },
                        { label: 'Mes demandes', icon: 'pi pi-fw pi-inbox', routerLink: ['/candidat/mes-demandes'] }
                    ]
                },
                {
                    label: 'Compte',
                    items: [
                        { label: 'Mon profil', icon: 'pi pi-fw pi-user', routerLink: ['/candidat/profile'] },
                        { label: 'Déconnexion', icon: 'pi pi-fw pi-sign-out', command: () => this.authService.logout() }
                    ]
                }
            ];
            return;
        }

        this.model = [
            {
                label: 'Navigation',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    { label: 'Offres de stage', icon: 'pi pi-fw pi-briefcase', routerLink: ['/rh/offres'] },
                    { label: 'Demandes', icon: 'pi pi-fw pi-inbox', routerLink: ['/rh/demandes'] }
                ]
            },
            {
                label: 'Compte',
                items: [
                    { label: 'Mon profil RH', icon: 'pi pi-fw pi-user', routerLink: ['/rh/profile'] },
                    { label: 'Déconnexion', icon: 'pi pi-fw pi-sign-out', command: () => this.authService.logout() }
                ]
            }
        ];
    }
}

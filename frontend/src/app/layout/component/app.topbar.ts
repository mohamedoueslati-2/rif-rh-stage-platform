import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '../../pages/auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>

                <a class="layout-topbar-logo rif-brand-logo" routerLink="/">
                    <img
                        [src]="layoutService.isDarkTheme() ? '/images/rif_logo_dark_topbar.png' : '/images/rif_logo_light_topbar.png'"
                        alt="RIF Logo"
                        class="rif-logo-img"
                    />
                </a>
            </div>

            <div class="layout-topbar-actions">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>

                <button
                    class="layout-topbar-menu-button layout-topbar-action"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                >
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action" [routerLink]="profileRoute" aria-label="Ouvrir mon profil">
                            <i class="pi pi-user"></i>
                            <span>Mon profil</span>
                        </button>
                    </div>
                </div>
            </div>

            <app-configurator />
        </div>
    `,
    styles: [
        `
            .layout-topbar-logo.rif-brand-logo {
                width: auto !important;
                min-width: 0 !important;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 0;
                margin: 0;
                text-decoration: none;
                border-radius: 8px;
                overflow: hidden;
            }

            .rif-logo-img {
                height: 34px;
                width: auto;
                max-width: 210px;
                object-fit: contain;
                display: block;
                border-radius: 6px;
            }

            @media (max-width: 768px) {
                .rif-logo-img {
                    height: 30px;
                    max-width: 170px;
                }
            }

            @media (max-width: 420px) {
                .rif-logo-img {
                    height: 28px;
                    max-width: 145px;
                }
            }
        `
    ]
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    private readonly authService = inject(AuthService);

    get profileRoute(): string {
        return this.authService.getRole() === 'RH' ? '/rh/profile' : '/candidat/profile';
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}

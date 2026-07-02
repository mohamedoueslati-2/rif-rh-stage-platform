import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { LayoutService } from '@/app/layout/service/layout.service';
import { AppConfigurator } from '../../layout/component/app.configurator';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule, AppConfigurator],
    template: `
        <app-configurator />

        <div class="auth-page">
            <header class="auth-header">
                <a routerLink="/" class="auth-logo">
                    <img
                        [src]="layoutService.isDarkTheme() ? '/images/rif_logo_dark_topbar.png' : '/images/rif_logo_light_topbar.png'"
                        alt="RIF Logo"
                    />
                </a>

                <nav class="auth-nav">
                    <a routerLink="/">Accueil</a>
                    <a routerLink="/offres">Offres</a>
                    <a routerLink="/contact">Contact</a>
                </nav>

                <div class="auth-actions">
                    <button
                        type="button"
                        class="theme-toggle"
                        (click)="toggleDarkMode()"
                        [attr.aria-label]="layoutService.isDarkTheme() ? 'Activer le mode clair' : 'Activer le mode sombre'"
                        [title]="layoutService.isDarkTheme() ? 'Mode clair' : 'Mode sombre'"
                    >
                        <i class="pi" [ngClass]="layoutService.isDarkTheme() ? 'pi-sun' : 'pi-moon'"></i>
                    </button>
                    <p-button class="auth-account-action" label="Connexion" routerLink="/auth/login" [outlined]="true" />
                    <p-button class="auth-account-action" label="Créer compte" routerLink="/auth/register" />
                </div>
            </header>

            <main class="auth-main">
                <section class="auth-info-card">
                    <div class="info-badge">
                        <i class="pi pi-home"></i>
                        <span>RIF Stages</span>
                    </div>

                    <h1>Bienvenue sur RIF Stages</h1>
                    <p>
                        Plateforme RH pour gérer les candidatures de stage :
                        offres, demandes, notifications et emails manuels.
                    </p>

                    <div class="role-box">
                        <div class="role-title">
                            <i class="pi pi-shield"></i>
                            <span>Parcours sécurisé</span>
                        </div>

                        <div class="role-item candidate">
                            <div class="role-icon">
                                <i class="pi pi-user"></i>
                            </div>
                            <div>
                                <strong>Candidat</strong>
                                <span>Postuler et suivre vos demandes</span>
                            </div>
                        </div>

                        <div class="role-item rh">
                            <div class="role-icon">
                                <i class="pi pi-users"></i>
                            </div>
                            <div>
                                <strong>RH</strong>
                                <span>Gérer offres et décisions</span>
                            </div>
                        </div>

                        <small>Connexion par rôle, formulaires clairs, validation des champs et accès protégés.</small>
                    </div>
                </section>

                <section class="auth-form-card">
                    <div class="form-header">
                        <h2>Connexion</h2>
                        <p>Connectez-vous pour accéder à votre espace.</p>
                    </div>

                    <div class="field">
                        <label for="email">Email *</label>
                        <input pInputText id="email" type="email" placeholder="exemple@email.com" [(ngModel)]="email" />
                    </div>

                    <div class="field">
                        <label for="password">Mot de passe *</label>
                        <p-password
                            id="password"
                            [(ngModel)]="password"
                            placeholder="Votre mot de passe"
                            [toggleMask]="true"
                            [feedback]="false"
                            [fluid]="true"
                        />
                    </div>

                    <div class="form-options">
                        <div class="remember">
                            <p-checkbox [(ngModel)]="checked" inputId="remember" binary />
                            <label for="remember">Se souvenir de moi</label>
                        </div>

                        <a class="text-primary font-medium cursor-pointer">Mot de passe oublié ?</a>
                    </div>

                    @if (errorMessage) {
                        <p class="auth-error" role="alert">{{ errorMessage }}</p>
                    }

                    <p-button label="Se connecter" styleClass="w-full auth-submit" (onClick)="login()" [loading]="loading" [disabled]="!email || !password" />

                    <div class="switch-auth">
                        <span>Vous n’avez pas de compte ?</span>
                        <a routerLink="/auth/register">Créer un compte</a>
                    </div>

                </section>
            </main>
        </div>
    `,
    styles: [
        `
            .auth-page {
                --primary-color: #6366f1;
                --primary-contrast-color: #ffffff;

                min-height: 100vh;
                background:
                    radial-gradient(circle at top left, color-mix(in srgb, var(--primary-color), transparent 88%), transparent 36rem),
                    var(--surface-ground);
                color: var(--text-color);
            }

            .auth-header {
                height: 76px;
                padding: 0 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--surface-card);
                border-bottom: 1px solid var(--surface-border);
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .auth-logo img {
                height: 44px;
                width: auto;
                display: block;
                border-radius: 6px;
            }

            .auth-nav {
                display: flex;
                align-items: center;
                gap: 3.5rem;
            }

            .auth-nav a {
                color: var(--text-color-secondary);
                text-decoration: none;
                font-weight: 600;
            }

            .auth-nav a:hover {
                color: var(--primary-color);
            }

            .auth-actions {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .auth-main {
                width: min(1220px, calc(100% - 2rem));
                margin: 5.5rem auto;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5rem;
                align-items: stretch;
            }

            .auth-info-card,
            .auth-form-card {
                border-radius: 28px;
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
            }

            .auth-info-card {
                padding: 3rem 3.5rem;
                background: color-mix(in srgb, var(--primary-color), var(--surface-card) 94%);
            }

            .info-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--primary-color);
                font-weight: 700;
                margin-bottom: 1.5rem;
            }

            .info-badge i {
                width: 38px;
                height: 38px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: var(--primary-color);
                color: var(--primary-contrast-color);
            }

            .auth-info-card h1 {
                font-size: 2rem;
                margin: 0 0 1rem;
                font-weight: 800;
            }

            .auth-info-card p {
                color: var(--text-color-secondary);
                line-height: 1.8;
                margin-bottom: 1.5rem;
            }

            .role-box {
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                border-radius: 18px;
                padding: 1.25rem;
            }

            .role-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 800;
                margin-bottom: 1rem;
            }

            .role-title i {
                color: var(--primary-color);
            }

            .role-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.8rem;
                border-radius: 12px;
                margin-bottom: 0.75rem;
            }

            .role-item.candidate,
            .role-item.rh {
                background: color-mix(in srgb, var(--primary-color), transparent 90%);
            }

            .role-icon,
            .role-item.rh .role-icon {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                background: var(--primary-color);
            }

            .role-item strong,
            .role-item span {
                display: block;
            }

            .role-item span,
            .role-box small {
                color: var(--text-color-secondary);
            }

            .auth-form-card {
                padding: 3.5rem;
            }

            .form-header h2 {
                font-size: 2.2rem;
                font-weight: 800;
                margin: 0 0 0.5rem;
            }

            .form-header p {
                color: var(--text-color-secondary);
                margin: 0 0 2rem;
            }

            .field {
                margin-bottom: 1.35rem;
            }

            .field label {
                display: block;
                font-weight: 600;
                margin-bottom: 0.6rem;
                color: var(--text-color-secondary);
            }

            .field input {
                width: 100%;
                height: 52px;
            }

            .form-options {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin: 1.25rem 0 2rem;
            }

            .remember {
                display: flex;
                align-items: center;
                gap: 0.6rem;
                color: var(--text-color-secondary);
            }

            .auth-submit {
                height: 52px;
                font-weight: 700;
            }

            .theme-toggle {
                width: 42px;
                height: 42px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--surface-border);
                border-radius: 50%;
                background: var(--surface-card);
                color: var(--text-color);
                cursor: pointer;
                transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            }

            .theme-toggle:hover {
                color: var(--primary-color);
                border-color: var(--primary-color);
                background: var(--surface-hover);
            }

            .auth-error {
                color: var(--p-red-500);
                margin: -0.75rem 0 1rem;
            }

            .switch-auth {
                margin-top: 1.5rem;
                text-align: center;
                color: var(--text-color-secondary);
            }

            .switch-auth a {
                margin-left: 0.4rem;
                color: var(--primary-color);
                font-weight: 700;
                text-decoration: none;
            }

            .hint {
                margin-top: 2.25rem;
                color: var(--text-color-secondary);
                font-size: 0.95rem;
                line-height: 1.6;
            }

            @media (max-width: 992px) {
                .auth-main {
                    grid-template-columns: 1fr;
                    margin: 2rem auto;
                    gap: 2rem;
                }

                .auth-nav {
                    display: none;
                }
            }

            @media (max-width: 640px) {
                .auth-header {
                    padding: 0 1rem;
                }

                .auth-account-action {
                    display: none;
                }

                .auth-info-card,
                .auth-form-card {
                    padding: 1.5rem;
                    border-radius: 22px;
                }
            }
        `
    ]
})
export class Login {
    layoutService = inject(LayoutService);
    private readonly authService = inject(AuthService);

    email = '';
    password = '';
    checked = false;
    loading = false;
    errorMessage = '';

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    login(): void {
        if (!this.email || !this.password || this.loading) return;

        this.loading = true;
        this.errorMessage = '';
        this.authService.login({ email: this.email.trim(), motDePasse: this.password }).subscribe({
            next: () => void this.authService.redirectByRole(),
            error: (error) => {
                this.errorMessage = error.status === 0 || error.status >= 500
                    ? 'Le serveur est indisponible. Vérifiez que le backend est démarré.'
                    : 'Email ou mot de passe incorrect.';
                this.loading = false;
            }
        });
    }
}

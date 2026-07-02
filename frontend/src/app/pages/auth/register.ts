import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { LayoutService } from '@/app/layout/service/layout.service';
import { AppConfigurator } from '../../layout/component/app.configurator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, RippleModule, AppConfigurator],
    template: `
        <app-configurator />

        <div class="auth-page">
            <header class="auth-header">
                <a routerLink="/auth/login" class="auth-logo">
                    <img
                        [src]="layoutService.isDarkTheme() ? '/images/rif_logo_dark_topbar.png' : '/images/rif_logo_light_topbar.png'"
                        alt="RIF Logo"
                    />
                </a>

                <nav class="auth-nav">
                    <a routerLink="/auth/login">Accueil</a>
                    <a routerLink="/offres">Offres</a>
                    <a routerLink="/contact">Contact</a>
                </nav>

                <div class="auth-actions">
                    <p-button label="Connexion" routerLink="/auth/login" [outlined]="true" />
                    <p-button label="Créer compte" routerLink="/auth/register" />
                </div>
            </header>

            <main class="auth-main register-main">
                <section class="auth-info-card">
                    <div class="info-badge">
                        <i class="pi pi-home"></i>
                        <span>RIF Stages</span>
                    </div>

                    <h1>Bienvenue sur RIF Stages</h1>
                    <p>
                        Créez votre compte candidat pour consulter les offres,
                        déposer votre demande de stage et suivre l’évolution de votre candidature.
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
                                <span>Compte personnel et suivi des demandes</span>
                            </div>
                        </div>

                        <div class="role-item rh">
                            <div class="role-icon">
                                <i class="pi pi-users"></i>
                            </div>
                            <div>
                                <strong>RH</strong>
                                <span>Validation, entretien et décision finale</span>
                            </div>
                        </div>

                        <small>Après inscription, le candidat peut compléter son profil et suivre ses demandes.</small>
                    </div>
                </section>

                <section class="auth-form-card register-card">
                    <div class="form-header">
                        <h2>Inscription</h2>
                        <p>Créez votre compte candidat.</p>
                    </div>

                    <div class="form-grid">
                        <div class="field">
                            <label for="nom">Nom *</label>
                            <input pInputText id="nom" type="text" placeholder="Oueslati" [(ngModel)]="nom" />
                        </div>

                        <div class="field">
                            <label for="prenom">Prénom *</label>
                            <input pInputText id="prenom" type="text" placeholder="Mohamed" [(ngModel)]="prenom" />
                        </div>

                        <div class="field full">
                            <label for="email">Email *</label>
                            <input pInputText id="email" type="email" placeholder="candidat@email.com" [(ngModel)]="email" />
                        </div>

                        <div class="field">
                            <label for="telephone">Téléphone</label>
                            <input pInputText id="telephone" type="text" placeholder="+216 22 000 000" [(ngModel)]="telephone" />
                        </div>

                        <div class="field">
                            <label for="specialite">Spécialité</label>
                            <input pInputText id="specialite" type="text" placeholder="Génie logiciel" [(ngModel)]="specialite" />
                        </div>

                        <div class="field">
                            <label for="niveauEtude">Niveau étude</label>
                            <input pInputText id="niveauEtude" type="text" placeholder="4ème année" [(ngModel)]="niveauEtude" />
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
                    </div>

                    <div class="register-actions">
                        <p-button label="Créer mon compte" styleClass="w-full auth-submit" routerLink="/auth/login" />
                        <p-button label="Déjà un compte ? Connexion" styleClass="w-full auth-submit" routerLink="/auth/login" [outlined]="true" />
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
                width: min(1320px, calc(100% - 2rem));
                margin: 5.5rem auto;
                display: grid;
                grid-template-columns: 0.9fr 1.1fr;
                gap: 3rem;
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
                padding: 3rem;
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

            .form-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1.25rem 1.5rem;
            }

            .field.full {
                grid-column: 1 / -1;
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

            .register-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.25rem;
                margin-top: 2rem;
            }

            .auth-submit {
                height: 52px;
                font-weight: 700;
            }

            .hint {
                margin-top: 1.5rem;
                color: var(--text-color-secondary);
                font-size: 0.95rem;
                line-height: 1.6;
            }

            .hint.warning {
                color: #f97316;
                font-weight: 600;
            }

            @media (max-width: 992px) {
                .auth-main {
                    grid-template-columns: 1fr;
                    margin: 2rem auto;
                }

                .auth-nav {
                    display: none;
                }
            }

            @media (max-width: 640px) {
                .auth-header {
                    padding: 0 1rem;
                }

                .auth-actions {
                    display: none;
                }

                .auth-info-card,
                .auth-form-card {
                    padding: 1.5rem;
                    border-radius: 22px;
                }

                .form-grid,
                .register-actions {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class Register {
    layoutService = inject(LayoutService);

    nom = '';
    prenom = '';
    email = '';
    telephone = '';
    specialite = '';
    niveauEtude = '';
    password = '';
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [ButtonModule, RippleModule, RouterModule],
    template: `
        <div class="auth-status-page">
            <div class="status-card error">
                <div class="status-icon">
                    <i class="pi pi-exclamation-circle"></i>
                </div>

                <h1>Page indisponible</h1>
                <p>La ressource demandée est introuvable ou une erreur est survenue.</p>

                <div class="status-actions">
                    <p-button label="Retour accueil" routerLink="/" severity="danger" />
                    <p-button label="Connexion" routerLink="/auth/login" severity="danger" [outlined]="true" />
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .auth-status-page {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                background: var(--surface-ground);
            }

            .status-card {
                width: min(520px, 100%);
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                border-radius: 28px;
                padding: 3rem;
                text-align: center;
                box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
            }

            .status-icon {
                width: 72px;
                height: 72px;
                margin: 0 auto 1.5rem;
                border-radius: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: color-mix(in srgb, #ef4444, transparent 85%);
                color: #ef4444;
                font-size: 2rem;
            }

            h1 {
                margin: 0 0 0.75rem;
                font-size: 2.2rem;
                font-weight: 800;
                color: var(--text-color);
            }

            p {
                color: var(--text-color-secondary);
                line-height: 1.7;
                margin-bottom: 2rem;
            }

            .status-actions {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
        `
    ]
})
export class Error {}

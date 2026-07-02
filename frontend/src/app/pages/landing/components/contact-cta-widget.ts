import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'contact-cta-widget',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <section class="cta-wrap px-6 lg:px-20">
            <div class="cta-card">
                <div class="cta-copy">
                    <span class="eyebrow">Besoin d’aide ?</span>
                    <h2>Une question sur votre candidature ?</h2>
                    <p>Retrouvez les réponses essentielles et les bons points de contact selon votre situation.</p>
                </div>
                <a pButton routerLink="/contact" label="Contacter l’équipe RIF" icon="pi pi-arrow-right" iconPos="right" severity="contrast" class="shrink-0"></a>
            </div>
        </section>
    `,
    styles: `
        .cta-wrap { max-width: 1440px; margin: auto; padding-bottom: 7rem; }
        .cta-card { position: relative; padding: clamp(2rem, 5vw, 4.5rem); display: flex; align-items: center; justify-content: space-between; gap: 3rem; overflow: hidden; border-radius: 32px; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color), #082f25 58%)); color: white; box-shadow: 0 30px 70px color-mix(in srgb, var(--primary-color), transparent 72%); }
        .cta-card::after { content: ''; position: absolute; width: 260px; height: 260px; right: -70px; top: -100px; border: 1px solid rgba(255,255,255,.28); border-radius: 50%; box-shadow: 0 0 0 45px rgba(255,255,255,.05), 0 0 0 90px rgba(255,255,255,.04); }
        .cta-copy { position: relative; z-index: 1; max-width: 720px; }
        .eyebrow { color: rgba(255,255,255,.75); font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h2 { margin: .7rem 0; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.08; letter-spacing: -.04em; }
        p { margin: 0; color: rgba(255,255,255,.78); font-size: 1.08rem; line-height: 1.7; }
        a { position: relative; z-index: 1; }
        @media (max-width: 760px) { .cta-card { align-items: flex-start; flex-direction: column; } }
    `
})
export class ContactCtaWidget {}

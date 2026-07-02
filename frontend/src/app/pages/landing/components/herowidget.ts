import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, RouterModule],
    template: `
        <section class="hero-section px-6 lg:px-20">
            <div class="hero-content">
                <span class="eyebrow">Stages & opportunités</span>
                <h1>Le stage qui lance <span>votre carrière.</span></h1>
                <p>Découvrez les offres de RIF, trouvez la mission qui vous ressemble et candidatez en quelques minutes.</p>
                <div class="flex flex-wrap gap-3">
                    <a pButton pRipple href="#offres" label="Voir les offres" icon="pi pi-arrow-down" iconPos="right" class="px-5! py-3!"></a>
                    <a pButton pRipple routerLink="/auth/register" label="Créer mon espace" severity="secondary" [outlined]="true" class="px-5! py-3!"></a>
                </div>
                <div class="hero-proof">
                    <span><i class="pi pi-check-circle"></i> Inscription gratuite</span>
                    <span><i class="pi pi-shield"></i> Espace sécurisé</span>
                </div>
            </div>

            <div class="hero-art" aria-hidden="true">
                <div class="orbit orbit-one"></div>
                <div class="orbit orbit-two"></div>
                <div class="opportunity-card">
                    <div class="opportunity-icon"><i class="pi pi-sparkles"></i></div>
                    <span>Votre prochaine</span>
                    <strong>opportunité</strong>
                    <div class="card-line"></div>
                    <small>RIF Stages</small>
                </div>
                <div class="floating-chip chip-one"><i class="pi pi-briefcase"></i> Offres ouvertes</div>
                <div class="floating-chip chip-two"><i class="pi pi-send"></i> Candidature simple</div>
            </div>
        </section>
    `,
    styles: `
        .hero-section { min-height: 620px; display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: 4rem; background: radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--primary-color), transparent 84%), transparent 28rem), linear-gradient(120deg, var(--surface-50), var(--surface-0)); border-radius: 0 0 3rem 3rem; }
        :host-context(.app-dark) .hero-section { background: radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--primary-color), transparent 78%), transparent 28rem), linear-gradient(120deg, var(--surface-950), var(--surface-900)); }
        .hero-content { max-width: 690px; }
        .eyebrow { color: var(--primary-color); font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h1 { margin: 1rem 0 1.5rem; color: var(--text-color); font-size: clamp(3.2rem, 6vw, 5.5rem); line-height: .98; letter-spacing: -.06em; font-weight: 800; }
        h1 span { color: var(--primary-color); display: block; }
        p { max-width: 620px; margin: 0 0 2rem; color: var(--text-color-secondary); font-size: 1.2rem; line-height: 1.7; }
        .hero-proof { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 2rem; color: var(--text-color-secondary); font-weight: 600; }
        .hero-proof i { color: var(--primary-color); margin-right: .4rem; }
        .hero-art { min-height: 430px; position: relative; display: grid; place-items: center; }
        .hero-art::before { content: ''; position: absolute; width: 290px; height: 355px; border-radius: 160px 160px 32px 32px; background: linear-gradient(150deg, var(--primary-color), color-mix(in srgb, var(--primary-color), #052e25 55%)); transform: rotate(8deg); box-shadow: 0 28px 70px color-mix(in srgb, var(--primary-color), transparent 70%); }
        .opportunity-card { width: 260px; min-height: 290px; z-index: 2; padding: 2.25rem; display: flex; flex-direction: column; justify-content: center; border-radius: 28px; background: color-mix(in srgb, var(--surface-0), transparent 5%); border: 1px solid color-mix(in srgb, var(--surface-border), transparent 20%); box-shadow: 0 22px 55px rgba(0,0,0,.16); transform: rotate(-5deg); color: var(--text-color); }
        .opportunity-icon { width: 54px; height: 54px; display: grid; place-items: center; margin-bottom: 1.5rem; border-radius: 16px; background: color-mix(in srgb, var(--primary-color), transparent 85%); color: var(--primary-color); font-size: 1.5rem; }
        .opportunity-card span { color: var(--text-color-secondary); font-size: 1.15rem; }
        .opportunity-card strong { margin-top: .3rem; font-size: 2rem; line-height: 1.05; }
        .card-line { height: 1px; margin: 1.5rem 0 1rem; background: var(--surface-border); }
        .opportunity-card small { color: var(--primary-color); font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .orbit { position: absolute; border: 1px solid color-mix(in srgb, var(--primary-color), transparent 55%); border-radius: 50%; }
        .orbit-one { width: 390px; height: 390px; }
        .orbit-two { width: 480px; height: 270px; transform: rotate(-22deg); }
        .floating-chip { position: absolute; z-index: 3; padding: .8rem 1rem; border-radius: 999px; background: var(--surface-card); color: var(--text-color); border: 1px solid var(--surface-border); box-shadow: 0 12px 35px rgba(0,0,0,.1); font-weight: 700; }
        .floating-chip i { color: var(--primary-color); margin-right: .45rem; }
        .chip-one { top: 4rem; right: 1rem; }
        .chip-two { bottom: 4rem; left: 0; }
        @media (max-width: 992px) { .hero-section { grid-template-columns: 1fr; padding-top: 5rem; gap: 1rem; } .hero-art { min-height: 380px; } }
        @media (max-width: 640px) { .hero-section { min-height: auto; padding-top: 4rem; padding-bottom: 4rem; border-radius: 0 0 2rem 2rem; } h1 { font-size: 3.25rem; } .hero-art { display: none; } }
    `
})
export class HeroWidget {}

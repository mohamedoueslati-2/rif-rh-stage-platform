import { Component } from '@angular/core';

@Component({
    selector: 'features-widget',
    standalone: true,
    template: `
        <section id="parcours" class="features-section px-6 lg:px-20">
            <div class="text-center max-w-3xl mx-auto mb-12">
                <span class="eyebrow">Un parcours simple</span>
                <h2>Votre candidature, sans complication</h2>
                <p>Un espace unique pour découvrir les stages, envoyer votre demande et suivre chaque étape.</p>
            </div>
            <div class="features-grid">
                @for (feature of features; track feature.title; let index = $index) {
                    <article class="feature-card">
                        <span class="step">0{{ index + 1 }}</span>
                        <div class="icon"><i [class]="feature.icon"></i></div>
                        <h3>{{ feature.title }}</h3>
                        <p>{{ feature.description }}</p>
                    </article>
                }
            </div>
        </section>
    `,
    styles: `
        .features-section { max-width: 1440px; margin: auto; padding-top: 6rem; padding-bottom: 7rem; }
        .eyebrow { color: var(--primary-color); font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h2 { margin: .7rem 0; color: var(--text-color); font-size: clamp(2.2rem, 4vw, 3.2rem); letter-spacing: -.04em; }
        .text-center > p { color: var(--text-color-secondary); font-size: 1.1rem; line-height: 1.7; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .feature-card { position: relative; min-height: 265px; padding: 2rem; border: 1px solid var(--surface-border); border-radius: 22px; background: var(--surface-card); overflow: hidden; }
        .step { position: absolute; top: 1.4rem; right: 1.5rem; color: color-mix(in srgb, var(--primary-color), transparent 70%); font-size: 2.2rem; font-weight: 800; }
        .icon { width: 56px; height: 56px; display: grid; place-items: center; margin-bottom: 1.6rem; border-radius: 16px; color: var(--primary-color); background: color-mix(in srgb, var(--primary-color), transparent 87%); font-size: 1.4rem; }
        h3 { margin: 0 0 .7rem; color: var(--text-color); font-size: 1.35rem; }
        .feature-card p { margin: 0; color: var(--text-color-secondary); line-height: 1.7; }
        @media (max-width: 800px) { .features-grid { grid-template-columns: 1fr; } }
    `
})
export class FeaturesWidget {
    readonly features = [
        { icon: 'pi pi-search', title: 'Explorez les offres', description: 'Consultez librement toutes les opportunités et trouvez celles qui correspondent à votre parcours.' },
        { icon: 'pi pi-user-plus', title: 'Créez votre profil', description: 'Renseignez vos informations une seule fois dans un espace candidat clair et sécurisé.' },
        { icon: 'pi pi-chart-line', title: 'Suivez vos demandes', description: 'Retrouvez vos candidatures et leur progression depuis votre tableau de bord personnel.' }
    ];
}

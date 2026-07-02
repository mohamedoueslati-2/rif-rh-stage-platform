import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    standalone: true,
    imports: [RouterModule],
    template: `
        <footer class="footer px-6 lg:px-20">
            <div class="footer-inner">
                <a routerLink="/" class="brand"><img src="/images/rif_logo_light_topbar.png" alt="RIF Stages" /></a>
                <p>La plateforme RIF pour découvrir, candidater et suivre vos demandes de stage.</p>
            </div>
            <div class="copyright">© {{ currentYear }} RIF Stages. Tous droits réservés.</div>
        </footer>
    `,
    styles: `
        .footer { padding-top: 4rem; padding-bottom: 2rem; background: var(--surface-950); color: var(--surface-300); }
        .footer-inner { max-width: 1280px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 3rem; }
        .brand img { width: auto; height: 48px; }
        p { margin: 0; line-height: 1.7; }
        .copyright { max-width: 1280px; margin: 3rem auto 0; padding-top: 1.5rem; border-top: 1px solid var(--surface-800); color: var(--surface-500); font-size: .9rem; }
        @media (max-width: 800px) { .footer-inner { flex-direction: column; text-align: center; } .brand { margin: auto; } .copyright { text-align: center; } }
    `
})
export class FooterWidget { readonly currentYear = new Date().getFullYear(); }

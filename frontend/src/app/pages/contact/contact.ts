import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TopbarWidget } from '../landing/components/topbarwidget.component';
import { FooterWidget } from '../landing/components/footerwidget';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [FormsModule, ButtonModule, InputTextModule, TextareaModule, TopbarWidget, FooterWidget],
    template: `
        <div class="contact-page">
            <topbar-widget class="contact-topbar py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />

            <main class="contact-main px-6">
                <header class="contact-heading">
                    <h1>Contactez-nous</h1>
                    <p>Une question sur une offre, votre candidature ou la plateforme ? Écrivez-nous, notre équipe RH répond sous 48h.</p>
                </header>

                <div class="contact-grid">
                    <form class="contact-form" (ngSubmit)="sendMessage()">
                        <div class="two-columns">
                            <div class="field">
                                <label for="name">Nom</label>
                                <input pInputText id="name" name="name" [(ngModel)]="name" placeholder="Votre nom" required />
                            </div>
                            <div class="field">
                                <label for="email">Email</label>
                                <input pInputText id="email" name="email" [(ngModel)]="email" type="email" placeholder="nom@email.com" required />
                            </div>
                        </div>

                        <div class="field">
                            <label for="subject">Sujet</label>
                            <input pInputText id="subject" name="subject" [(ngModel)]="subject" placeholder="Objet de votre message" required />
                        </div>

                        <div class="field">
                            <label for="message">Message</label>
                            <textarea pTextarea id="message" name="message" [(ngModel)]="message" rows="6" maxlength="1000" placeholder="Décrivez votre demande..." required></textarea>
                        </div>

                        <button pButton type="submit" label="Envoyer le message" [disabled]="!canSubmit"></button>
                    </form>

                    <aside class="contact-details">
                        @for (detail of details; track detail.label) {
                            <div class="detail-row">
                                <div class="detail-icon"><i [class]="detail.icon"></i></div>
                                <div>
                                    <strong>{{ detail.label }}</strong>
                                    @if (detail.href) {
                                        <a [href]="detail.href">{{ detail.value }}</a>
                                    } @else {
                                        <span>{{ detail.value }}</span>
                                    }
                                </div>
                            </div>
                        }

                        <div class="social-links" aria-label="Réseaux sociaux">
                            <a href="#" aria-label="Instagram"><i class="pi pi-instagram"></i></a>
                            <a href="#" aria-label="Facebook"><i class="pi pi-facebook"></i></a>
                            <a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin"></i></a>
                        </div>
                    </aside>
                </div>
            </main>

            <footer-widget />
        </div>
    `,
    styles: `
        .contact-page { min-height: 100vh; background: var(--surface-50); color: var(--text-color); }
        :host-context(.app-dark) .contact-page { background: var(--surface-950); }
        .contact-topbar { display: flex; background: var(--surface-card); border-bottom: 1px solid var(--surface-border); }
        .contact-main { max-width: 1240px; margin: auto; padding-top: 4rem; padding-bottom: 7rem; }
        .contact-heading { max-width: 620px; margin: 0 auto 3rem; text-align: center; }
        .contact-heading h1 { margin: 0 0 .8rem; font-size: clamp(2.25rem, 4vw, 3rem); letter-spacing: -.04em; }
        .contact-heading p { margin: 0; color: var(--text-color-secondary); font-size: 1.05rem; line-height: 1.55; }
        .contact-grid { display: grid; grid-template-columns: minmax(0, 2.25fr) minmax(290px, .85fr); align-items: start; gap: 1.75rem; }
        .contact-form, .contact-details { background: var(--surface-card); border: 1px solid var(--surface-border); border-radius: 18px; box-shadow: 0 12px 35px rgba(15,23,42,.06); }
        .contact-form { padding: 2.25rem; }
        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { margin-bottom: 1.25rem; }
        label { display: block; margin-bottom: .5rem; color: var(--text-color); font-weight: 700; }
        input, textarea { width: 100%; background: var(--surface-50); }
        :host-context(.app-dark) input, :host-context(.app-dark) textarea { background: var(--surface-800); }
        input { height: 48px; }
        textarea { min-height: 145px; resize: vertical; }
        .contact-form button { min-width: 180px; box-shadow: 0 8px 18px color-mix(in srgb, var(--primary-color), transparent 72%); }
        .contact-details { padding: 1.8rem; }
        .detail-row { display: flex; align-items: flex-start; gap: .9rem; margin-bottom: 1.4rem; }
        .detail-icon { width: 42px; height: 42px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 11px; color: var(--primary-color); background: color-mix(in srgb, var(--primary-color), transparent 90%); }
        .detail-row strong, .detail-row span, .detail-row a { display: block; }
        .detail-row strong { margin-bottom: .25rem; font-size: .95rem; }
        .detail-row span, .detail-row a { color: var(--text-color-secondary); line-height: 1.45; text-decoration: none; }
        .detail-row a:hover { color: var(--primary-color); }
        .social-links { display: flex; gap: .65rem; padding-top: .4rem; }
        .social-links a { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid var(--surface-border); border-radius: 10px; color: var(--text-color-secondary); text-decoration: none; }
        .social-links a:hover { color: var(--primary-color); border-color: var(--primary-color); }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .contact-main { padding-top: 3rem; padding-bottom: 5rem; } .two-columns { grid-template-columns: 1fr; gap: 0; } .contact-form { padding: 1.35rem; } .contact-form button { width: 100%; } }
    `
})
export class Contact {
    readonly contactEmail = 'contact@rif-stages.tn';
    readonly details = [
        { icon: 'pi pi-envelope', label: 'Email', value: this.contactEmail, href: `mailto:${this.contactEmail}` },
        { icon: 'pi pi-phone', label: 'Téléphone', value: '+216 70 123 456', href: 'tel:+21670123456' },
        { icon: 'pi pi-map-marker', label: 'Adresse', value: 'Rassemblement des Ingénieurs Francophones, Tunis', href: null },
        { icon: 'pi pi-clock', label: 'Horaires', value: 'Lun – Ven, 9h – 17h', href: null }
    ];

    name = '';
    email = '';
    subject = '';
    message = '';

    get canSubmit(): boolean {
        return !!this.name.trim() && !!this.email.trim() && !!this.subject.trim() && !!this.message.trim();
    }

    sendMessage(): void {
        if (!this.canSubmit) return;
        const body = `Nom : ${this.name.trim()}\nEmail : ${this.email.trim()}\n\n${this.message.trim()}`;
        window.location.href = `mailto:${this.contactEmail}?subject=${encodeURIComponent(this.subject.trim())}&body=${encodeURIComponent(body)}`;
    }
}

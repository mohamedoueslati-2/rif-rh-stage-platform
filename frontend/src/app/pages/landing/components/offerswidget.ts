import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

interface InternshipOffer {
    id: string;
    referenceOffre: string;
    titre: string;
    description: string;
    domaine: string;
    lieu: string;
    duree: string;
    dateDebut: string;
    dateExpiration: string;
}

@Component({
    selector: 'offers-widget',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, RouterModule, ButtonModule, InputTextModule, SkeletonModule, TagModule],
    template: `
        <section id="offres" class="offers-section px-6 lg:px-20">
            <div class="section-heading">
                <div>
                    <span class="eyebrow">Opportunités ouvertes</span>
                    <h2>Nos offres de stage</h2>
                    <p>Explorez les missions actuellement proposées par l’équipe RIF.</p>
                </div>
                <button pButton type="button" label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (click)="loadOffers()"></button>
            </div>

            <form class="filter-panel" (ngSubmit)="applyFilters()">
                <div class="filter-field search-field">
                    <label for="offer-search">Recherche</label>
                    <div class="input-with-icon">
                        <i class="pi pi-search"></i>
                        <input pInputText id="offer-search" name="search" [(ngModel)]="search" placeholder="Développeur web, IA, DevOps..." />
                    </div>
                </div>
                <div class="filter-field">
                    <label for="offer-domain">Domaine</label>
                    <select id="offer-domain" name="domain" [(ngModel)]="domain">
                        <option value="">Tous les domaines</option>
                        @for (item of domains; track item) { <option [value]="item">{{ item }}</option> }
                    </select>
                </div>
                <div class="filter-field">
                    <label for="offer-location">Lieu</label>
                    <select id="offer-location" name="location" [(ngModel)]="location">
                        <option value="">Tous les lieux</option>
                        @for (item of locations; track item) { <option [value]="item">{{ item }}</option> }
                    </select>
                </div>
                <button pButton type="submit" label="Filtrer" icon="pi pi-filter"></button>
            </form>

            @if (hasActiveFilters && !loading) {
                <div class="filter-summary">
                    <span>{{ offers.length }} offre{{ offers.length > 1 ? 's' : '' }} trouvée{{ offers.length > 1 ? 's' : '' }}</span>
                    <button type="button" (click)="resetFilters()">Réinitialiser les filtres</button>
                </div>
            }

            @if (loading) {
                <div class="offers-grid">
                    @for (item of [1, 2, 3]; track item) {
                        <div class="offer-card"><p-skeleton width="7rem" height="1.5rem" /><p-skeleton width="85%" height="2rem" styleClass="mt-5" /><p-skeleton width="100%" height="6rem" styleClass="mt-4" /></div>
                    }
                </div>
            } @else if (errorMessage) {
                <div class="empty-state"><i class="pi pi-exclamation-circle"></i><h3>Offres indisponibles</h3><p>{{ errorMessage }}</p><button pButton label="Réessayer" (click)="loadOffers()"></button></div>
            } @else if (!offers.length) {
                <div class="empty-state">
                    <i class="pi pi-briefcase"></i>
                    <h3>{{ allOffers.length ? 'Aucune offre ne correspond à votre recherche' : 'Aucune offre ouverte actuellement' }}</h3>
                    <p>{{ allOffers.length ? 'Essayez de modifier ou de réinitialiser vos filtres.' : 'Revenez bientôt pour découvrir nos prochaines opportunités.' }}</p>
                    @if (allOffers.length) { <button pButton label="Réinitialiser" severity="secondary" [outlined]="true" (click)="resetFilters()"></button> }
                </div>
            } @else {
                <div class="offers-grid">
                    @for (offer of offers; track offer.id) {
                        <article class="offer-card">
                            <div class="flex justify-between items-center gap-3">
                                <p-tag [value]="offer.domaine" />
                                <small>{{ offer.referenceOffre }}</small>
                            </div>
                            <h3>{{ offer.titre }}</h3>
                            <p class="description">{{ offer.description }}</p>
                            <div class="offer-meta">
                                <span><i class="pi pi-map-marker"></i>{{ offer.lieu }}</span>
                                <span><i class="pi pi-clock"></i>{{ offer.duree }}</span>
                            </div>
                            <div class="offer-footer">
                                <span>Jusqu’au {{ offer.dateExpiration | date: 'dd/MM/yyyy' }}</span>
                                <a pButton routerLink="/auth/login" label="Postuler" icon="pi pi-arrow-right" iconPos="right" [text]="true"></a>
                            </div>
                        </article>
                    }
                </div>
            }
        </section>
    `,
    styles: `
        .offers-section { max-width: 1440px; margin: auto; padding-top: 7rem; padding-bottom: 7rem; }
        .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: 2.5rem; }
        .eyebrow { color: var(--primary-color); font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h2 { margin: .6rem 0 .5rem; color: var(--text-color); font-size: clamp(2.2rem, 4vw, 3.4rem); letter-spacing: -.04em; }
        .section-heading p { margin: 0; color: var(--text-color-secondary); font-size: 1.1rem; }
        .filter-panel { margin-bottom: 1.25rem; padding: 1.5rem; display: grid; grid-template-columns: 1.55fr 1fr 1fr auto; align-items: end; gap: 1rem; border: 1px solid var(--surface-border); border-radius: 20px; background: var(--surface-card); box-shadow: 0 14px 38px rgba(0,0,0,.06); }
        .filter-field label { display: block; margin-bottom: .5rem; color: var(--text-color-secondary); font-weight: 700; }
        .filter-field input, .filter-field select { width: 100%; height: 48px; }
        .filter-field select { padding: 0 .8rem; border: 1px solid var(--surface-border); border-radius: var(--p-form-field-border-radius); background: var(--surface-card); color: var(--text-color); }
        .input-with-icon { position: relative; }
        .input-with-icon i { position: absolute; z-index: 1; top: 50%; left: .9rem; color: var(--text-color-secondary); transform: translateY(-50%); }
        .input-with-icon input { padding-left: 2.6rem; }
        .filter-panel > button { height: 48px; min-width: 125px; }
        .filter-summary { margin: 0 0 1.5rem; display: flex; align-items: center; justify-content: space-between; color: var(--text-color-secondary); font-size: .9rem; }
        .filter-summary button { padding: 0; border: 0; background: transparent; color: var(--primary-color); cursor: pointer; font-weight: 700; }
        .offers-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
        .offer-card { min-height: 350px; padding: 1.6rem; display: flex; flex-direction: column; background: var(--surface-card); border: 1px solid var(--surface-border); border-radius: 20px; transition: transform .25s, box-shadow .25s, border-color .25s; }
        .offer-card:hover { transform: translateY(-5px); border-color: color-mix(in srgb, var(--primary-color), transparent 45%); box-shadow: 0 20px 50px rgba(0,0,0,.09); }
        .offer-card small { color: var(--text-color-secondary); }
        .offer-card h3 { margin: 1.2rem 0 .75rem; color: var(--text-color); font-size: 1.35rem; }
        .description { flex: 1; margin: 0; color: var(--text-color-secondary); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .offer-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.5rem 0; color: var(--text-color-secondary); }
        .offer-meta span { display: flex; align-items: center; gap: .4rem; }
        .offer-meta i { color: var(--primary-color); }
        .offer-footer { padding-top: 1rem; display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-top: 1px solid var(--surface-border); }
        .offer-footer > span { color: var(--text-color-secondary); font-size: .85rem; }
        .empty-state { padding: 5rem 2rem; text-align: center; border: 1px dashed var(--surface-border); border-radius: 24px; background: var(--surface-50); color: var(--text-color-secondary); }
        :host-context(.app-dark) .empty-state { background: var(--surface-800); }
        .empty-state > i { color: var(--primary-color); font-size: 2.5rem; }
        .empty-state h3 { color: var(--text-color); margin: 1rem 0 .5rem; }
        @media (max-width: 992px) { .filter-panel { grid-template-columns: 1fr 1fr; } .search-field { grid-column: 1 / -1; } .offers-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .offers-section { padding-top: 5rem; padding-bottom: 5rem; } .section-heading { align-items: flex-start; flex-direction: column; } .filter-panel { grid-template-columns: 1fr; } .search-field { grid-column: auto; } .filter-panel > button { width: 100%; } .filter-summary { align-items: flex-start; flex-direction: column; gap: .5rem; } .offers-grid { grid-template-columns: 1fr; } }
    `
})
export class OffersWidget implements OnInit {
    private readonly http = inject(HttpClient);
    allOffers: InternshipOffer[] = [];
    offers: InternshipOffer[] = [];
    domains: string[] = [];
    locations: string[] = [];
    search = '';
    domain = '';
    location = '';
    loading = true;
    errorMessage = '';

    ngOnInit(): void { this.loadOffers(); }

    loadOffers(): void {
        this.loading = true;
        this.errorMessage = '';
        this.http.get<InternshipOffer[]>('/api/offres').subscribe({
            next: (offers) => {
                this.allOffers = offers;
                this.domains = this.uniqueValues(offers.map((offer) => offer.domaine));
                this.locations = this.uniqueValues(offers.map((offer) => offer.lieu));
                this.applyFilters();
                this.loading = false;
            },
            error: () => { this.errorMessage = 'Le serveur ne répond pas pour le moment.'; this.loading = false; }
        });
    }

    get hasActiveFilters(): boolean {
        return !!this.search.trim() || !!this.domain || !!this.location;
    }

    applyFilters(): void {
        const query = this.normalize(this.search);
        this.offers = this.allOffers.filter((offer) => {
            const searchableText = this.normalize(`${offer.titre} ${offer.description} ${offer.domaine} ${offer.referenceOffre}`);
            return (!query || searchableText.includes(query))
                && (!this.domain || offer.domaine === this.domain)
                && (!this.location || offer.lieu === this.location);
        });
    }

    resetFilters(): void {
        this.search = '';
        this.domain = '';
        this.location = '';
        this.applyFilters();
    }

    private uniqueValues(values: string[]): string[] {
        return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
    }

    private normalize(value: string): string {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }
}

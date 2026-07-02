import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { finalize, forkJoin } from 'rxjs';
import { InternshipOffer, PublicOfferService } from '../../landing/services/public-offer.service';
import { CandidateApplicationService } from '../services/candidate-application.service';

@Component({
    selector: 'app-candidate-offers',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, DialogModule, InputTextModule, TagModule, ToastModule, TextareaModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="page-heading">
            <div>
                <span class="eyebrow">Espace candidat</span>
                <h1>Offres de stage</h1>
                <p>Découvrez les opportunités disponibles et déposez votre candidature.</p>
            </div>
            <div class="heading-stat"><strong>{{ filteredOffers.length }}</strong><span>offre{{ filteredOffers.length > 1 ? 's' : '' }} trouvée{{ filteredOffers.length > 1 ? 's' : '' }}</span></div>
        </div>

        <div class="card filters-card">
            <div class="filters">
                <div class="filter search-filter">
                    <label for="candidate-offer-search">Recherche</label>
                    <div class="search-input"><i class="pi pi-search"></i><input pInputText id="candidate-offer-search" [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Titre, référence, domaine..." /></div>
                </div>
                <div class="filter">
                    <label for="candidate-offer-domain">Domaine</label>
                    <select id="candidate-offer-domain" [(ngModel)]="domainFilter" (ngModelChange)="applyFilters()">
                        <option value="">Tous les domaines</option>
                        @for (domain of domains; track domain) { <option [value]="domain">{{ domain }}</option> }
                    </select>
                </div>
                <div class="filter">
                    <label for="candidate-offer-location">Lieu</label>
                    <select id="candidate-offer-location" [(ngModel)]="locationFilter" (ngModelChange)="applyFilters()">
                        <option value="">Tous les lieux</option>
                        @for (location of locations; track location) { <option [value]="location">{{ location }}</option> }
                    </select>
                </div>
                <p-button icon="pi pi-refresh" label="Actualiser" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadData()" />
            </div>
        </div>

        @if (loading) {
            <div class="state-card"><i class="pi pi-spin pi-spinner"></i><span>Chargement des offres...</span></div>
        } @else if (!filteredOffers.length) {
            <div class="state-card"><i class="pi pi-briefcase"></i><strong>Aucune offre trouvée</strong><span>{{ offers.length ? 'Essayez de modifier les filtres.' : 'Aucune offre n’est disponible actuellement.' }}</span></div>
        } @else {
            <div class="offers-grid">
                @for (offer of filteredOffers; track offer.id) {
                    <article class="offer-card">
                        <div class="offer-top"><span class="reference">{{ offer.referenceOffre }}</span><p-tag [value]="offer.domaine" severity="secondary" /></div>
                        <h2>{{ offer.titre }}</h2>
                        <p class="description">{{ offer.description }}</p>
                        <div class="offer-meta">
                            <span><i class="pi pi-map-marker"></i>{{ offer.lieu }}</span>
                            <span><i class="pi pi-clock"></i>{{ offer.duree }}</span>
                            <span><i class="pi pi-calendar"></i>Début : {{ offer.dateDebut | date: 'dd/MM/yyyy' }}</span>
                            <span><i class="pi pi-hourglass"></i>Expiration : {{ offer.dateExpiration | date: 'dd/MM/yyyy' }}</span>
                        </div>
                        <div class="offer-actions">
                            <p-button label="Consulter" icon="pi pi-eye" severity="secondary" [outlined]="true" (onClick)="openDetails(offer)" />
                            @if (appliedOfferIds.has(offer.id)) {
                                <p-button label="Déjà postulé" icon="pi pi-check" severity="success" [disabled]="true" />
                            } @else {
                                <p-button label="Postuler" icon="pi pi-send" (onClick)="openApplication(offer)" />
                            }
                        </div>
                    </article>
                }
            </div>
        }

        <p-dialog [(visible)]="detailsDialog" [modal]="true" [style]="{ width: '650px' }" [breakpoints]="{ '750px': '94vw' }" header="Détail de l’offre">
            @if (selectedOffer) {
                <div class="detail-header"><span class="reference">{{ selectedOffer.referenceOffre }}</span><h2>{{ selectedOffer.titre }}</h2><p-tag [value]="selectedOffer.domaine" severity="secondary" /></div>
                <p class="detail-description">{{ selectedOffer.description }}</p>
                <div class="detail-grid">
                    <div><span>Lieu</span><strong>{{ selectedOffer.lieu }}</strong></div>
                    <div><span>Durée</span><strong>{{ selectedOffer.duree }}</strong></div>
                    <div><span>Date de début</span><strong>{{ selectedOffer.dateDebut | date: 'dd/MM/yyyy' }}</strong></div>
                    <div><span>Date d’expiration</span><strong>{{ selectedOffer.dateExpiration | date: 'dd/MM/yyyy' }}</strong></div>
                    <div class="full"><span>Créée par</span><strong>{{ selectedOffer.rhCreateurNom }}</strong></div>
                </div>
                <div class="dialog-actions">
                    <p-button label="Fermer" severity="secondary" [text]="true" (onClick)="detailsDialog = false" />
                    @if (!appliedOfferIds.has(selectedOffer.id)) { <p-button label="Postuler à cette offre" icon="pi pi-send" (onClick)="startApplicationFromDetails()" /> }
                </div>
            }
        </p-dialog>

        <p-dialog [(visible)]="applicationDialog" [modal]="true" [style]="{ width: '600px' }" [breakpoints]="{ '700px': '94vw' }" header="Déposer ma candidature" (onHide)="resetApplicationForm()">
            @if (selectedOffer) {
                <div class="application-intro"><i class="pi pi-briefcase"></i><div><span>Candidature pour</span><strong>{{ selectedOffer.titre }}</strong><small>{{ selectedOffer.referenceOffre }}</small></div></div>
                <div class="dialog-form">
                    <div class="field">
                        <label for="cv-url">Lien vers votre CV *</label>
                        <input pInputText id="cv-url" [(ngModel)]="cvUrl" placeholder="https://drive.google.com/..." />
                        <small>Le document doit être accessible par lien (Google Drive, OneDrive, etc.).</small>
                        @if (submitted && cvError) { <small class="field-error">{{ cvError }}</small> }
                    </div>
                    <div class="field">
                        <label for="letter-url">Lien vers la lettre de motivation</label>
                        <input pInputText id="letter-url" [(ngModel)]="letterUrl" placeholder="https://drive.google.com/... (optionnel)" />
                        @if (submitted && letterError) { <small class="field-error">{{ letterError }}</small> }
                    </div>
                </div>
                <div class="dialog-actions"><p-button label="Annuler" severity="secondary" [text]="true" (onClick)="applicationDialog = false" /><p-button label="Envoyer ma candidature" icon="pi pi-send" [loading]="submitting" (onClick)="submitApplication()" /></div>
            }
        </p-dialog>
    `,
    styles: `
        .page-heading{display:flex;justify-content:space-between;gap:2rem;align-items:center;margin-bottom:1.5rem}.eyebrow{color:var(--primary-color);font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}.page-heading h1{margin:.35rem 0;font-size:2rem}.page-heading p{margin:0;color:var(--text-color-secondary)}.heading-stat{min-width:150px;padding:1rem 1.25rem;border-radius:16px;background:color-mix(in srgb,var(--primary-color) 10%,var(--surface-card));display:flex;flex-direction:column}.heading-stat strong{font-size:1.8rem;color:var(--primary-color)}.heading-stat span{color:var(--text-color-secondary)}
        .filters-card{padding:1.25rem;margin-bottom:1.5rem}.filters{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:1rem;align-items:end}.filter{display:flex;flex-direction:column;gap:.45rem}.filter label{font-weight:600;font-size:.85rem}.filter select,.filter input{width:100%;height:42px;border:1px solid var(--surface-border);border-radius:8px;background:var(--surface-card);color:var(--text-color);padding:0 .8rem}.search-input{position:relative}.search-input i{position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:var(--text-color-secondary)}.search-input input{padding-left:2.4rem}
        .offers-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}.offer-card{background:var(--surface-card);border:1px solid var(--surface-border);border-radius:18px;padding:1.4rem;display:flex;flex-direction:column;box-shadow:0 8px 28px rgba(15,23,42,.05)}.offer-top{display:flex;align-items:center;justify-content:space-between;gap:1rem}.reference{color:var(--primary-color);font-weight:700;font-size:.82rem}.offer-card h2{font-size:1.2rem;margin:1rem 0 .6rem}.description{color:var(--text-color-secondary);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:4.6rem}.offer-meta{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0 1.25rem}.offer-meta span{display:flex;align-items:center;gap:.5rem;font-size:.88rem;color:var(--text-color-secondary)}.offer-meta i{color:var(--primary-color)}.offer-actions{display:flex;gap:.75rem;justify-content:flex-end;margin-top:auto}.state-card{min-height:260px;border:1px dashed var(--surface-border);border-radius:18px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:.75rem;color:var(--text-color-secondary)}.state-card i{font-size:2rem;color:var(--primary-color)}
        .detail-header h2{margin:.6rem 0}.detail-description{line-height:1.7;color:var(--text-color-secondary);padding:1rem 0;border-bottom:1px solid var(--surface-border)}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.25rem 0}.detail-grid div{display:flex;flex-direction:column;gap:.25rem}.detail-grid span,.application-intro span{font-size:.82rem;color:var(--text-color-secondary)}.detail-grid .full{grid-column:1/-1}.dialog-actions{display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.5rem}.application-intro{display:flex;gap:1rem;align-items:center;padding:1rem;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,var(--surface-card));margin-bottom:1.4rem}.application-intro>i{font-size:1.5rem;color:var(--primary-color)}.application-intro div{display:flex;flex-direction:column;gap:.2rem}.dialog-form,.field{display:flex;flex-direction:column;gap:1rem}.field{gap:.45rem}.field label{font-weight:600}.field small{color:var(--text-color-secondary)}.field .field-error{color:var(--red-500)}
        @media(max-width:1100px){.offers-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.filters{grid-template-columns:1fr 1fr}.search-filter{grid-column:1/-1}}@media(max-width:700px){.page-heading{align-items:flex-start;flex-direction:column}.heading-stat{width:100%}.offers-grid{grid-template-columns:1fr}.filters{grid-template-columns:1fr}.search-filter{grid-column:auto}.offer-meta,.detail-grid{grid-template-columns:1fr}.offer-actions{flex-wrap:wrap}}
    `
})
export class CandidateOffers implements OnInit {
    private readonly offerService = inject(PublicOfferService);
    private readonly applicationService = inject(CandidateApplicationService);
    private readonly messages = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);

    offers: InternshipOffer[] = [];
    filteredOffers: InternshipOffer[] = [];
    appliedOfferIds = new Set<string>();
    domains: string[] = [];
    locations: string[] = [];
    search = '';
    domainFilter = '';
    locationFilter = '';
    loading = false;
    detailsDialog = false;
    applicationDialog = false;
    selectedOffer: InternshipOffer | null = null;
    cvUrl = '';
    letterUrl = '';
    submitted = false;
    submitting = false;
    cvError = '';
    letterError = '';

    ngOnInit(): void { this.loadData(); }

    loadData(): void {
        this.loading = true;
        forkJoin({ offers: this.offerService.getAll(), applications: this.applicationService.getMine() })
            .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
            .subscribe({
                next: ({ offers, applications }) => {
                    this.offers = offers;
                    this.appliedOfferIds = new Set(applications.map((item) => item.offreStageId));
                    this.domains = [...new Set(offers.map((item) => item.domaine))].sort();
                    this.locations = [...new Set(offers.map((item) => item.lieu))].sort();
                    this.applyFilters();
                },
                error: (error: HttpErrorResponse) => this.showError(error, 'Impossible de charger les offres.')
            });
    }

    applyFilters(): void {
        const term = this.normalize(this.search);
        this.filteredOffers = this.offers.filter((offer) => {
            const haystack = this.normalize(`${offer.referenceOffre} ${offer.titre} ${offer.description} ${offer.domaine} ${offer.lieu}`);
            return (!term || haystack.includes(term)) && (!this.domainFilter || offer.domaine === this.domainFilter) && (!this.locationFilter || offer.lieu === this.locationFilter);
        });
    }

    openDetails(offer: InternshipOffer): void { this.selectedOffer = offer; this.detailsDialog = true; }
    openApplication(offer: InternshipOffer): void { this.resetApplicationForm(); this.selectedOffer = offer; this.applicationDialog = true; }
    startApplicationFromDetails(): void { const offer = this.selectedOffer; this.detailsDialog = false; if (offer) this.openApplication(offer); }

    submitApplication(): void {
        this.submitted = true;
        this.cvError = this.validateUrl(this.cvUrl, true);
        this.letterError = this.validateUrl(this.letterUrl, false);
        if (!this.selectedOffer || this.cvError || this.letterError) return;
        this.submitting = true;
        const offerId = this.selectedOffer.id;
        this.applicationService.apply(offerId, { cvUrl: this.cvUrl.trim(), lettreMotivationUrl: this.letterUrl.trim() || null })
            .pipe(finalize(() => { this.submitting = false; this.cdr.markForCheck(); }))
            .subscribe({
                next: () => {
                    this.appliedOfferIds.add(offerId);
                    this.applicationDialog = false;
                    this.messages.add({ severity: 'success', summary: 'Candidature envoyée', detail: 'Votre demande a bien été enregistrée.' });
                },
                error: (error: HttpErrorResponse) => this.showError(error, 'Impossible d’envoyer la candidature.')
            });
    }

    resetApplicationForm(): void { this.cvUrl = ''; this.letterUrl = ''; this.submitted = false; this.cvError = ''; this.letterError = ''; }

    private validateUrl(value: string, required: boolean): string {
        const cleaned = value.trim();
        if (!cleaned) return required ? 'Le lien vers le CV est obligatoire.' : '';
        if (cleaned.length > 500) return 'Le lien ne doit pas dépasser 500 caractères.';
        try { const url = new URL(cleaned); return url.protocol === 'http:' || url.protocol === 'https:' ? '' : 'Utilisez un lien HTTP ou HTTPS valide.'; }
        catch { return 'Saisissez une URL valide.'; }
    }

    private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
    private showError(error: HttpErrorResponse, fallback: string): void {
        const detail = typeof error.error === 'string' ? error.error : error.error?.message || fallback;
        this.messages.add({ severity: 'error', summary: 'Erreur', detail });
    }
}

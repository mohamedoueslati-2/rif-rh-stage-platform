import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InternshipOffer } from '../../landing/services/public-offer.service';
import { OfferPayload, RhOfferService } from './rh-offer.service';
import { finalize } from 'rxjs';

type OfferForm = OfferPayload & { id?: string };

@Component({
    selector: 'app-rh-offers',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, ConfirmDialogModule, DialogModule, InputTextModule, TableModule, TextareaModule, ToastModule, ToolbarModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '450px' }" />

        <div class="page-heading">
            <div>
                <span class="eyebrow">Administration RH</span>
                <h1>Gestion des offres de stage</h1>
                <p>Créez, modifiez et publiez les opportunités proposées aux candidats.</p>
            </div>
            <div class="heading-stat">
                <strong>{{ offers.length }}</strong>
                <span>offre{{ offers.length > 1 ? 's' : '' }} affichée{{ offers.length > 1 ? 's' : '' }}</span>
            </div>
        </div>

        <div class="card">
            <p-toolbar styleClass="mb-6 border-0! bg-transparent! p-0!">
                <ng-template #start>
                    <p-button label="Nouvelle offre" icon="pi pi-plus" (onClick)="openCreateDialog()" />
                </ng-template>
                <ng-template #end>
                    <p-button label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadOffers()" />
                </ng-template>
            </p-toolbar>

            <div class="filters">
                <div class="filter search-filter">
                    <label for="rh-offer-search">Recherche</label>
                    <div class="search-input">
                        <i class="pi pi-search"></i>
                        <input pInputText id="rh-offer-search" [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Référence, titre, domaine..." />
                    </div>
                </div>
                <div class="filter">
                    <label for="rh-offer-domain">Domaine</label>
                    <select id="rh-offer-domain" [(ngModel)]="domainFilter" (ngModelChange)="applyFilters()">
                        <option value="">Tous les domaines</option>
                        @for (domain of domains; track domain) { <option [value]="domain">{{ domain }}</option> }
                    </select>
                </div>
                <div class="filter">
                    <label for="rh-offer-location">Lieu</label>
                    <select id="rh-offer-location" [(ngModel)]="locationFilter" (ngModelChange)="applyFilters()">
                        <option value="">Tous les lieux</option>
                        @for (location of locations; track location) { <option [value]="location">{{ location }}</option> }
                    </select>
                </div>
                <p-button label="Réinitialiser" icon="pi pi-filter-slash" severity="secondary" [text]="true" [disabled]="!hasFilters" (onClick)="resetFilters()" />
            </div>

            <p-table
                [value]="filteredOffers"
                [loading]="loading"
                [rows]="8"
                [paginator]="true"
                [rowsPerPageOptions]="[8, 15, 25]"
                [tableStyle]="{ 'min-width': '70rem' }"
                currentPageReportTemplate="{first} à {last} sur {totalRecords} offres"
                [showCurrentPageReport]="true"
                dataKey="id"
            >
                <ng-template #header>
                    <tr>
                        <th pSortableColumn="referenceOffre">Référence <p-sortIcon field="referenceOffre" /></th>
                        <th pSortableColumn="titre">Offre <p-sortIcon field="titre" /></th>
                        <th pSortableColumn="domaine">Domaine <p-sortIcon field="domaine" /></th>
                        <th pSortableColumn="lieu">Lieu <p-sortIcon field="lieu" /></th>
                        <th>Durée</th>
                        <th pSortableColumn="dateDebut">Date de début <p-sortIcon field="dateDebut" /></th>
                        <th pSortableColumn="dateExpiration">Date d’expiration <p-sortIcon field="dateExpiration" /></th>
                        <th style="width: 12rem">Actions</th>
                    </tr>
                </ng-template>
                <ng-template #body let-offer>
                    <tr>
                        <td><span class="reference">{{ offer.referenceOffre }}</span></td>
                        <td>
                            <div class="offer-title">{{ offer.titre }}</div>
                            <small>{{ offer.description }}</small>
                        </td>
                        <td>{{ offer.domaine }}</td>
                        <td><i class="pi pi-map-marker text-primary mr-2"></i>{{ offer.lieu }}</td>
                        <td>{{ offer.duree }}</td>
                        <td>{{ offer.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ offer.dateExpiration | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <div class="action-buttons">
                                <p-button icon="pi pi-eye" severity="secondary" [rounded]="true" [outlined]="true" ariaLabel="Consulter" (onClick)="openDetails(offer)" />
                                <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" ariaLabel="Modifier" (onClick)="openEditDialog(offer)" />
                                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" ariaLabel="Supprimer" (onClick)="confirmDelete(offer)" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr><td colspan="8"><div class="empty-table"><i class="pi pi-briefcase"></i><strong>Aucune offre trouvée</strong><span>{{ offers.length ? 'Modifiez vos filtres de recherche.' : 'Créez votre première offre de stage.' }}</span></div></td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="formDialog" [modal]="true" [style]="{ width: '760px' }" [breakpoints]="{ '900px': '94vw' }" [header]="form.id ? 'Modifier l’offre' : 'Créer une offre'" (onHide)="resetFormState()">
            <div class="dialog-form">
                <div class="form-grid">
                    <div class="field">
                        <label for="reference">Référence *</label>
                        <input pInputText id="reference" [(ngModel)]="form.referenceOffre" placeholder="OFF-DEV-2026-001" />
                        @if (submitted && !form.referenceOffre.trim()) { <small class="field-error">La référence est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="title">Titre *</label>
                        <input pInputText id="title" [(ngModel)]="form.titre" placeholder="Stage Développeur Full Stack" />
                        @if (submitted && !form.titre.trim()) { <small class="field-error">Le titre est obligatoire.</small> }
                    </div>
                    <div class="field full">
                        <label for="description">Description *</label>
                        <textarea pTextarea id="description" [(ngModel)]="form.description" rows="5" placeholder="Décrivez les missions et objectifs du stage..."></textarea>
                        @if (submitted && !form.description.trim()) { <small class="field-error">La description est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="domain">Domaine *</label>
                        <input pInputText id="domain" [(ngModel)]="form.domaine" placeholder="Développement Web" />
                        @if (submitted && !form.domaine.trim()) { <small class="field-error">Le domaine est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="location">Lieu *</label>
                        <input pInputText id="location" [(ngModel)]="form.lieu" placeholder="Tunis" />
                        @if (submitted && !form.lieu.trim()) { <small class="field-error">Le lieu est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="duration">Durée *</label>
                        <input pInputText id="duration" [(ngModel)]="form.duree" placeholder="2 mois" />
                        @if (submitted && !form.duree.trim()) { <small class="field-error">La durée est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="start-date">Date de début *</label>
                        <input pInputText id="start-date" type="date" [(ngModel)]="form.dateDebut" [min]="today" />
                        @if (submitted && !form.dateDebut) { <small class="field-error">La date de début est obligatoire.</small> }
                    </div>
                    <div class="field">
                        <label for="expiration-date">Date d’expiration *</label>
                        <input pInputText id="expiration-date" type="date" [(ngModel)]="form.dateExpiration" [min]="today" />
                        @if (submitted && !form.dateExpiration) { <small class="field-error">La date d’expiration est obligatoire.</small> }
                        <small class="field-hint">Elle peut être antérieure ou identique à la date de début.</small>
                    </div>
                </div>
                @if (submitted && formError) { <div class="form-error"><i class="pi pi-exclamation-circle"></i>{{ formError }}</div> }
            </div>
            <ng-template #footer>
                <p-button label="Annuler" icon="pi pi-times" severity="secondary" [text]="true" (onClick)="closeFormDialog()" />
                <p-button [label]="form.id ? 'Enregistrer' : 'Publier l’offre'" icon="pi pi-check" [loading]="saving" (onClick)="saveOffer()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="detailsDialog" [modal]="true" [style]="{ width: '650px' }" [breakpoints]="{ '750px': '94vw' }" header="Détail de l’offre">
            @if (selectedOffer) {
                <div class="offer-details">
                    <div class="detail-top"><span class="domain-badge">{{ selectedOffer.domaine }}</span><span class="reference">{{ selectedOffer.referenceOffre }}</span></div>
                    <h2>{{ selectedOffer.titre }}</h2>
                    <div class="detail-meta">
                        <span><i class="pi pi-map-marker"></i>{{ selectedOffer.lieu }}</span>
                        <span><i class="pi pi-clock"></i>{{ selectedOffer.duree }}</span>
                        <span><i class="pi pi-calendar"></i>Début {{ selectedOffer.dateDebut | date: 'dd/MM/yyyy' }}</span>
                    </div>
                    <h3>À propos de la mission</h3>
                    <p>{{ selectedOffer.description }}</p>
                    <div class="detail-footer"><span>Date d’expiration</span><strong>{{ selectedOffer.dateExpiration | date: 'dd MMMM yyyy' }}</strong></div>
                </div>
            }
            <ng-template #footer>
                <p-button label="Fermer" severity="secondary" [text]="true" (onClick)="detailsDialog = false" />
                <p-button label="Modifier" icon="pi pi-pencil" (onClick)="editSelectedOffer()" />
            </ng-template>
        </p-dialog>
    `,
    styles: `
        .page-heading { margin-bottom: 1.5rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; }
        .eyebrow { color: var(--primary-color); font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .page-heading h1 { margin: .45rem 0; font-size: 2rem; letter-spacing: -.03em; }
        .page-heading p { margin: 0; color: var(--text-color-secondary); }
        .heading-stat { min-width: 130px; padding: 1rem 1.25rem; border: 1px solid var(--surface-border); border-radius: 16px; background: var(--surface-card); text-align: center; }
        .heading-stat strong, .heading-stat span { display: block; }
        .heading-stat strong { color: var(--primary-color); font-size: 1.8rem; }
        .heading-stat span { color: var(--text-color-secondary); font-size: .8rem; }
        .filters { margin-bottom: 1.5rem; padding: 1rem; display: grid; grid-template-columns: 1.5fr 1fr 1fr auto; align-items: end; gap: 1rem; border: 1px solid var(--surface-border); border-radius: 14px; background: var(--surface-ground); }
        .filter label, .field label { display: block; margin-bottom: .45rem; font-weight: 650; }
        .filter input, .filter select { width: 100%; height: 42px; }
        .filter select { padding: 0 .75rem; border: 1px solid var(--surface-border); border-radius: var(--p-form-field-border-radius); background: var(--surface-card); color: var(--text-color); }
        .search-input { position: relative; }
        .search-input i { position: absolute; z-index: 1; top: 50%; left: .8rem; color: var(--text-color-secondary); transform: translateY(-50%); }
        .search-input input { padding-left: 2.35rem; }
        .reference { color: var(--primary-color); font-family: monospace; font-weight: 750; }
        .offer-title { margin-bottom: .3rem; font-weight: 700; }
        td small { max-width: 260px; display: -webkit-box; color: var(--text-color-secondary); -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .action-buttons { display: flex; gap: .5rem; }
        .empty-table { padding: 4rem 1rem; display: flex; align-items: center; flex-direction: column; gap: .5rem; color: var(--text-color-secondary); }
        .empty-table i { margin-bottom: .5rem; color: var(--primary-color); font-size: 2.5rem; }
        .empty-table strong { color: var(--text-color); font-size: 1.1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.25rem; }
        .field.full { grid-column: 1 / -1; }
        .field input, .field textarea { width: 100%; }
        .field-error { display: block; margin-top: .35rem; color: var(--p-red-500); }
        .field-hint { display: block; margin-top: .35rem; color: var(--text-color-secondary); }
        .form-error { margin-top: 1rem; padding: .8rem 1rem; display: flex; align-items: center; gap: .6rem; border-radius: 10px; background: color-mix(in srgb, var(--p-red-500), transparent 90%); color: var(--p-red-600); }
        .detail-top, .detail-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .detail-top { justify-content: space-between; }
        .domain-badge { padding: .35rem .65rem; border-radius: 8px; background: color-mix(in srgb, var(--primary-color), transparent 88%); color: var(--primary-color); font-size: .85rem; font-weight: 700; }
        .offer-details h2 { margin: 1.25rem 0; font-size: 1.8rem; }
        .detail-meta { padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border); color: var(--text-color-secondary); }
        .detail-meta i { margin-right: .35rem; color: var(--primary-color); }
        .offer-details h3 { margin: 1.5rem 0 .7rem; }
        .offer-details > p { color: var(--text-color-secondary); line-height: 1.75; white-space: pre-line; }
        .detail-footer { margin-top: 1.5rem; padding: 1rem; display: flex; justify-content: space-between; gap: 1rem; border-radius: 12px; background: var(--surface-ground); }
        @media (max-width: 900px) { .filters { grid-template-columns: 1fr 1fr; } .search-filter { grid-column: 1 / -1; } }
        @media (max-width: 640px) { .page-heading { align-items: flex-start; flex-direction: column; } .heading-stat { width: 100%; } .filters, .form-grid { grid-template-columns: 1fr; } .search-filter, .field.full { grid-column: auto; } }
    `
})
export class RhOffers implements OnInit {
    private readonly offerService = inject(RhOfferService);
    private readonly changeDetector = inject(ChangeDetectorRef);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);

    offers: InternshipOffer[] = [];
    filteredOffers: InternshipOffer[] = [];
    loading = false;
    saving = false;
    formDialog = false;
    detailsDialog = false;
    submitted = false;
    selectedOffer: InternshipOffer | null = null;
    form: OfferForm = this.emptyForm();
    formError = '';
    search = '';
    domainFilter = '';
    locationFilter = '';
    readonly today = this.toLocalDate(new Date());

    ngOnInit(): void { this.loadOffers(); }

    get domains(): string[] { return this.uniqueValues(this.offers.map((offer) => offer.domaine)); }
    get locations(): string[] { return this.uniqueValues(this.offers.map((offer) => offer.lieu)); }
    get hasFilters(): boolean { return !!this.search.trim() || !!this.domainFilter || !!this.locationFilter; }

    applyFilters(): void {
        const query = this.normalize(this.search);
        this.filteredOffers = this.offers.filter((offer) => {
            const content = this.normalize(`${offer.referenceOffre} ${offer.titre} ${offer.description} ${offer.domaine} ${offer.lieu}`);
            return (!query || content.includes(query))
                && (!this.domainFilter || offer.domaine === this.domainFilter)
                && (!this.locationFilter || offer.lieu === this.locationFilter);
        });
    }

    loadOffers(): void {
        this.loading = true;
        this.offerService.getAll().pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
            next: (offers) => {
                this.offers = [...offers].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
                this.applyFilters();
                this.loading = false;
            },
            error: (error) => { this.loading = false; this.showError('Chargement impossible', error); }
        });
    }

    openCreateDialog(): void {
        this.form = this.emptyForm();
        this.form.referenceOffre = `OFF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        this.resetFormState();
        this.formDialog = true;
    }

    openEditDialog(offer: InternshipOffer): void {
        this.form = this.offerToForm(offer);
        this.resetFormState();
        this.formDialog = true;
    }

    openDetails(offer: InternshipOffer): void {
        this.selectedOffer = offer;
        this.detailsDialog = true;
        this.offerService.getById(offer.id).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({ next: (details) => this.selectedOffer = details, error: (error) => this.showError('Détail indisponible', error) });
    }

    editSelectedOffer(): void {
        if (!this.selectedOffer) return;
        const offer = this.selectedOffer;
        this.detailsDialog = false;
        this.openEditDialog(offer);
    }

    saveOffer(): void {
        this.submitted = true;
        this.formError = this.validateForm();
        if (this.formError) return;

        this.saving = true;
        const payload = this.toPayload(this.form);
        const request = this.form.id ? this.offerService.update(this.form.id, payload) : this.offerService.create(payload);
        request.pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
            next: (saved) => {
                const index = this.offers.findIndex((offer) => offer.id === saved.id);
                this.offers = index >= 0 ? this.offers.map((offer) => offer.id === saved.id ? saved : offer) : [saved, ...this.offers];
                this.applyFilters();
                this.saving = false;
                this.formDialog = false;
                this.messageService.add({ severity: 'success', summary: this.form.id ? 'Offre modifiée' : 'Offre publiée', detail: saved.titre, life: 3500 });
            },
            error: (error) => { this.saving = false; this.formError = this.errorMessage(error); }
        });
    }

    confirmDelete(offer: InternshipOffer): void {
        this.confirmationService.confirm({
            header: 'Supprimer l’offre',
            message: `Voulez-vous vraiment supprimer « ${offer.titre} » ?`,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Annuler',
            acceptLabel: 'Supprimer',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.deleteOffer(offer)
        });
    }

    closeFormDialog(): void { this.formDialog = false; }
    resetFilters(): void { this.search = ''; this.domainFilter = ''; this.locationFilter = ''; this.applyFilters(); }
    resetFormState(): void { this.submitted = false; this.formError = ''; }

    private deleteOffer(offer: InternshipOffer): void {
        this.offerService.delete(offer.id).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
            next: () => { this.offers = this.offers.filter((item) => item.id !== offer.id); this.applyFilters(); this.messageService.add({ severity: 'success', summary: 'Offre supprimée', detail: offer.titre, life: 3500 }); },
            error: (error) => this.showError('Suppression impossible', error)
        });
    }

    private validateForm(): string {
        const required = [this.form.referenceOffre, this.form.titre, this.form.description, this.form.domaine, this.form.lieu, this.form.duree, this.form.dateDebut, this.form.dateExpiration];
        if (required.some((value) => !value?.trim())) return 'Tous les champs sont obligatoires.';
        if (this.form.dateDebut < this.today || this.form.dateExpiration < this.today) return 'Les dates ne doivent pas être dans le passé.';
        if (this.form.dateExpiration > this.form.dateDebut) return 'La date d’expiration doit être antérieure ou égale à la date de début.';
        return '';
    }

    private emptyForm(): OfferForm { return { referenceOffre: '', titre: '', description: '', domaine: '', lieu: '', duree: '', dateDebut: '', dateExpiration: '' }; }
    private offerToForm(offer: InternshipOffer): OfferForm { return { id: offer.id, referenceOffre: offer.referenceOffre, titre: offer.titre, description: offer.description, domaine: offer.domaine, lieu: offer.lieu, duree: offer.duree, dateDebut: offer.dateDebut, dateExpiration: offer.dateExpiration }; }
    private toPayload(form: OfferForm): OfferPayload { return { referenceOffre: form.referenceOffre.trim(), titre: form.titre.trim(), description: form.description.trim(), domaine: form.domaine.trim(), lieu: form.lieu.trim(), duree: form.duree.trim(), dateDebut: form.dateDebut, dateExpiration: form.dateExpiration }; }
    private uniqueValues(values: string[]): string[] { return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')); }
    private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
    private toLocalDate(date: Date): string { const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10); }
    private errorMessage(error: HttpErrorResponse): string {
        if (error.status === 0) return 'Le backend est indisponible.';
        if (error.status === 401 || error.status === 403) return 'Session expirée ou accès RH refusé. Reconnectez-vous.';
        return typeof error.error?.message === 'string' ? error.error.message : 'Une erreur inattendue est survenue.';
    }
    private showError(summary: string, error: HttpErrorResponse): void { this.messageService.add({ severity: 'error', summary, detail: this.errorMessage(error), life: 5000 }); }
}

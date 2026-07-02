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
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { ApplicationStatus, CandidateApplication, CandidateApplicationService } from '../services/candidate-application.service';

@Component({
    selector: 'app-candidate-applications',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, ConfirmDialogModule, DialogModule, InputTextModule, TableModule, TagModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '460px' }" />

        <div class="page-heading">
            <div><span class="eyebrow">Espace candidat</span><h1>Mes demandes</h1><p>Suivez l’avancement de vos candidatures et consultez les retours du service RH.</p></div>
            <p-button label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadApplications()" />
        </div>

        <div class="stats-grid">
            <div class="stat-card"><span class="stat-icon total"><i class="pi pi-file"></i></span><div><strong>{{ applications.length }}</strong><span>Total des demandes</span></div></div>
            <div class="stat-card"><span class="stat-icon progress"><i class="pi pi-clock"></i></span><div><strong>{{ inProgressCount }}</strong><span>En cours de traitement</span></div></div>
            <div class="stat-card"><span class="stat-icon accepted"><i class="pi pi-check-circle"></i></span><div><strong>{{ acceptedCount }}</strong><span>Acceptées</span></div></div>
        </div>

        <div class="card">
            <div class="filters">
                <div class="search-input"><i class="pi pi-search"></i><input pInputText [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Rechercher une offre ou une référence..." /></div>
                <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
                    <option value="">Tous les statuts</option>
                    @for (status of statuses; track status) { <option [value]="status">{{ statusLabel(status) }}</option> }
                </select>
            </div>

            <p-table [value]="filteredApplications" [loading]="loading" [rows]="8" [paginator]="true" [rowsPerPageOptions]="[8, 15, 25]" [tableStyle]="{ 'min-width': '62rem' }" dataKey="id" currentPageReportTemplate="{first} à {last} sur {totalRecords} demandes" [showCurrentPageReport]="true">
                <ng-template #header><tr><th pSortableColumn="referenceDemande">Référence <p-sortIcon field="referenceDemande" /></th><th pSortableColumn="offreTitre">Offre <p-sortIcon field="offreTitre" /></th><th>Domaine</th><th pSortableColumn="dateDemande">Envoyée le <p-sortIcon field="dateDemande" /></th><th pSortableColumn="statut">Statut <p-sortIcon field="statut" /></th><th style="width:11rem">Actions</th></tr></ng-template>
                <ng-template #body let-application>
                    <tr>
                        <td><span class="reference">{{ application.referenceDemande }}</span></td>
                        <td><strong>{{ application.offreTitre }}</strong><small>{{ application.referenceOffre }}</small></td>
                        <td>{{ application.offreDomaine }}</td>
                        <td>{{ application.dateDemande | date: 'dd/MM/yyyy à HH:mm' }}</td>
                        <td><p-tag [value]="statusLabel(application.statut)" [severity]="statusSeverity(application.statut)" /></td>
                        <td><div class="actions"><p-button icon="pi pi-eye" severity="secondary" [rounded]="true" [outlined]="true" ariaLabel="Consulter" (onClick)="openDetails(application)" />@if (application.statut === 'SOUMISE') { <p-button icon="pi pi-times" severity="danger" [rounded]="true" [outlined]="true" ariaLabel="Annuler" (onClick)="confirmCancel(application)" /> }</div></td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage><tr><td colspan="6"><div class="empty-state"><i class="pi pi-inbox"></i><strong>Aucune demande trouvée</strong><span>{{ applications.length ? 'Modifiez vos filtres de recherche.' : 'Vous n’avez pas encore déposé de candidature.' }}</span></div></td></tr></ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="detailsDialog" [modal]="true" [style]="{ width: '680px' }" [breakpoints]="{ '760px': '94vw' }" header="Détail de la demande">
            @if (selectedApplication) {
                <div class="detail-heading"><div><span class="reference">{{ selectedApplication.referenceDemande }}</span><h2>{{ selectedApplication.offreTitre }}</h2><small>{{ selectedApplication.referenceOffre }} · {{ selectedApplication.offreDomaine }}</small></div><p-tag [value]="statusLabel(selectedApplication.statut)" [severity]="statusSeverity(selectedApplication.statut)" /></div>
                <div class="timeline-note"><i class="pi pi-calendar"></i><span>Demande envoyée le <strong>{{ selectedApplication.dateDemande | date: 'dd/MM/yyyy à HH:mm' }}</strong></span></div>
                <div class="detail-section"><h3>Documents transmis</h3><div class="documents"><a [href]="selectedApplication.cvUrl" target="_blank" rel="noopener"><i class="pi pi-file-pdf"></i><span>Consulter mon CV</span><i class="pi pi-external-link"></i></a>@if (selectedApplication.lettreMotivationUrl) { <a [href]="selectedApplication.lettreMotivationUrl" target="_blank" rel="noopener"><i class="pi pi-file-edit"></i><span>Lettre de motivation</span><i class="pi pi-external-link"></i></a> }</div></div>
                @if (selectedApplication.noteTestTechnique !== null || selectedApplication.commentaireRh || selectedApplication.rhTraitantNom) {
                    <div class="detail-section"><h3>Retour RH</h3><div class="feedback-grid">@if (selectedApplication.noteTestTechnique !== null) { <div><span>Note du test</span><strong>{{ selectedApplication.noteTestTechnique }}/100</strong></div> }@if (selectedApplication.rhTraitantNom) { <div><span>Traité par</span><strong>{{ selectedApplication.rhTraitantNom }}</strong></div> }@if (selectedApplication.commentaireRh) { <div class="comment"><span>Commentaire</span><p>{{ selectedApplication.commentaireRh }}</p></div> }</div></div>
                }
                <div class="dialog-actions"><p-button label="Fermer" severity="secondary" [text]="true" (onClick)="detailsDialog = false" />@if (selectedApplication.statut === 'SOUMISE') { <p-button label="Annuler la demande" icon="pi pi-times" severity="danger" [outlined]="true" (onClick)="confirmCancel(selectedApplication)" /> }</div>
            }
        </p-dialog>
    `,
    styles: `
        .page-heading{display:flex;justify-content:space-between;gap:2rem;align-items:center;margin-bottom:1.5rem}.eyebrow{color:var(--primary-color);font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}.page-heading h1{margin:.35rem 0;font-size:2rem}.page-heading p{margin:0;color:var(--text-color-secondary)}
        .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem}.stat-card{background:var(--surface-card);border:1px solid var(--surface-border);border-radius:16px;padding:1.1rem 1.25rem;display:flex;align-items:center;gap:1rem}.stat-icon{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:1.15rem}.stat-icon.total{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.stat-icon.progress{color:var(--orange-500);background:color-mix(in srgb,var(--orange-500) 12%,transparent)}.stat-icon.accepted{color:var(--green-500);background:color-mix(in srgb,var(--green-500) 12%,transparent)}.stat-card div{display:flex;flex-direction:column}.stat-card strong{font-size:1.5rem}.stat-card span:last-child{color:var(--text-color-secondary);font-size:.85rem}
        .filters{display:flex;gap:1rem;margin-bottom:1.25rem}.search-input{position:relative;flex:1}.search-input i{position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:var(--text-color-secondary)}.search-input input{width:100%;padding-left:2.4rem}.filters select{min-width:210px;border:1px solid var(--surface-border);border-radius:8px;background:var(--surface-card);color:var(--text-color);padding:0 .8rem}.reference{color:var(--primary-color);font-weight:700;font-size:.82rem}td strong,td small{display:block}td small{margin-top:.25rem;color:var(--text-color-secondary)}.actions{display:flex;gap:.5rem}.empty-state{min-height:230px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:.7rem;color:var(--text-color-secondary)}.empty-state i{font-size:2rem;color:var(--primary-color)}
        .detail-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.detail-heading h2{margin:.5rem 0}.detail-heading small{color:var(--text-color-secondary)}.timeline-note{display:flex;gap:.7rem;align-items:center;margin:1.25rem 0;padding:1rem;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 8%,var(--surface-card));color:var(--text-color-secondary)}.timeline-note i{color:var(--primary-color)}.detail-section{border-top:1px solid var(--surface-border);padding-top:1.2rem;margin-top:1.2rem}.detail-section h3{font-size:1rem;margin:0 0 .85rem}.documents{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.documents a{display:flex;align-items:center;gap:.7rem;padding:.9rem;border:1px solid var(--surface-border);border-radius:10px;color:var(--text-color);text-decoration:none}.documents a:hover{border-color:var(--primary-color)}.documents a span{flex:1}.documents a>i:first-child{color:var(--primary-color)}.feedback-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.feedback-grid div{display:flex;flex-direction:column;gap:.25rem}.feedback-grid span{font-size:.82rem;color:var(--text-color-secondary)}.feedback-grid .comment{grid-column:1/-1;padding:1rem;border-radius:10px;background:var(--surface-ground)}.comment p{margin:.3rem 0 0;line-height:1.55}.dialog-actions{display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.5rem}
        @media(max-width:760px){.page-heading{align-items:flex-start;flex-direction:column}.stats-grid{grid-template-columns:1fr}.filters{flex-direction:column}.filters select{height:42px}.documents,.feedback-grid{grid-template-columns:1fr}.feedback-grid .comment{grid-column:auto}}
    `
})
export class CandidateApplications implements OnInit {
    private readonly service = inject(CandidateApplicationService);
    private readonly confirmations = inject(ConfirmationService);
    private readonly messages = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);

    readonly statuses: ApplicationStatus[] = ['SOUMISE', 'EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE', 'ACCEPTEE', 'REFUSEE'];
    applications: CandidateApplication[] = [];
    filteredApplications: CandidateApplication[] = [];
    selectedApplication: CandidateApplication | null = null;
    search = '';
    statusFilter: ApplicationStatus | '' = '';
    loading = false;
    detailsDialog = false;

    get acceptedCount(): number { return this.applications.filter((item) => item.statut === 'ACCEPTEE').length; }
    get inProgressCount(): number { return this.applications.filter((item) => !['ACCEPTEE', 'REFUSEE'].includes(item.statut)).length; }

    ngOnInit(): void { this.loadApplications(); }

    loadApplications(): void {
        this.loading = true;
        this.service.getMine().pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); })).subscribe({
            next: (items) => { this.applications = [...items].sort((a, b) => b.dateDemande.localeCompare(a.dateDemande)); this.applyFilters(); },
            error: (error: HttpErrorResponse) => this.showError(error, 'Impossible de charger vos demandes.')
        });
    }

    applyFilters(): void {
        const term = this.normalize(this.search);
        this.filteredApplications = this.applications.filter((item) => {
            const haystack = this.normalize(`${item.referenceDemande} ${item.referenceOffre} ${item.offreTitre} ${item.offreDomaine}`);
            return (!term || haystack.includes(term)) && (!this.statusFilter || item.statut === this.statusFilter);
        });
    }

    openDetails(application: CandidateApplication): void {
        this.selectedApplication = application;
        this.detailsDialog = true;
        this.service.getMineById(application.id).pipe(finalize(() => this.cdr.markForCheck())).subscribe({ next: (item) => this.selectedApplication = item, error: () => undefined });
    }

    confirmCancel(application: CandidateApplication): void {
        this.confirmations.confirm({
            header: 'Annuler la demande',
            message: `Voulez-vous vraiment annuler la candidature ${application.referenceDemande} ?`,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Conserver',
            acceptLabel: 'Annuler la demande',
            acceptButtonProps: { severity: 'danger' },
            accept: () => this.cancel(application)
        });
    }

    statusLabel(status: ApplicationStatus): string {
        return { SOUMISE: 'Soumise', EN_ETUDE: 'En étude', TEST_TECHNIQUE: 'Test technique', ENTRETIEN_FACE_A_FACE: 'Entretien', ACCEPTEE: 'Acceptée', REFUSEE: 'Refusée' }[status];
    }

    statusSeverity(status: ApplicationStatus): 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' {
        return { SOUMISE: 'info', EN_ETUDE: 'warn', TEST_TECHNIQUE: 'secondary', ENTRETIEN_FACE_A_FACE: 'contrast', ACCEPTEE: 'success', REFUSEE: 'danger' }[status] as 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
    }

    private cancel(application: CandidateApplication): void {
        this.service.cancel(application.id).pipe(finalize(() => this.cdr.markForCheck())).subscribe({
            next: () => {
                this.applications = this.applications.filter((item) => item.id !== application.id);
                this.applyFilters();
                this.detailsDialog = false;
                this.messages.add({ severity: 'success', summary: 'Demande annulée', detail: 'Votre candidature a été retirée.' });
            },
            error: (error: HttpErrorResponse) => this.showError(error, 'Cette demande ne peut plus être annulée.')
        });
    }

    private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
    private showError(error: HttpErrorResponse, fallback: string): void { const detail = typeof error.error === 'string' ? error.error : error.error?.message || fallback; this.messages.add({ severity: 'error', summary: 'Erreur', detail }); }
}

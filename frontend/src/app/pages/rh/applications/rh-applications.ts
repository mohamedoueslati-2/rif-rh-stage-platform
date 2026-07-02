import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { ApplicationStatus, CandidateApplication } from '../../candidat/services/candidate-application.service';
import { RhApplicationService } from './rh-application.service';

interface WorkflowEvent {
    label: string;
    detail: string;
    date: string | null;
    icon: string;
    state: 'completed' | 'current' | 'possible' | 'rejected';
}

@Component({
    selector: 'app-rh-applications',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, DialogModule, InputNumberModule, InputTextModule, TableModule, TagModule, TextareaModule, TimelineModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="page-heading">
            <div><span class="eyebrow">Administration RH</span><h1>Gestion des demandes</h1><p>Analysez les candidatures et accompagnez chaque candidat dans le workflow de recrutement.</p></div>
            <p-button label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadApplications()" />
        </div>

        <div class="stats-grid">
            <div class="stat-card"><span class="stat-icon total"><i class="pi pi-inbox"></i></span><div><strong>{{ applications.length }}</strong><span>Demandes reçues</span></div></div>
            <div class="stat-card"><span class="stat-icon new"><i class="pi pi-send"></i></span><div><strong>{{ countByStatus('SOUMISE') }}</strong><span>Nouvelles</span></div></div>
            <div class="stat-card"><span class="stat-icon progress"><i class="pi pi-sync"></i></span><div><strong>{{ processingCount }}</strong><span>En traitement</span></div></div>
            <div class="stat-card"><span class="stat-icon accepted"><i class="pi pi-check-circle"></i></span><div><strong>{{ countByStatus('ACCEPTEE') }}</strong><span>Acceptées</span></div></div>
        </div>

        <div class="card">
            <div class="filters">
                <div class="filter search-filter"><label for="rh-request-search">Recherche</label><div class="search-input"><i class="pi pi-search"></i><input pInputText id="rh-request-search" [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Candidat, email, référence..." /></div></div>
                <div class="filter"><label for="rh-request-offer">Offre</label><select id="rh-request-offer" [(ngModel)]="offerFilter" (ngModelChange)="applyFilters()"><option value="">Toutes les offres</option>@for (offer of offerOptions; track offer.id) { <option [value]="offer.id">{{ offer.reference }} — {{ offer.title }}</option> }</select></div>
                <div class="filter"><label for="rh-request-status">Statut</label><select id="rh-request-status" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()"><option value="">Tous les statuts</option>@for (status of statuses; track status) { <option [value]="status">{{ statusLabel(status) }}</option> }</select></div>
                <p-button label="Réinitialiser" icon="pi pi-filter-slash" severity="secondary" [text]="true" [disabled]="!search && !offerFilter && !statusFilter" (onClick)="resetFilters()" />
            </div>

            <p-table [value]="filteredApplications" [loading]="loading" [rows]="10" [paginator]="true" [rowsPerPageOptions]="[10, 20, 30]" [tableStyle]="{ 'min-width': '76rem' }" dataKey="id" currentPageReportTemplate="{first} à {last} sur {totalRecords} demandes" [showCurrentPageReport]="true">
                <ng-template #header><tr><th pSortableColumn="referenceDemande">Demande <p-sortIcon field="referenceDemande" /></th><th pSortableColumn="candidatNom">Candidat <p-sortIcon field="candidatNom" /></th><th pSortableColumn="offreTitre">Offre <p-sortIcon field="offreTitre" /></th><th pSortableColumn="dateDemande">Date <p-sortIcon field="dateDemande" /></th><th pSortableColumn="statut">Statut <p-sortIcon field="statut" /></th><th>Documents</th><th style="width:8rem">Action</th></tr></ng-template>
                <ng-template #body let-application>
                    <tr>
                        <td><span class="reference">{{ application.referenceDemande }}</span></td>
                        <td><div class="candidate-cell"><span class="avatar">{{ initials(application) }}</span><div><strong>{{ application.candidatPrenom }} {{ application.candidatNom }}</strong><small>{{ application.candidatEmail }}</small></div></div></td>
                        <td><strong>{{ application.offreTitre }}</strong><small>{{ application.referenceOffre }} · {{ application.offreDomaine }}</small></td>
                        <td>{{ application.dateDemande | date: 'dd/MM/yyyy' }}<small>{{ application.dateDemande | date: 'HH:mm' }}</small></td>
                        <td><p-tag [value]="statusLabel(application.statut)" [severity]="statusSeverity(application.statut)" /></td>
                        <td><div class="document-links"><a [href]="application.cvUrl" target="_blank" rel="noopener" title="CV"><i class="pi pi-file-pdf"></i></a>@if (application.lettreMotivationUrl) { <a [href]="application.lettreMotivationUrl" target="_blank" rel="noopener" title="Lettre"><i class="pi pi-file-edit"></i></a> }</div></td>
                        <td><p-button label="Traiter" icon="pi pi-arrow-right" size="small" [outlined]="true" (onClick)="openDetails(application)" /></td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage><tr><td colspan="7"><div class="empty-state"><i class="pi pi-inbox"></i><strong>Aucune demande trouvée</strong><span>{{ applications.length ? 'Modifiez les filtres sélectionnés.' : 'Aucune candidature n’a encore été déposée.' }}</span></div></td></tr></ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="detailsDialog" [modal]="true" [style]="{ width: '1040px' }" [breakpoints]="{ '1100px': '96vw' }" header="Traitement de la candidature" (onHide)="resetEditor()">
            @if (selectedApplication) {
                <div class="detail-layout">
                    <section class="candidate-panel">
                        <div class="profile-heading"><span class="large-avatar">{{ initials(selectedApplication) }}</span><div><span class="reference">{{ selectedApplication.referenceDemande }}</span><h2>{{ selectedApplication.candidatPrenom }} {{ selectedApplication.candidatNom }}</h2><a [href]="'mailto:' + selectedApplication.candidatEmail">{{ selectedApplication.candidatEmail }}</a></div></div>
                        <div class="profile-grid"><div><span>Spécialité</span><strong>{{ selectedApplication.candidatSpecialite || 'Non renseignée' }}</strong></div><div><span>Niveau d’étude</span><strong>{{ selectedApplication.candidatNiveauEtude || 'Non renseigné' }}</strong></div></div>
                        <div class="offer-summary"><span>Candidature pour</span><h3>{{ selectedApplication.offreTitre }}</h3><small>{{ selectedApplication.referenceOffre }} · {{ selectedApplication.offreDomaine }}</small></div>
                        <div class="documents"><a [href]="selectedApplication.cvUrl" target="_blank" rel="noopener"><i class="pi pi-file-pdf"></i><span>Consulter le CV</span><i class="pi pi-external-link"></i></a>@if (selectedApplication.lettreMotivationUrl) { <a [href]="selectedApplication.lettreMotivationUrl" target="_blank" rel="noopener"><i class="pi pi-file-edit"></i><span>Lettre de motivation</span><i class="pi pi-external-link"></i></a> }</div>

                        <div class="editor-section"><h3>Commentaire RH</h3><textarea pTextarea [(ngModel)]="comment" rows="4" placeholder="Ajoutez une appréciation sur le profil..."></textarea><p-button label="Enregistrer le commentaire" icon="pi pi-save" size="small" [outlined]="true" [loading]="savingComment" [disabled]="!comment.trim()" (onClick)="saveComment()" /></div>
                        @if (canEditScore(selectedApplication.statut)) {
                            <div class="editor-section"><h3>Résultat du test technique</h3><div class="score-editor"><p-inputnumber [(ngModel)]="testScore" [min]="0" [max]="100" suffix=" / 100" [showButtons]="true" /><p-button label="Enregistrer la note" icon="pi pi-save" size="small" [loading]="savingScore" [disabled]="testScore === null || testScore < 0 || testScore > 100" (onClick)="saveScore()" /></div></div>
                        }
                    </section>

                    <section class="workflow-panel">
                        <div class="workflow-heading"><div><span>Workflow</span><h2>Parcours de la demande</h2></div><p-tag [value]="statusLabel(selectedApplication.statut)" [severity]="statusSeverity(selectedApplication.statut)" /></div>
                        <p-timeline [value]="workflowEvents" styleClass="request-timeline">
                            <ng-template #marker let-event><span class="timeline-marker" [class]="event.state"><i [class]="event.icon"></i></span></ng-template>
                            <ng-template #content let-event><div class="timeline-content" [class.muted]="event.state === 'possible'"><strong>{{ event.label }}</strong><span>{{ event.detail }}</span>@if (event.date) { <small>{{ event.date | date: 'dd/MM/yyyy à HH:mm' }}</small> }</div></ng-template>
                        </p-timeline>

                        @if (nextStatuses.length) {
                            <div class="status-editor"><h3>Faire avancer la demande</h3><p>Choisissez uniquement une transition autorisée par le workflow.</p><select [(ngModel)]="nextStatus"><option value="">Sélectionner le nouveau statut</option>@for (status of nextStatuses; track status) { <option [value]="status">{{ statusLabel(status) }}</option> }</select><p-button label="Mettre à jour le statut" icon="pi pi-check" [loading]="savingStatus" [disabled]="!nextStatus" (onClick)="saveStatus()" /></div>
                        } @else {
                            <div class="terminal-state" [class.rejected]="selectedApplication.statut === 'REFUSEE'"><i [class]="selectedApplication.statut === 'ACCEPTEE' ? 'pi pi-check-circle' : 'pi pi-ban'"></i><div><strong>Demande clôturée</strong><span>Ce statut est définitif et ne peut plus être modifié.</span></div></div>
                        }
                    </section>
                </div>
            }
        </p-dialog>
    `,
    styles: `
        .page-heading{display:flex;justify-content:space-between;gap:2rem;align-items:center;margin-bottom:1.5rem}.eyebrow{color:var(--primary-color);font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}.page-heading h1{margin:.35rem 0;font-size:2rem}.page-heading p{margin:0;color:var(--text-color-secondary)}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.25rem}.stat-card{background:var(--surface-card);border:1px solid var(--surface-border);border-radius:16px;padding:1rem;display:flex;align-items:center;gap:.85rem}.stat-icon{width:42px;height:42px;border-radius:50%;display:grid;place-items:center}.stat-icon.total{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.stat-icon.new{color:var(--blue-500);background:color-mix(in srgb,var(--blue-500) 12%,transparent)}.stat-icon.progress{color:var(--orange-500);background:color-mix(in srgb,var(--orange-500) 12%,transparent)}.stat-icon.accepted{color:var(--green-500);background:color-mix(in srgb,var(--green-500) 12%,transparent)}.stat-card div{display:flex;flex-direction:column}.stat-card strong{font-size:1.4rem}.stat-card div span{font-size:.82rem;color:var(--text-color-secondary)}
        .filters{display:grid;grid-template-columns:1.5fr 1.35fr 1fr auto;gap:1rem;align-items:end;margin-bottom:1.25rem}.filter{display:flex;flex-direction:column;gap:.4rem}.filter label{font-size:.84rem;font-weight:600}.filter select,.filter input{width:100%;height:42px;border:1px solid var(--surface-border);border-radius:8px;background:var(--surface-card);color:var(--text-color);padding:0 .75rem}.search-input{position:relative}.search-input i{position:absolute;left:.8rem;top:50%;transform:translateY(-50%);color:var(--text-color-secondary)}.search-input input{padding-left:2.3rem}.reference{color:var(--primary-color);font-weight:700;font-size:.8rem}.candidate-cell{display:flex;align-items:center;gap:.7rem}.avatar,.large-avatar{border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--primary-color) 14%,var(--surface-card));color:var(--primary-color);font-weight:700}.avatar{width:34px;height:34px;font-size:.75rem}.large-avatar{width:58px;height:58px;font-size:1rem}.candidate-cell strong,.candidate-cell small,td>strong,td>small{display:block}.candidate-cell small,td>small{color:var(--text-color-secondary);margin-top:.2rem}.document-links{display:flex;gap:.45rem}.document-links a{width:34px;height:34px;border-radius:50%;border:1px solid var(--surface-border);display:grid;place-items:center;color:var(--primary-color);text-decoration:none}.empty-state{min-height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7rem;color:var(--text-color-secondary)}.empty-state i{font-size:2rem;color:var(--primary-color)}
        .detail-layout{display:grid;grid-template-columns:1.08fr .92fr;gap:1.6rem}.candidate-panel{padding-right:1.5rem;border-right:1px solid var(--surface-border)}.profile-heading{display:flex;gap:1rem;align-items:center}.profile-heading h2{margin:.25rem 0;font-size:1.35rem}.profile-heading a{color:var(--text-color-secondary)}.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.25rem 0}.profile-grid div{display:flex;flex-direction:column;gap:.25rem}.profile-grid span,.offer-summary>span,.workflow-heading span{font-size:.8rem;color:var(--text-color-secondary)}.offer-summary{padding:1rem;border-radius:12px;background:var(--surface-ground)}.offer-summary h3{margin:.35rem 0}.offer-summary small{color:var(--text-color-secondary)}.documents{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-top:1rem}.documents a{display:flex;align-items:center;gap:.55rem;border:1px solid var(--surface-border);padding:.75rem;border-radius:9px;text-decoration:none;color:var(--text-color)}.documents a span{flex:1}.documents a>i:first-child{color:var(--primary-color)}.editor-section{border-top:1px solid var(--surface-border);padding-top:1rem;margin-top:1rem;display:flex;flex-direction:column;align-items:flex-start;gap:.7rem}.editor-section h3{font-size:.95rem;margin:0}.editor-section textarea{width:100%;resize:vertical}.score-editor{display:flex;gap:.7rem;align-items:center;flex-wrap:wrap}
        .workflow-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1rem}.workflow-heading h2{font-size:1.25rem;margin:.25rem 0}.timeline-marker{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;border:2px solid var(--surface-border);background:var(--surface-card);color:var(--text-color-secondary)}.timeline-marker.completed{background:var(--green-500);border-color:var(--green-500);color:white}.timeline-marker.current{background:var(--primary-color);border-color:var(--primary-color);color:white;box-shadow:0 0 0 5px color-mix(in srgb,var(--primary-color) 15%,transparent)}.timeline-marker.rejected{background:var(--red-500);border-color:var(--red-500);color:white}.timeline-content{display:flex;flex-direction:column;gap:.2rem;padding:0 0 1rem .25rem}.timeline-content span,.timeline-content small{color:var(--text-color-secondary);font-size:.82rem}.timeline-content.muted{opacity:.58}.status-editor{border-top:1px solid var(--surface-border);padding-top:1.25rem}.status-editor h3{margin:0}.status-editor p{color:var(--text-color-secondary);font-size:.85rem}.status-editor select{width:100%;height:42px;border:1px solid var(--surface-border);border-radius:8px;background:var(--surface-card);color:var(--text-color);padding:0 .75rem;margin-bottom:.75rem}.terminal-state{display:flex;gap:.8rem;padding:1rem;border-radius:12px;background:color-mix(in srgb,var(--green-500) 11%,var(--surface-card));color:var(--green-600)}.terminal-state.rejected{background:color-mix(in srgb,var(--red-500) 11%,var(--surface-card));color:var(--red-600)}.terminal-state i{font-size:1.4rem}.terminal-state div{display:flex;flex-direction:column}.terminal-state span{font-size:.82rem;margin-top:.2rem}
        @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.filters{grid-template-columns:1fr 1fr}.detail-layout{grid-template-columns:1fr}.candidate-panel{padding-right:0;border-right:0;border-bottom:1px solid var(--surface-border);padding-bottom:1.25rem}}@media(max-width:700px){.page-heading{flex-direction:column;align-items:flex-start}.stats-grid,.filters,.profile-grid,.documents{grid-template-columns:1fr}}
    `
})
export class RhApplications implements OnInit {
    private readonly service = inject(RhApplicationService);
    private readonly messages = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);

    readonly statuses: ApplicationStatus[] = ['SOUMISE', 'EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE', 'ACCEPTEE', 'REFUSEE'];
    private readonly transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
        SOUMISE: ['EN_ETUDE', 'REFUSEE'],
        EN_ETUDE: ['TEST_TECHNIQUE', 'REFUSEE'],
        TEST_TECHNIQUE: ['ENTRETIEN_FACE_A_FACE', 'ACCEPTEE', 'REFUSEE'],
        ENTRETIEN_FACE_A_FACE: ['ACCEPTEE', 'REFUSEE'],
        ACCEPTEE: [],
        REFUSEE: []
    };

    applications: CandidateApplication[] = [];
    filteredApplications: CandidateApplication[] = [];
    selectedApplication: CandidateApplication | null = null;
    offerOptions: { id: string; reference: string; title: string }[] = [];
    search = '';
    offerFilter = '';
    statusFilter: ApplicationStatus | '' = '';
    loading = false;
    detailsDialog = false;
    nextStatus: ApplicationStatus | '' = '';
    comment = '';
    testScore: number | null = null;
    savingStatus = false;
    savingComment = false;
    savingScore = false;

    get nextStatuses(): ApplicationStatus[] { return this.selectedApplication ? this.transitions[this.selectedApplication.statut] : []; }
    get processingCount(): number { return this.applications.filter((item) => ['EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE'].includes(item.statut)).length; }
    get workflowEvents(): WorkflowEvent[] { return this.selectedApplication ? this.buildTimeline(this.selectedApplication) : []; }

    ngOnInit(): void { this.loadApplications(); }

    loadApplications(): void {
        this.loading = true;
        this.service.getAll().pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); })).subscribe({
            next: (items) => {
                this.applications = [...items].sort((a, b) => b.dateDemande.localeCompare(a.dateDemande));
                const offers = new Map<string, { id: string; reference: string; title: string }>();
                items.forEach((item) => offers.set(item.offreStageId, { id: item.offreStageId, reference: item.referenceOffre, title: item.offreTitre }));
                this.offerOptions = [...offers.values()].sort((a, b) => a.reference.localeCompare(b.reference));
                this.applyFilters();
            },
            error: (error: HttpErrorResponse) => this.showError(error, 'Impossible de charger les demandes.')
        });
    }

    applyFilters(): void {
        const term = this.normalize(this.search);
        this.filteredApplications = this.applications.filter((item) => {
            const haystack = this.normalize(`${item.referenceDemande} ${item.candidatNom} ${item.candidatPrenom} ${item.candidatEmail} ${item.offreTitre} ${item.referenceOffre}`);
            return (!term || haystack.includes(term)) && (!this.offerFilter || item.offreStageId === this.offerFilter) && (!this.statusFilter || item.statut === this.statusFilter);
        });
    }

    resetFilters(): void { this.search = ''; this.offerFilter = ''; this.statusFilter = ''; this.applyFilters(); }

    openDetails(application: CandidateApplication): void {
        this.selectedApplication = application;
        this.prepareEditor(application);
        this.detailsDialog = true;
        this.service.getById(application.id).pipe(finalize(() => this.cdr.markForCheck())).subscribe({
            next: (item) => { this.selectedApplication = item; this.prepareEditor(item); },
            error: (error: HttpErrorResponse) => this.showError(error, 'Impossible de charger le détail de la demande.')
        });
    }

    saveStatus(): void {
        if (!this.selectedApplication || !this.nextStatus) return;
        this.savingStatus = true;
        this.service.updateStatus(this.selectedApplication.id, this.nextStatus).pipe(finalize(() => { this.savingStatus = false; this.cdr.markForCheck(); })).subscribe({
            next: (updated) => { this.replaceApplication(updated); this.nextStatus = ''; this.messages.add({ severity: 'success', summary: 'Statut mis à jour', detail: `La demande est maintenant « ${this.statusLabel(updated.statut)} ».` }); },
            error: (error: HttpErrorResponse) => this.showError(error, 'La transition de statut a été refusée.')
        });
    }

    saveComment(): void {
        if (!this.selectedApplication || !this.comment.trim()) return;
        this.savingComment = true;
        this.service.updateComment(this.selectedApplication.id, this.comment.trim()).pipe(finalize(() => { this.savingComment = false; this.cdr.markForCheck(); })).subscribe({
            next: (updated) => { this.replaceApplication(updated); this.messages.add({ severity: 'success', summary: 'Commentaire enregistré', detail: 'Le commentaire RH a été mis à jour.' }); },
            error: (error: HttpErrorResponse) => this.showError(error, 'Impossible d’enregistrer le commentaire.')
        });
    }

    saveScore(): void {
        if (!this.selectedApplication || this.testScore === null || this.testScore < 0 || this.testScore > 100) return;
        this.savingScore = true;
        this.service.updateTestScore(this.selectedApplication.id, this.testScore).pipe(finalize(() => { this.savingScore = false; this.cdr.markForCheck(); })).subscribe({
            next: (updated) => { this.replaceApplication(updated); this.messages.add({ severity: 'success', summary: 'Note enregistrée', detail: `Résultat du test : ${updated.noteTestTechnique}/100.` }); },
            error: (error: HttpErrorResponse) => this.showError(error, 'Impossible d’enregistrer la note du test.')
        });
    }

    countByStatus(status: ApplicationStatus): number { return this.applications.filter((item) => item.statut === status).length; }
    canEditScore(status: ApplicationStatus): boolean { return status === 'TEST_TECHNIQUE' || status === 'ENTRETIEN_FACE_A_FACE'; }
    initials(item: CandidateApplication): string { return `${item.candidatPrenom?.charAt(0) || ''}${item.candidatNom?.charAt(0) || ''}`.toUpperCase(); }
    statusLabel(status: ApplicationStatus): string { return { SOUMISE: 'Soumise', EN_ETUDE: 'En étude', TEST_TECHNIQUE: 'Test technique', ENTRETIEN_FACE_A_FACE: 'Entretien', ACCEPTEE: 'Acceptée', REFUSEE: 'Refusée' }[status]; }
    statusSeverity(status: ApplicationStatus): 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' { return { SOUMISE: 'info', EN_ETUDE: 'warn', TEST_TECHNIQUE: 'secondary', ENTRETIEN_FACE_A_FACE: 'contrast', ACCEPTEE: 'success', REFUSEE: 'danger' }[status] as 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'; }

    resetEditor(): void { this.nextStatus = ''; }

    private prepareEditor(item: CandidateApplication): void { this.comment = item.commentaireRh || ''; this.testScore = item.noteTestTechnique; this.nextStatus = ''; }

    private replaceApplication(updated: CandidateApplication): void {
        this.applications = this.applications.map((item) => item.id === updated.id ? updated : item);
        this.selectedApplication = updated;
        this.prepareEditor(updated);
        this.applyFilters();
    }

    private buildTimeline(item: CandidateApplication): WorkflowEvent[] {
        const events: WorkflowEvent[] = [{ label: 'Candidature soumise', detail: 'Le candidat a transmis son dossier.', date: item.dateDemande, icon: 'pi pi-send', state: item.statut === 'SOUMISE' ? 'current' : 'completed' }];
        if (item.statut === 'REFUSEE') events.push({ label: 'Candidature refusée', detail: 'Le traitement de cette candidature est terminé.', date: item.updatedAt, icon: 'pi pi-times', state: 'rejected' });
        else if (item.statut !== 'SOUMISE') events.push({ label: this.statusLabel(item.statut), detail: item.statut === 'ACCEPTEE' ? 'La candidature a été retenue.' : 'Étape actuelle du traitement.', date: item.updatedAt, icon: item.statut === 'ACCEPTEE' ? 'pi pi-check' : 'pi pi-sync', state: 'current' });
        this.transitions[item.statut].forEach((status) => events.push({ label: this.statusLabel(status), detail: status === 'REFUSEE' ? 'Clôturer et refuser la candidature.' : 'Transition disponible.', date: null, icon: status === 'REFUSEE' ? 'pi pi-times' : 'pi pi-arrow-down', state: 'possible' }));
        return events;
    }

    private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
    private showError(error: HttpErrorResponse, fallback: string): void { const detail = typeof error.error === 'string' ? error.error : error.error?.message || fallback; this.messages.add({ severity: 'error', summary: 'Erreur', detail }); }
}

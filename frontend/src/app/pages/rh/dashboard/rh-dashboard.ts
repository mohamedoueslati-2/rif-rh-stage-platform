import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { finalize, forkJoin } from 'rxjs';
import { ApplicationStatus, CandidateApplication } from '../../candidat/services/candidate-application.service';
import { InternshipOffer } from '../../landing/services/public-offer.service';
import { RhApplicationService } from '../applications/rh-application.service';
import { RhOfferService } from '../offers/rh-offer.service';

@Component({
    selector: 'app-rh-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterLink, ButtonModule, ChartModule, TagModule],
    template: `
        <section class="welcome-card">
            <div><span class="eyebrow">Tableau de bord RH</span><h1>Pilotez vos recrutements en un coup d’œil</h1><p>Suivez les offres actives, les nouveaux dossiers et l’avancement du pipeline candidat.</p><div class="welcome-actions"><p-button label="Nouvelle offre" icon="pi pi-plus" routerLink="/rh/offres" /><p-button label="Traiter les demandes" icon="pi pi-arrow-right" severity="secondary" [outlined]="true" routerLink="/rh/demandes" /></div></div>
            <div class="welcome-visual"><span class="visual-ring"><i class="pi pi-chart-line"></i></span><div><strong>{{ applications.length }}</strong><span>candidatures suivies</span></div></div>
        </section>

        @if (errorMessage) { <div class="error-banner"><i class="pi pi-exclamation-circle"></i><span>{{ errorMessage }}</span><button type="button" (click)="loadDashboard()">Réessayer</button></div> }

        <div class="stats-grid">
            <article class="stat-card"><span class="stat-icon indigo"><i class="pi pi-briefcase"></i></span><div><span>Offres disponibles</span><strong>{{ offers.length }}</strong><small>Opportunités publiées</small></div></article>
            <article class="stat-card"><span class="stat-icon blue"><i class="pi pi-inbox"></i></span><div><span>Total candidatures</span><strong>{{ applications.length }}</strong><small>{{ newApplications }} nouvelle{{ newApplications > 1 ? 's' : '' }}</small></div></article>
            <article class="stat-card"><span class="stat-icon amber"><i class="pi pi-sync"></i></span><div><span>En traitement</span><strong>{{ processingApplications }}</strong><small>Étude, test ou entretien</small></div></article>
            <article class="stat-card"><span class="stat-icon green"><i class="pi pi-check-circle"></i></span><div><span>Taux d’acceptation</span><strong>{{ acceptanceRate }}%</strong><small>{{ acceptedApplications }} candidature{{ acceptedApplications > 1 ? 's' : '' }} retenue{{ acceptedApplications > 1 ? 's' : '' }}</small></div></article>
        </div>

        <div class="dashboard-grid">
            <article class="card chart-card pipeline-card"><div class="card-heading"><div><span>Pipeline</span><h2>Répartition des candidatures</h2></div><a routerLink="/rh/demandes">Voir tout <i class="pi pi-arrow-right"></i></a></div>@if (applications.length) { <div class="doughnut-layout"><p-chart type="doughnut" [data]="statusChartData" [options]="doughnutOptions" /><div class="chart-legend">@for (item of statusSummary; track item.status) { <div><span class="legend-dot" [style.background]="item.color"></span><span>{{ item.label }}</span><strong>{{ item.count }}</strong></div> }</div></div> } @else { <div class="empty-chart"><i class="pi pi-chart-pie"></i><span>Les statistiques apparaîtront dès la première candidature.</span></div> }</article>
            <article class="card chart-card"><div class="card-heading"><div><span>Performance</span><h2>Candidatures par offre</h2></div></div>@if (offers.length || applications.length) { <p-chart type="bar" [data]="offerChartData" [options]="barOptions" /> } @else { <div class="empty-chart"><i class="pi pi-chart-bar"></i><span>Publiez une offre pour démarrer le suivi.</span></div> }</article>
        </div>

        <article class="card recent-card">
            <div class="card-heading"><div><span>Activité récente</span><h2>Dernières candidatures</h2></div><a routerLink="/rh/demandes">Gérer les demandes <i class="pi pi-arrow-right"></i></a></div>
            @if (recentApplications.length) { <div class="recent-list">@for (application of recentApplications; track application.id) { <a class="recent-item" routerLink="/rh/demandes"><span class="avatar">{{ initials(application) }}</span><div class="candidate"><strong>{{ application.candidatPrenom }} {{ application.candidatNom }}</strong><small>{{ application.candidatEmail }}</small></div><div class="offer"><span>{{ application.offreTitre }}</span><small>{{ application.referenceOffre }}</small></div><time>{{ application.dateDemande | date: 'dd MMM, HH:mm' }}</time><p-tag [value]="statusLabel(application.statut)" [severity]="statusSeverity(application.statut)" /></a> }</div> } @else { <div class="empty-list"><i class="pi pi-inbox"></i><strong>Aucune candidature récente</strong><span>Les nouveaux dossiers s’afficheront ici automatiquement.</span></div> }
        </article>
    `,
    styles: `
        :host{display:block}.welcome-card{position:relative;overflow:hidden;min-height:190px;margin-bottom:1.4rem;padding:clamp(1.5rem,3vw,2.25rem);display:flex;align-items:center;justify-content:space-between;gap:2rem;border:1px solid var(--surface-border);border-radius:20px;color:var(--text-color);background:var(--surface-card);box-shadow:0 10px 34px rgba(15,23,42,.055)}.welcome-card:before{content:'';position:absolute;inset:0 auto 0 0;width:5px;background:var(--primary-color)}.welcome-card:after{content:'';position:absolute;width:240px;height:240px;right:-105px;top:-130px;border-radius:50%;background:color-mix(in srgb,var(--primary-color),transparent 94%)}.eyebrow{color:var(--primary-color);text-transform:uppercase;letter-spacing:.13em;font-size:.7rem;font-weight:800}.welcome-card h1{max-width:680px;margin:.55rem 0;font-size:clamp(1.7rem,2.7vw,2.35rem);line-height:1.12}.welcome-card p{max-width:630px;margin:0;color:var(--text-color-secondary);line-height:1.6}.welcome-actions{display:flex;gap:.75rem;margin-top:1.35rem}.welcome-visual{z-index:1;min-width:220px;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:center;flex-direction:row;gap:1rem;border:1px solid color-mix(in srgb,var(--primary-color),transparent 82%);border-radius:16px;background:color-mix(in srgb,var(--primary-color),var(--surface-card) 95%);text-align:left}.visual-ring{width:52px;height:52px;display:grid;place-items:center;flex:0 0 auto;border-radius:14px;background:color-mix(in srgb,var(--primary-color),transparent 86%);color:var(--primary-color);font-size:1.25rem}.welcome-visual strong,.welcome-visual span{display:block}.welcome-visual strong{font-size:1.65rem;line-height:1}.welcome-visual div span{margin-top:.3rem;color:var(--text-color-secondary);font-size:.78rem}
        .error-banner{margin-bottom:1rem;padding:.8rem 1rem;display:flex;align-items:center;gap:.7rem;border-radius:10px;color:var(--red-600);background:color-mix(in srgb,var(--red-500),transparent 90%)}.error-banner span{flex:1}.error-banner button{border:0;background:transparent;color:inherit;font-weight:700;cursor:pointer}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.4rem}.stat-card{padding:1.15rem;display:flex;align-items:center;gap:1rem;border:1px solid var(--surface-border);border-radius:17px;background:var(--surface-card);box-shadow:0 8px 25px rgba(15,23,42,.035)}.stat-icon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border-radius:14px;font-size:1.2rem}.stat-icon.indigo{color:#6366f1;background:rgba(99,102,241,.12)}.stat-icon.blue{color:#0ea5e9;background:rgba(14,165,233,.12)}.stat-icon.amber{color:#f59e0b;background:rgba(245,158,11,.12)}.stat-icon.green{color:#10b981;background:rgba(16,185,129,.12)}.stat-card div>span,.stat-card small{display:block;color:var(--text-color-secondary)}.stat-card div>span{font-size:.78rem;font-weight:600}.stat-card strong{display:block;margin:.15rem 0;font-size:1.65rem}.stat-card small{font-size:.72rem}
        .dashboard-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:1.4rem;margin-bottom:1.4rem}.chart-card{min-height:370px}.card-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem}.card-heading span{color:var(--primary-color);font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}.card-heading h2{margin:.25rem 0;font-size:1.2rem}.card-heading a{color:var(--primary-color);font-size:.82rem;font-weight:650;text-decoration:none}.doughnut-layout{display:grid;grid-template-columns:minmax(190px,.85fr) 1fr;align-items:center;gap:1rem}.chart-legend{display:flex;flex-direction:column;gap:.7rem}.chart-legend>div{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.55rem;font-size:.8rem}.legend-dot{width:9px;height:9px;border-radius:50%}.empty-chart{min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7rem;text-align:center;color:var(--text-color-secondary)}.empty-chart i{font-size:2rem;color:var(--primary-color)}
        .recent-card{padding-bottom:.75rem}.recent-list{display:flex;flex-direction:column}.recent-item{padding:.85rem 0;display:grid;grid-template-columns:auto 1.1fr 1fr auto auto;align-items:center;gap:1rem;border-top:1px solid var(--surface-border);color:var(--text-color);text-decoration:none}.avatar{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color),transparent 87%);font-size:.76rem;font-weight:800}.candidate strong,.candidate small,.offer span,.offer small{display:block}.candidate small,.offer small,.recent-item time{color:var(--text-color-secondary);font-size:.75rem}.empty-list{min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;color:var(--text-color-secondary)}.empty-list i{font-size:1.8rem;color:var(--primary-color)}
        @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid{grid-template-columns:1fr}}@media(max-width:760px){.welcome-card{align-items:flex-start}.welcome-visual{display:none}.welcome-actions{align-items:stretch;flex-direction:column}.stats-grid{grid-template-columns:1fr}.doughnut-layout{grid-template-columns:1fr}.recent-item{grid-template-columns:auto 1fr auto}.recent-item .offer,.recent-item time{display:none}}
    `
})
export class RhDashboard implements OnInit {
    private readonly offerService = inject(RhOfferService);
    private readonly applicationService = inject(RhApplicationService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly colors = ['#6366f1', '#f59e0b', '#8b5cf6', '#0ea5e9', '#10b981', '#ef4444'];
    private readonly statuses: ApplicationStatus[] = ['SOUMISE', 'EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE', 'ACCEPTEE', 'REFUSEE'];

    offers: InternshipOffer[] = [];
    applications: CandidateApplication[] = [];
    loading = false;
    errorMessage = '';
    statusChartData: any;
    offerChartData: any;
    readonly doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } };
    readonly barOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(148,163,184,.14)' } }, y: { grid: { display: false } } } };

    get newApplications(): number { return this.count('SOUMISE'); }
    get processingApplications(): number { return this.applications.filter((item) => ['EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE'].includes(item.statut)).length; }
    get acceptedApplications(): number { return this.count('ACCEPTEE'); }
    get acceptanceRate(): number { const closed = this.count('ACCEPTEE') + this.count('REFUSEE'); return closed ? Math.round(this.acceptedApplications * 100 / closed) : 0; }
    get recentApplications(): CandidateApplication[] { return this.applications.slice(0, 5); }
    get statusSummary() { return this.statuses.map((status, index) => ({ status, label: this.statusLabel(status), count: this.count(status), color: this.colors[index] })); }

    ngOnInit(): void { this.loadDashboard(); }

    loadDashboard(): void {
        this.loading = true; this.errorMessage = '';
        forkJoin({ offers: this.offerService.getAll(), applications: this.applicationService.getAll() }).pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); })).subscribe({
            next: ({ offers, applications }) => { this.offers = offers; this.applications = [...applications].sort((a, b) => b.dateDemande.localeCompare(a.dateDemande)); this.buildCharts(); },
            error: (error: HttpErrorResponse) => this.errorMessage = error.status === 0 ? 'Le backend est indisponible.' : 'Impossible de charger les statistiques.'
        });
    }

    count(status: ApplicationStatus): number { return this.applications.filter((item) => item.statut === status).length; }
    initials(item: CandidateApplication): string { return `${item.candidatPrenom?.charAt(0) || ''}${item.candidatNom?.charAt(0) || ''}`.toUpperCase(); }
    statusLabel(status: ApplicationStatus): string { return { SOUMISE: 'Soumise', EN_ETUDE: 'En étude', TEST_TECHNIQUE: 'Test technique', ENTRETIEN_FACE_A_FACE: 'Entretien', ACCEPTEE: 'Acceptée', REFUSEE: 'Refusée' }[status]; }
    statusSeverity(status: ApplicationStatus): 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' { return { SOUMISE: 'info', EN_ETUDE: 'warn', TEST_TECHNIQUE: 'secondary', ENTRETIEN_FACE_A_FACE: 'contrast', ACCEPTEE: 'success', REFUSEE: 'danger' }[status] as any; }

    private buildCharts(): void {
        this.statusChartData = { labels: this.statuses.map((status) => this.statusLabel(status)), datasets: [{ data: this.statuses.map((status) => this.count(status)), backgroundColor: this.colors, borderWidth: 0, hoverOffset: 6 }] };
        const counts = new Map<string, { title: string; count: number }>();
        this.offers.forEach((offer) => counts.set(offer.id, { title: offer.titre, count: 0 }));
        this.applications.forEach((item) => { const current = counts.get(item.offreStageId) || { title: item.offreTitre, count: 0 }; current.count++; counts.set(item.offreStageId, current); });
        const top = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 6);
        this.offerChartData = { labels: top.map((item) => item.title.length > 25 ? `${item.title.slice(0, 25)}…` : item.title), datasets: [{ data: top.map((item) => item.count), backgroundColor: '#6366f1', borderRadius: 7, barThickness: 18 }] };
    }
}

import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { finalize, forkJoin } from 'rxjs';
import { InternshipOffer, PublicOfferService } from '../../landing/services/public-offer.service';
import { ApplicationStatus, CandidateApplication, CandidateApplicationService } from '../services/candidate-application.service';

@Component({
    selector: 'app-candidate-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterLink, ButtonModule, ChartModule, TagModule],
    template: `
        <section class="hero-card">
            <div class="hero-copy"><span class="eyebrow">Espace candidat</span><h1>Construisez la prochaine étape de votre parcours</h1><p>Explorez les opportunités, suivez vos candidatures et restez prêt pour chaque nouvelle étape.</p><div class="hero-actions"><p-button label="Découvrir les offres" icon="pi pi-search" routerLink="/candidat/offres" /><p-button label="Suivre mes demandes" icon="pi pi-arrow-right" severity="secondary" [outlined]="true" routerLink="/candidat/mes-demandes" /></div></div>
            <div class="hero-orbit"><div class="orbit-main"><i class="pi pi-send"></i><strong>{{ applications.length }}</strong><span>candidatures</span></div><span class="orbit-dot one"><i class="pi pi-briefcase"></i></span><span class="orbit-dot two"><i class="pi pi-check"></i></span></div>
        </section>

        @if (errorMessage) { <div class="error-banner"><i class="pi pi-exclamation-circle"></i><span>{{ errorMessage }}</span><button type="button" (click)="loadDashboard()">Réessayer</button></div> }

        <div class="stats-grid">
            <article class="stat-card"><span class="stat-icon indigo"><i class="pi pi-sparkles"></i></span><div><span>Offres disponibles</span><strong>{{ offers.length }}</strong><small>À explorer maintenant</small></div></article>
            <article class="stat-card"><span class="stat-icon blue"><i class="pi pi-send"></i></span><div><span>Mes candidatures</span><strong>{{ applications.length }}</strong><small>Dossiers envoyés</small></div></article>
            <article class="stat-card"><span class="stat-icon amber"><i class="pi pi-clock"></i></span><div><span>En cours</span><strong>{{ activeApplications }}</strong><small>Demandes en traitement</small></div></article>
            <article class="stat-card"><span class="stat-icon green"><i class="pi pi-trophy"></i></span><div><span>Acceptées</span><strong>{{ acceptedApplications }}</strong><small>Opportunités obtenues</small></div></article>
        </div>

        <div class="main-grid">
            <article class="card activity-card"><div class="card-heading"><div><span>Mon activité</span><h2>Candidatures des 6 derniers mois</h2></div><a routerLink="/candidat/mes-demandes">Historique <i class="pi pi-arrow-right"></i></a></div>@if (applications.length) { <p-chart type="line" [data]="activityChartData" [options]="lineOptions" /> } @else { <div class="empty-chart"><i class="pi pi-chart-line"></i><strong>Votre parcours commence ici</strong><span>Postulez à une offre pour voir votre activité évoluer.</span></div> }</article>
            <article class="card status-card"><div class="card-heading"><div><span>Progression</span><h2>État de mes demandes</h2></div></div>@if (applications.length) { <div class="doughnut-wrap"><p-chart type="doughnut" [data]="statusChartData" [options]="doughnutOptions" /><div class="center-value"><strong>{{ applications.length }}</strong><span>Total</span></div></div><div class="mini-legend">@for (item of nonEmptyStatuses; track item.status) { <div><span [style.background]="item.color"></span><small>{{ item.label }}</small><strong>{{ item.count }}</strong></div> }</div> } @else { <div class="empty-chart compact"><i class="pi pi-chart-pie"></i><span>Aucune demande à analyser.</span></div> }</article>
        </div>

        <div class="bottom-grid">
            <article class="card opportunities-card"><div class="card-heading"><div><span>Sélection récente</span><h2>Opportunités à découvrir</h2></div><a routerLink="/candidat/offres">Toutes les offres <i class="pi pi-arrow-right"></i></a></div>@if (recommendedOffers.length) { <div class="opportunity-list">@for (offer of recommendedOffers; track offer.id) { <a routerLink="/candidat/offres" class="opportunity"><span class="company-icon"><i class="pi pi-briefcase"></i></span><div><strong>{{ offer.titre }}</strong><small>{{ offer.domaine }} · {{ offer.lieu }}</small></div><span class="date"><small>Début</small>{{ offer.dateDebut | date: 'dd MMM' }}</span><i class="pi pi-chevron-right"></i></a> }</div> } @else { <div class="empty-list"><i class="pi pi-briefcase"></i><span>Aucune nouvelle offre disponible actuellement.</span></div> }</article>
            <article class="card next-step-card"><div class="next-icon"><i class="pi pi-user-edit"></i></div><span>Conseil profil</span><h2>Un profil complet attire davantage l’attention</h2><p>Gardez votre spécialité, votre niveau d’étude et vos coordonnées à jour.</p><p-button label="Compléter mon profil" icon="pi pi-arrow-right" [text]="true" routerLink="/candidat/profile" /></article>
        </div>
    `,
    styles: `
        :host{display:block}.hero-card{position:relative;overflow:hidden;min-height:205px;margin-bottom:1.4rem;padding:clamp(1.55rem,3vw,2.3rem);display:flex;align-items:center;justify-content:space-between;gap:2rem;border:1px solid var(--surface-border);border-radius:20px;color:var(--text-color);background:linear-gradient(120deg,var(--surface-card),color-mix(in srgb,var(--primary-color),var(--surface-card) 96%));box-shadow:0 10px 34px rgba(15,23,42,.055)}.hero-card:before{content:'';position:absolute;inset:0 auto 0 0;width:5px;background:var(--primary-color)}.hero-card:after{content:'';position:absolute;width:220px;height:220px;right:-90px;bottom:-155px;border-radius:50%;background:color-mix(in srgb,var(--primary-color),transparent 94%)}.eyebrow{color:var(--primary-color);text-transform:uppercase;letter-spacing:.14em;font-size:.7rem;font-weight:800}.hero-copy{z-index:1}.hero-copy h1{max-width:680px;margin:.55rem 0;font-size:clamp(1.8rem,3vw,2.45rem);line-height:1.12}.hero-copy p{max-width:600px;margin:0;color:var(--text-color-secondary);line-height:1.65}.hero-actions{display:flex;gap:.75rem;margin-top:1.4rem}.hero-orbit{position:relative;width:190px;min-height:126px;flex:0 0 auto;display:flex;align-items:center;justify-content:center}.hero-orbit:before{content:'';position:absolute;width:125px;height:125px;border:1px dashed color-mix(in srgb,var(--primary-color),transparent 70%);border-radius:50%}.orbit-main{z-index:1;width:98px;height:98px;display:flex;align-items:center;justify-content:center;flex-direction:column;border:1px solid color-mix(in srgb,var(--primary-color),transparent 78%);border-radius:50%;background:var(--surface-card);box-shadow:0 12px 28px rgba(15,23,42,.08)}.orbit-main i{margin-bottom:.25rem;color:var(--primary-color)}.orbit-main strong{font-size:1.65rem}.orbit-main span{color:var(--text-color-secondary);font-size:.7rem}.orbit-dot{position:absolute;width:36px;height:36px;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--primary-color),var(--surface-card) 88%);color:var(--primary-color);box-shadow:0 7px 18px rgba(15,23,42,.08)}.orbit-dot.one{right:6px;top:11px}.orbit-dot.two{left:8px;bottom:7px}
        .error-banner{margin-bottom:1rem;padding:.8rem 1rem;display:flex;align-items:center;gap:.7rem;border-radius:10px;color:var(--red-600);background:color-mix(in srgb,var(--red-500),transparent 90%)}.error-banner span{flex:1}.error-banner button{border:0;background:transparent;color:inherit;font-weight:700;cursor:pointer}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.4rem}.stat-card{padding:1.15rem;display:flex;align-items:center;gap:1rem;border:1px solid var(--surface-border);border-radius:17px;background:var(--surface-card);box-shadow:0 8px 25px rgba(15,23,42,.035)}.stat-icon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border-radius:14px;font-size:1.2rem}.stat-icon.indigo{color:#6366f1;background:rgba(99,102,241,.12)}.stat-icon.blue{color:#0ea5e9;background:rgba(14,165,233,.12)}.stat-icon.amber{color:#f59e0b;background:rgba(245,158,11,.12)}.stat-icon.green{color:#10b981;background:rgba(16,185,129,.12)}.stat-card div>span,.stat-card small{display:block;color:var(--text-color-secondary)}.stat-card div>span{font-size:.78rem;font-weight:600}.stat-card strong{display:block;margin:.15rem 0;font-size:1.65rem}.stat-card small{font-size:.72rem}
        .main-grid{display:grid;grid-template-columns:1.55fr .75fr;gap:1.4rem;margin-bottom:1.4rem}.activity-card,.status-card{min-height:370px}.card-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem}.card-heading span,.next-step-card>span{color:var(--primary-color);font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}.card-heading h2{margin:.25rem 0;font-size:1.2rem}.card-heading a{color:var(--primary-color);font-size:.82rem;font-weight:650;text-decoration:none}.doughnut-wrap{position:relative;max-width:230px;height:225px;margin:auto}.center-value{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;pointer-events:none}.center-value strong{font-size:1.6rem}.center-value span{font-size:.75rem;color:var(--text-color-secondary)}.mini-legend{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-top:.6rem}.mini-legend>div{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.4rem}.mini-legend>div>span{width:8px;height:8px;border-radius:50%}.mini-legend small{color:var(--text-color-secondary)}.empty-chart{min-height:285px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.55rem;text-align:center;color:var(--text-color-secondary)}.empty-chart.compact{min-height:260px}.empty-chart i{font-size:2rem;color:var(--primary-color)}
        .bottom-grid{display:grid;grid-template-columns:1.55fr .75fr;gap:1.4rem}.opportunity-list{display:flex;flex-direction:column}.opportunity{padding:.85rem 0;display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:.85rem;border-top:1px solid var(--surface-border);color:var(--text-color);text-decoration:none}.company-icon{width:40px;height:40px;display:grid;place-items:center;border-radius:12px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color),transparent 88%)}.opportunity strong,.opportunity small,.date small{display:block}.opportunity small,.date{color:var(--text-color-secondary);font-size:.75rem}.date{text-align:right}.next-step-card{position:relative;overflow:hidden;padding:1.6rem;background:linear-gradient(145deg,color-mix(in srgb,var(--primary-color),var(--surface-card) 92%),var(--surface-card))}.next-icon{width:52px;height:52px;margin-bottom:1.2rem;display:grid;place-items:center;border-radius:16px;color:white;background:var(--primary-color);font-size:1.3rem}.next-step-card h2{margin:.45rem 0;font-size:1.3rem;line-height:1.25}.next-step-card p{color:var(--text-color-secondary);line-height:1.55}.empty-list{min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6rem;color:var(--text-color-secondary)}.empty-list i{font-size:1.8rem;color:var(--primary-color)}
        @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.main-grid,.bottom-grid{grid-template-columns:1fr}}@media(max-width:720px){.hero-orbit{display:none}.hero-actions{align-items:stretch;flex-direction:column}.stats-grid{grid-template-columns:1fr}.mini-legend{grid-template-columns:1fr}.opportunity{grid-template-columns:auto 1fr auto}.opportunity .date{display:none}}
    `
})
export class CandidateDashboard implements OnInit {
    private readonly offerService = inject(PublicOfferService);
    private readonly applicationService = inject(CandidateApplicationService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly statuses: ApplicationStatus[] = ['SOUMISE', 'EN_ETUDE', 'TEST_TECHNIQUE', 'ENTRETIEN_FACE_A_FACE', 'ACCEPTEE', 'REFUSEE'];
    private readonly colors = ['#6366f1', '#f59e0b', '#8b5cf6', '#0ea5e9', '#10b981', '#ef4444'];

    offers: InternshipOffer[] = [];
    applications: CandidateApplication[] = [];
    errorMessage = '';
    loading = false;
    activityChartData: any;
    statusChartData: any;
    readonly doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } };
    readonly lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, interaction: { intersect: false, mode: 'index' }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(148,163,184,.14)' } }, x: { grid: { display: false } } } };

    get activeApplications(): number { return this.applications.filter((item) => !['ACCEPTEE', 'REFUSEE'].includes(item.statut)).length; }
    get acceptedApplications(): number { return this.count('ACCEPTEE'); }
    get recommendedOffers(): InternshipOffer[] { const applied = new Set(this.applications.map((item) => item.offreStageId)); return this.offers.filter((offer) => !applied.has(offer.id)).slice(0, 4); }
    get nonEmptyStatuses() { return this.statuses.map((status, index) => ({ status, label: this.statusLabel(status), count: this.count(status), color: this.colors[index] })).filter((item) => item.count); }

    ngOnInit(): void { this.loadDashboard(); }

    loadDashboard(): void {
        this.loading = true; this.errorMessage = '';
        forkJoin({ offers: this.offerService.getAll(), applications: this.applicationService.getMine() }).pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); })).subscribe({
            next: ({ offers, applications }) => { this.offers = [...offers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); this.applications = applications; this.buildCharts(); },
            error: (error: HttpErrorResponse) => this.errorMessage = error.status === 0 ? 'Le backend est indisponible.' : 'Impossible de charger votre tableau de bord.'
        });
    }

    count(status: ApplicationStatus): number { return this.applications.filter((item) => item.statut === status).length; }
    statusLabel(status: ApplicationStatus): string { return { SOUMISE: 'Soumise', EN_ETUDE: 'En étude', TEST_TECHNIQUE: 'Test', ENTRETIEN_FACE_A_FACE: 'Entretien', ACCEPTEE: 'Acceptée', REFUSEE: 'Refusée' }[status]; }

    private buildCharts(): void {
        const months: { key: string; label: string }[] = [];
        const now = new Date();
        for (let offset = 5; offset >= 0; offset--) { const date = new Date(now.getFullYear(), now.getMonth() - offset, 1); months.push({ key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString('fr-FR', { month: 'short' }) }); }
        const monthlyCounts = new Map(months.map((month) => [month.key, 0]));
        this.applications.forEach((item) => { const date = new Date(item.dateDemande); const key = `${date.getFullYear()}-${date.getMonth()}`; if (monthlyCounts.has(key)) monthlyCounts.set(key, (monthlyCounts.get(key) || 0) + 1); });
        this.activityChartData = { labels: months.map((month) => month.label), datasets: [{ data: months.map((month) => monthlyCounts.get(month.key)), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.12)', fill: true, tension: .42, pointRadius: 4, pointHoverRadius: 6 }] };
        this.statusChartData = { labels: this.statuses.map((status) => this.statusLabel(status)), datasets: [{ data: this.statuses.map((status) => this.count(status)), backgroundColor: this.colors, borderWidth: 0, hoverOffset: 6 }] };
    }
}

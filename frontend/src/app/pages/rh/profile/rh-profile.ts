import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { RhProfileResponse, RhProfileService, UpdateRhProfileRequest } from './rh-profile.service';

@Component({
    selector: 'app-rh-profile',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, InputTextModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="page-heading">
            <div>
                <span class="eyebrow">Mon espace</span>
                <h1>Profil RH</h1>
                <p>Gérez vos informations personnelles et votre identité professionnelle.</p>
            </div>
            <p-button label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadProfile()" />
        </div>

        @if (loading && !profile) {
            <div class="card loading-card"><i class="pi pi-spin pi-spinner"></i><span>Chargement du profil...</span></div>
        } @else if (profile) {
            <section class="profile-shell">
                <div class="profile-banner"></div>
                <div class="profile-summary">
                    <div class="avatar">{{ initials }}</div>
                    <div class="identity-copy">
                        <div class="name-line"><h2>{{ displayName }}</h2><span class="role-badge"><i class="pi pi-shield"></i> RH</span></div>
                        <p>{{ profile.email }}</p>
                    </div>
                    <div class="summary-meta">
                        <div><i class="pi pi-address-book"></i><span><small>Contact professionnel</small><strong>{{ profile.contactProfessionnel || 'Non renseigné' }}</strong></span></div>
                        <div><i class="pi pi-calendar"></i><span><small>Membre depuis</small><strong>{{ profile.createdAt | date: 'dd MMMM yyyy' }}</strong></span></div>
                    </div>
                </div>

                <div class="profile-form-card">
                    <div class="form-heading">
                        <div class="form-icon"><i class="pi pi-id-card"></i></div>
                        <div><h2>Informations du profil</h2><p>Ces informations sont utilisées pour identifier le responsable des offres.</p></div>
                    </div>

                    <form (ngSubmit)="saveProfile()">
                        <div class="form-grid">
                            <div class="field">
                                <label for="first-name">Prénom *</label>
                                <input pInputText id="first-name" name="firstName" [(ngModel)]="form.prenom" placeholder="Votre prénom" required />
                                @if (submitted && !form.prenom.trim()) { <small class="field-error">Le prénom est obligatoire.</small> }
                            </div>
                            <div class="field">
                                <label for="last-name">Nom *</label>
                                <input pInputText id="last-name" name="lastName" [(ngModel)]="form.nom" placeholder="Votre nom" required />
                                @if (submitted && !form.nom.trim()) { <small class="field-error">Le nom est obligatoire.</small> }
                            </div>
                            <div class="field full">
                                <label for="profile-email">Adresse email *</label>
                                <input pInputText id="profile-email" name="email" [(ngModel)]="form.email" type="email" placeholder="rh@exemple.com" required />
                                @if (submitted && !isEmailValid) { <small class="field-error">Saisissez une adresse email valide.</small> }
                            </div>
                            <div class="field">
                                <label for="display-name">Nom d’affichage</label>
                                <input pInputText id="display-name" name="displayName" [(ngModel)]="form.nomAffichage" placeholder="Service RH RIF" />
                                <small class="field-hint">Nom visible comme créateur des offres.</small>
                            </div>
                            <div class="field">
                                <label for="professional-contact">Contact professionnel</label>
                                <input pInputText id="professional-contact" name="professionalContact" [(ngModel)]="form.contactProfessionnel" placeholder="contact.rh@rif.com" />
                                <small class="field-hint">Email ou numéro professionnel.</small>
                            </div>
                        </div>

                        @if (formError) { <div class="form-error"><i class="pi pi-exclamation-circle"></i>{{ formError }}</div> }

                        <div class="form-actions">
                            <p-button type="button" label="Annuler les modifications" severity="secondary" [text]="true" [disabled]="!isDirty || saving" (onClick)="resetForm()" />
                            <p-button type="submit" label="Enregistrer" icon="pi pi-check" [loading]="saving" [disabled]="!isDirty" />
                        </div>
                    </form>
                </div>
            </section>
        } @else {
            <div class="card error-state"><i class="pi pi-exclamation-circle"></i><h2>Profil indisponible</h2><p>{{ loadError }}</p><p-button label="Réessayer" (onClick)="loadProfile()" /></div>
        }
    `,
    styles: `
        .page-heading { margin-bottom: 1.5rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; }
        .eyebrow { color: var(--primary-color); font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .page-heading h1 { margin: .45rem 0; font-size: 2rem; letter-spacing: -.03em; }
        .page-heading p { margin: 0; color: var(--text-color-secondary); }
        .profile-shell { overflow: hidden; border: 1px solid var(--surface-border); border-radius: 24px; background: var(--surface-card); box-shadow: 0 14px 40px rgba(0,0,0,.05); }
        .profile-banner { height: 105px; background: linear-gradient(110deg, var(--primary-color), color-mix(in srgb, var(--primary-color), #312e81 45%)); }
        .profile-summary { min-height: 125px; padding: 0 2.5rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; border-bottom: 1px solid var(--surface-border); }
        .avatar { width: 94px; height: 94px; margin-top: -45px; display: grid; place-items: center; flex: 0 0 auto; border: 5px solid var(--surface-card); border-radius: 50%; background: color-mix(in srgb, var(--primary-color), var(--surface-card) 84%); color: var(--primary-color); box-shadow: 0 8px 25px rgba(0,0,0,.12); font-size: 1.8rem; font-weight: 800; }
        .identity-copy { min-width: 0; }
        .name-line { display: flex; align-items: center; flex-wrap: wrap; gap: .7rem; }
        .name-line h2 { margin: 0; font-size: 1.55rem; }
        .identity-copy > p { margin: .35rem 0 0; color: var(--text-color-secondary); }
        .role-badge { display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .6rem; border-radius: 999px; background: color-mix(in srgb, var(--primary-color), transparent 88%); color: var(--primary-color); font-size: .72rem; font-weight: 750; }
        .summary-meta { margin-left: auto; display: flex; align-items: center; gap: 2rem; }
        .summary-meta > div { display: flex; align-items: center; gap: .7rem; }
        .summary-meta i { color: var(--primary-color); }
        .summary-meta span, .summary-meta small, .summary-meta strong { display: block; }
        .summary-meta small { margin-bottom: .2rem; color: var(--text-color-secondary); }
        .summary-meta strong { max-width: 210px; font-size: .85rem; overflow-wrap: anywhere; }
        .profile-form-card { padding: clamp(1.5rem, 4vw, 2.75rem); }
        .form-heading { margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .form-icon { width: 52px; height: 52px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 14px; background: color-mix(in srgb, var(--primary-color), transparent 88%); color: var(--primary-color); font-size: 1.25rem; }
        .form-heading h2 { margin: 0 0 .3rem; font-size: 1.35rem; }
        .form-heading p { margin: 0; color: var(--text-color-secondary); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .field.full { grid-column: 1 / -1; }
        label { display: block; margin-bottom: .5rem; font-weight: 650; }
        input { width: 100%; height: 48px; }
        .field-error, .field-hint { display: block; margin-top: .4rem; }
        .field-error { color: var(--p-red-500); }
        .field-hint { color: var(--text-color-secondary); }
        .form-error { margin-top: 1.25rem; padding: .8rem 1rem; display: flex; gap: .6rem; border-radius: 10px; background: color-mix(in srgb, var(--p-red-500), transparent 90%); color: var(--p-red-600); }
        .form-actions { margin-top: 2rem; padding-top: 1.5rem; display: flex; justify-content: flex-end; gap: .75rem; border-top: 1px solid var(--surface-border); }
        .loading-card, .error-state { min-height: 320px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem; color: var(--text-color-secondary); }
        .loading-card i, .error-state > i { color: var(--primary-color); font-size: 2.5rem; }
        .error-state h2, .error-state p { margin: 0; }
        @media (max-width: 950px) { .profile-summary { align-items: flex-start; flex-wrap: wrap; } .summary-meta { width: 100%; margin: 0 0 0 7.2rem; } }
        @media (max-width: 640px) { .page-heading { align-items: flex-start; flex-direction: column; } .profile-banner { height: 80px; } .profile-summary { padding: 0 1.25rem 1.5rem; } .avatar { width: 78px; height: 78px; margin-top: -35px; } .summary-meta { margin: 1rem 0 0; align-items: flex-start; flex-direction: column; gap: 1rem; } .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: auto; } .form-actions { align-items: stretch; flex-direction: column-reverse; } }
    `
})
export class RhProfile implements OnInit {
    private readonly profileService = inject(RhProfileService);
    private readonly authService = inject(AuthService);
    private readonly messageService = inject(MessageService);
    private readonly changeDetector = inject(ChangeDetectorRef);

    profile: RhProfileResponse | null = null;
    form: UpdateRhProfileRequest = this.emptyForm();
    initialForm: UpdateRhProfileRequest = this.emptyForm();
    loading = false;
    saving = false;
    submitted = false;
    formError = '';
    loadError = '';

    ngOnInit(): void { this.loadProfile(); }

    get displayName(): string { return this.profile?.nomAffichage?.trim() || `${this.profile?.prenom ?? ''} ${this.profile?.nom ?? ''}`.trim(); }
    get initials(): string { return `${this.profile?.prenom?.charAt(0) ?? ''}${this.profile?.nom?.charAt(0) ?? ''}`.toUpperCase() || 'RH'; }
    get isEmailValid(): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim()); }
    get isDirty(): boolean { return JSON.stringify(this.form) !== JSON.stringify(this.initialForm); }

    loadProfile(): void {
        this.loading = true;
        this.loadError = '';
        this.profileService.getProfile().pipe(finalize(() => { this.loading = false; this.changeDetector.markForCheck(); })).subscribe({
            next: (profile) => { this.profile = profile; this.setForm(profile); },
            error: (error: HttpErrorResponse) => { this.loadError = this.errorMessage(error); }
        });
    }

    saveProfile(): void {
        this.submitted = true;
        this.formError = '';
        if (!this.form.nom.trim() || !this.form.prenom.trim() || !this.isEmailValid) return;

        this.saving = true;
        const request: UpdateRhProfileRequest = {
            nom: this.form.nom.trim(),
            prenom: this.form.prenom.trim(),
            email: this.form.email.trim(),
            nomAffichage: this.form.nomAffichage?.trim() || null,
            contactProfessionnel: this.form.contactProfessionnel?.trim() || null
        };

        this.profileService.updateProfile(request).pipe(finalize(() => { this.saving = false; this.changeDetector.markForCheck(); })).subscribe({
            next: (profile) => {
                this.profile = profile;
                this.setForm(profile);
                this.authService.updateStoredEmail(profile.email);
                this.messageService.add({ severity: 'success', summary: 'Profil mis à jour', detail: 'Vos informations ont été enregistrées.', life: 3500 });
            },
            error: (error: HttpErrorResponse) => { this.formError = this.errorMessage(error); }
        });
    }

    resetForm(): void { this.form = { ...this.initialForm }; this.submitted = false; this.formError = ''; }

    private setForm(profile: RhProfileResponse): void {
        this.form = { nom: profile.nom, prenom: profile.prenom, email: profile.email, nomAffichage: profile.nomAffichage, contactProfessionnel: profile.contactProfessionnel };
        this.initialForm = { ...this.form };
        this.submitted = false;
        this.formError = '';
    }
    private emptyForm(): UpdateRhProfileRequest { return { nom: '', prenom: '', email: '', nomAffichage: null, contactProfessionnel: null }; }
    private errorMessage(error: HttpErrorResponse): string {
        if (error.status === 0) return 'Le backend est indisponible.';
        if (error.status === 401 || error.status === 403) return 'Session expirée ou accès RH refusé. Reconnectez-vous.';
        return typeof error.error?.message === 'string' ? error.error.message : 'Une erreur inattendue est survenue.';
    }
}

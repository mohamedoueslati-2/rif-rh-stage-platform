import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { CandidateProfileResponse, CandidateProfileService, UpdateCandidateProfileRequest } from './candidate-profile.service';

@Component({
    selector: 'app-candidate-profile',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, ButtonModule, ConfirmDialogModule, InputTextModule, PasswordModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '470px' }" />

        <div class="page-heading">
            <div><span class="eyebrow">Mon espace</span><h1>Profil candidat</h1><p>Complétez vos informations pour présenter un profil clair aux recruteurs.</p></div>
            <p-button label="Actualiser" icon="pi pi-refresh" severity="secondary" [outlined]="true" [loading]="loading" (onClick)="loadProfile()" />
        </div>

        @if (loading && !profile) {
            <div class="card state-card"><i class="pi pi-spin pi-spinner"></i><span>Chargement du profil...</span></div>
        } @else if (profile) {
            <section class="profile-shell">
                <div class="profile-banner"></div>
                <div class="profile-summary">
                    <div class="avatar">{{ initials }}</div>
                    <div class="identity"><div class="name-line"><h2>{{ profile.prenom }} {{ profile.nom }}</h2><span class="role-badge"><i class="pi pi-user"></i> Candidat</span></div><p>{{ profile.email }}</p></div>
                    <div class="summary-meta"><div><i class="pi pi-briefcase"></i><span><small>Spécialité</small><strong>{{ profile.specialite || 'Non renseignée' }}</strong></span></div><div><i class="pi pi-calendar"></i><span><small>Membre depuis</small><strong>{{ profile.createdAt | date: 'dd MMMM yyyy' }}</strong></span></div></div>
                </div>

                <div class="profile-content">
                    <div class="main-column">
                        <div class="section-heading"><span class="section-icon"><i class="pi pi-id-card"></i></span><div><h2>Informations personnelles</h2><p>Les champs obligatoires servent à identifier votre candidature.</p></div></div>
                        <form (ngSubmit)="saveProfile()">
                            <div class="form-grid">
                                <div class="field"><label for="candidate-first-name">Prénom *</label><input pInputText id="candidate-first-name" name="firstName" [(ngModel)]="form.prenom" required />@if (submitted && !form.prenom.trim()) { <small class="field-error">Le prénom est obligatoire.</small> }</div>
                                <div class="field"><label for="candidate-last-name">Nom *</label><input pInputText id="candidate-last-name" name="lastName" [(ngModel)]="form.nom" required />@if (submitted && !form.nom.trim()) { <small class="field-error">Le nom est obligatoire.</small> }</div>
                                <div class="field full"><label for="candidate-email">Adresse email *</label><input pInputText id="candidate-email" name="email" type="email" [(ngModel)]="form.email" required />@if (submitted && !isEmailValid) { <small class="field-error">Saisissez une adresse email valide.</small> }</div>
                                <div class="field"><label for="candidate-phone">Téléphone</label><input pInputText id="candidate-phone" name="phone" [(ngModel)]="form.telephone" placeholder="+216 20 000 000" /></div>
                                <div class="field"><label for="candidate-speciality">Spécialité</label><input pInputText id="candidate-speciality" name="speciality" [(ngModel)]="form.specialite" placeholder="Développement Full Stack" /></div>
                                <div class="field full"><label for="candidate-level">Niveau d’étude</label><input pInputText id="candidate-level" name="studyLevel" [(ngModel)]="form.niveauEtude" placeholder="4ème année génie logiciel" /></div>
                            </div>
                            @if (formError) { <div class="form-error"><i class="pi pi-exclamation-circle"></i>{{ formError }}</div> }
                            <div class="form-actions"><p-button type="button" label="Annuler les modifications" severity="secondary" [text]="true" [disabled]="!isDirty || saving" (onClick)="resetForm()" /><p-button type="submit" label="Enregistrer le profil" icon="pi pi-check" [loading]="saving" [disabled]="!isDirty" /></div>
                        </form>
                    </div>

                    <aside class="security-column">
                        <div class="security-card">
                            <div class="section-heading compact"><span class="section-icon"><i class="pi pi-lock"></i></span><div><h2>Sécurité</h2><p>Modifiez votre mot de passe.</p></div></div>
                            <div class="field"><label for="old-password">Mot de passe actuel</label><p-password inputId="old-password" [(ngModel)]="oldPassword" [feedback]="false" [toggleMask]="true" styleClass="password-field" /></div>
                            <div class="field"><label for="new-password">Nouveau mot de passe</label><p-password inputId="new-password" [(ngModel)]="newPassword" [feedback]="true" [toggleMask]="true" styleClass="password-field" /><small>Minimum 6 caractères.</small></div>
                            <div class="field"><label for="confirm-password">Confirmer le mot de passe</label><p-password inputId="confirm-password" [(ngModel)]="confirmPassword" [feedback]="false" [toggleMask]="true" styleClass="password-field" /></div>
                            @if (passwordError) { <div class="form-error"><i class="pi pi-exclamation-circle"></i>{{ passwordError }}</div> }
                            <p-button label="Changer le mot de passe" icon="pi pi-key" [loading]="changingPassword" [disabled]="!oldPassword || !newPassword || !confirmPassword" (onClick)="changePassword()" />
                        </div>

                        <div class="danger-card"><div><h3>Supprimer mon compte</h3><p>La suppression est définitive et impossible si vous possédez des demandes.</p></div><p-button label="Supprimer" icon="pi pi-trash" severity="danger" [outlined]="true" [loading]="deleting" (onClick)="confirmDelete()" /></div>
                    </aside>
                </div>
            </section>
        } @else {
            <div class="card state-card"><i class="pi pi-exclamation-circle"></i><strong>Profil indisponible</strong><span>{{ loadError }}</span><p-button label="Réessayer" (onClick)="loadProfile()" /></div>
        }
    `,
    styles: `
        .page-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin-bottom:1.5rem}.eyebrow{color:var(--primary-color);font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.page-heading h1{margin:.45rem 0;font-size:2rem}.page-heading p{margin:0;color:var(--text-color-secondary)}
        .profile-shell{overflow:hidden;border:1px solid var(--surface-border);border-radius:24px;background:var(--surface-card);box-shadow:0 14px 40px rgba(0,0,0,.05)}.profile-banner{height:105px;background:linear-gradient(110deg,var(--primary-color),color-mix(in srgb,var(--primary-color),#312e81 45%))}.profile-summary{min-height:125px;padding:0 2.5rem 1.5rem;display:flex;align-items:center;gap:1.25rem;border-bottom:1px solid var(--surface-border)}.avatar{width:94px;height:94px;margin-top:-45px;display:grid;place-items:center;flex:0 0 auto;border:5px solid var(--surface-card);border-radius:50%;background:color-mix(in srgb,var(--primary-color),var(--surface-card) 84%);color:var(--primary-color);box-shadow:0 8px 25px rgba(0,0,0,.12);font-size:1.8rem;font-weight:800}.name-line{display:flex;align-items:center;flex-wrap:wrap;gap:.7rem}.name-line h2{margin:0;font-size:1.55rem}.identity p{margin:.35rem 0 0;color:var(--text-color-secondary)}.role-badge{display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .6rem;border-radius:999px;background:color-mix(in srgb,var(--primary-color),transparent 88%);color:var(--primary-color);font-size:.72rem;font-weight:750}.summary-meta{margin-left:auto;display:flex;gap:2rem}.summary-meta>div{display:flex;align-items:center;gap:.7rem}.summary-meta i{color:var(--primary-color)}.summary-meta span,.summary-meta small,.summary-meta strong{display:block}.summary-meta small{margin-bottom:.2rem;color:var(--text-color-secondary)}.summary-meta strong{max-width:200px;font-size:.85rem}
        .profile-content{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(310px,.75fr);gap:2rem;padding:clamp(1.5rem,4vw,2.75rem)}.main-column{padding-right:2rem;border-right:1px solid var(--surface-border)}.section-heading{display:flex;align-items:center;gap:1rem;margin-bottom:1.75rem}.section-heading.compact{margin-bottom:1.25rem}.section-icon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border-radius:14px;background:color-mix(in srgb,var(--primary-color),transparent 88%);color:var(--primary-color);font-size:1.15rem}.section-heading h2{margin:0 0 .25rem;font-size:1.25rem}.section-heading p{margin:0;color:var(--text-color-secondary);font-size:.88rem}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.15rem}.field.full{grid-column:1/-1}.field{margin-bottom:1rem}.field label{display:block;margin-bottom:.45rem;font-weight:650}.field input{width:100%;height:46px}.field small{display:block;margin-top:.35rem;color:var(--text-color-secondary)}.field .field-error{color:var(--red-500)}.form-error{margin:.75rem 0;padding:.75rem .9rem;display:flex;gap:.55rem;border-radius:9px;background:color-mix(in srgb,var(--red-500),transparent 90%);color:var(--red-600)}.form-actions{margin-top:1.5rem;padding-top:1.25rem;display:flex;justify-content:flex-end;gap:.7rem;border-top:1px solid var(--surface-border)}
        .security-column{display:flex;flex-direction:column;gap:1rem}.security-card,.danger-card{padding:1.25rem;border:1px solid var(--surface-border);border-radius:16px}.security-card ::ng-deep .password-field,.security-card ::ng-deep .password-field input{width:100%}.danger-card{display:flex;align-items:center;justify-content:space-between;gap:1rem;border-color:color-mix(in srgb,var(--red-500),transparent 65%);background:color-mix(in srgb,var(--red-500),transparent 96%)}.danger-card h3{margin:0 0 .3rem;font-size:1rem;color:var(--red-600)}.danger-card p{margin:0;color:var(--text-color-secondary);font-size:.82rem;line-height:1.45}.state-card{min-height:320px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;color:var(--text-color-secondary)}.state-card>i{color:var(--primary-color);font-size:2.5rem}
        @media(max-width:1050px){.profile-summary{align-items:flex-start;flex-wrap:wrap}.summary-meta{width:100%;margin-left:7.2rem}.profile-content{grid-template-columns:1fr}.main-column{padding-right:0;padding-bottom:2rem;border-right:0;border-bottom:1px solid var(--surface-border)}}@media(max-width:650px){.page-heading{align-items:flex-start;flex-direction:column}.profile-banner{height:80px}.profile-summary{padding:0 1.25rem 1.5rem}.avatar{width:78px;height:78px;margin-top:-35px}.summary-meta{margin:1rem 0 0;flex-direction:column;gap:1rem}.form-grid{grid-template-columns:1fr}.field.full{grid-column:auto}.form-actions{align-items:stretch;flex-direction:column-reverse}.danger-card{align-items:flex-start;flex-direction:column}}
    `
})
export class CandidateProfile implements OnInit {
    private readonly profileService = inject(CandidateProfileService);
    private readonly authService = inject(AuthService);
    private readonly messages = inject(MessageService);
    private readonly confirmations = inject(ConfirmationService);
    private readonly cdr = inject(ChangeDetectorRef);

    profile: CandidateProfileResponse | null = null;
    form: UpdateCandidateProfileRequest = this.emptyForm();
    initialForm: UpdateCandidateProfileRequest = this.emptyForm();
    loading = false;
    saving = false;
    submitted = false;
    formError = '';
    loadError = '';
    oldPassword = '';
    newPassword = '';
    confirmPassword = '';
    passwordError = '';
    changingPassword = false;
    deleting = false;

    get initials(): string { return `${this.profile?.prenom?.charAt(0) || ''}${this.profile?.nom?.charAt(0) || ''}`.toUpperCase() || 'CA'; }
    get isEmailValid(): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim()); }
    get isDirty(): boolean { return JSON.stringify(this.form) !== JSON.stringify(this.initialForm); }

    ngOnInit(): void { this.loadProfile(); }

    loadProfile(): void {
        this.loading = true; this.loadError = '';
        this.profileService.getProfile().pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); })).subscribe({
            next: (profile) => { this.profile = profile; this.setForm(profile); },
            error: (error: HttpErrorResponse) => this.loadError = this.errorMessage(error)
        });
    }

    saveProfile(): void {
        this.submitted = true; this.formError = '';
        if (!this.form.nom.trim() || !this.form.prenom.trim() || !this.isEmailValid) return;
        const request: UpdateCandidateProfileRequest = { nom: this.form.nom.trim(), prenom: this.form.prenom.trim(), email: this.form.email.trim(), telephone: this.clean(this.form.telephone), specialite: this.clean(this.form.specialite), niveauEtude: this.clean(this.form.niveauEtude) };
        this.saving = true;
        this.profileService.updateProfile(request).pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); })).subscribe({
            next: (profile) => { this.profile = profile; this.setForm(profile); this.authService.updateStoredEmail(profile.email); this.messages.add({ severity: 'success', summary: 'Profil mis à jour', detail: 'Vos informations ont été enregistrées.' }); },
            error: (error: HttpErrorResponse) => this.formError = this.errorMessage(error)
        });
    }

    changePassword(): void {
        this.passwordError = '';
        if (this.newPassword.length < 6) { this.passwordError = 'Le nouveau mot de passe doit contenir au moins 6 caractères.'; return; }
        if (this.newPassword !== this.confirmPassword) { this.passwordError = 'La confirmation ne correspond pas au nouveau mot de passe.'; return; }
        this.changingPassword = true;
        this.profileService.changePassword({ oldPassword: this.oldPassword, newPassword: this.newPassword }).pipe(finalize(() => { this.changingPassword = false; this.cdr.markForCheck(); })).subscribe({
            next: () => { this.oldPassword = ''; this.newPassword = ''; this.confirmPassword = ''; this.messages.add({ severity: 'success', summary: 'Mot de passe modifié', detail: 'Votre nouveau mot de passe est actif.' }); },
            error: (error: HttpErrorResponse) => this.passwordError = this.errorMessage(error)
        });
    }

    confirmDelete(): void {
        this.confirmations.confirm({ header: 'Supprimer définitivement le compte', message: 'Cette action est irréversible. Voulez-vous supprimer votre profil candidat ?', icon: 'pi pi-exclamation-triangle', rejectLabel: 'Conserver mon compte', acceptLabel: 'Supprimer définitivement', acceptButtonProps: { severity: 'danger' }, accept: () => this.deleteProfile() });
    }

    resetForm(): void { this.form = { ...this.initialForm }; this.submitted = false; this.formError = ''; }

    private deleteProfile(): void {
        this.deleting = true;
        this.profileService.deleteProfile().pipe(finalize(() => { this.deleting = false; this.cdr.markForCheck(); })).subscribe({ next: () => this.authService.logout(), error: (error: HttpErrorResponse) => this.messages.add({ severity: 'error', summary: 'Suppression impossible', detail: this.errorMessage(error) }) });
    }

    private setForm(profile: CandidateProfileResponse): void { this.form = { nom: profile.nom, prenom: profile.prenom, email: profile.email, telephone: profile.telephone, specialite: profile.specialite, niveauEtude: profile.niveauEtude }; this.initialForm = { ...this.form }; this.submitted = false; this.formError = ''; }
    private emptyForm(): UpdateCandidateProfileRequest { return { nom: '', prenom: '', email: '', telephone: null, specialite: null, niveauEtude: null }; }
    private clean(value: string | null): string | null { return value?.trim() || null; }
    private errorMessage(error: HttpErrorResponse): string { if (error.status === 0) return 'Le backend est indisponible.'; if (error.status === 401 || error.status === 403) return 'Votre session a expiré. Reconnectez-vous.'; return typeof error.error === 'string' ? error.error : error.error?.message || 'Une erreur inattendue est survenue.'; }
}

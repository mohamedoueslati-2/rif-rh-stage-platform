import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CandidateProfileResponse {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    specialite: string | null;
    niveauEtude: string | null;
    createdAt: string;
}

export interface UpdateCandidateProfileRequest {
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    specialite: string | null;
    niveauEtude: string | null;
}

export interface ChangeCandidatePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class CandidateProfileService {
    private readonly http = inject(HttpClient);

    getProfile(): Observable<CandidateProfileResponse> {
        return this.http.get<CandidateProfileResponse>('/api/candidats/profil');
    }

    updateProfile(request: UpdateCandidateProfileRequest): Observable<CandidateProfileResponse> {
        return this.http.put<CandidateProfileResponse>('/api/candidats/profil', request);
    }

    changePassword(request: ChangeCandidatePasswordRequest): Observable<void> {
        return this.http.put<void>('/api/candidats/profil/password', request);
    }

    deleteProfile(): Observable<void> {
        return this.http.delete<void>('/api/candidats/profil');
    }
}

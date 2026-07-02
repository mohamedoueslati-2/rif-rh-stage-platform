import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface RhProfileResponse {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    nomAffichage: string | null;
    contactProfessionnel: string | null;
    createdAt: string;
}

export interface UpdateRhProfileRequest {
    nom: string;
    prenom: string;
    email: string;
    nomAffichage: string | null;
    contactProfessionnel: string | null;
}

@Injectable({ providedIn: 'root' })
export class RhProfileService {
    private readonly http = inject(HttpClient);
    private readonly endpoint = '/api/rh/profil';

    getProfile(): Observable<RhProfileResponse> {
        return this.http.get<RhProfileResponse>(this.endpoint);
    }

    updateProfile(profile: UpdateRhProfileRequest): Observable<RhProfileResponse> {
        return this.http.put<RhProfileResponse>(this.endpoint, profile);
    }

    patchProfile(profile: Partial<UpdateRhProfileRequest>): Observable<RhProfileResponse> {
        return this.http.patch<RhProfileResponse>(this.endpoint, profile);
    }
}

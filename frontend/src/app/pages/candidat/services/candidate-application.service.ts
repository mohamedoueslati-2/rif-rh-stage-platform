import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type ApplicationStatus =
    | 'SOUMISE'
    | 'EN_ETUDE'
    | 'TEST_TECHNIQUE'
    | 'ENTRETIEN_FACE_A_FACE'
    | 'ACCEPTEE'
    | 'REFUSEE';

export interface CandidateApplication {
    id: string;
    referenceDemande: string;
    dateDemande: string;
    lettreMotivationUrl: string | null;
    cvUrl: string;
    statut: ApplicationStatus;
    noteTestTechnique: number | null;
    commentaireRh: string | null;
    updatedAt: string;
    candidatId: string;
    candidatNom: string;
    candidatPrenom: string;
    candidatEmail: string;
    candidatSpecialite: string | null;
    candidatNiveauEtude: string | null;
    offreStageId: string;
    referenceOffre: string;
    offreTitre: string;
    offreDomaine: string;
    rhTraitantId: string | null;
    rhTraitantNom: string | null;
}

export interface CreateApplicationRequest {
    cvUrl: string;
    lettreMotivationUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class CandidateApplicationService {
    private readonly http = inject(HttpClient);

    apply(offreId: string, request: CreateApplicationRequest): Observable<CandidateApplication> {
        return this.http.post<CandidateApplication>(`/api/demandes/offre/${offreId}`, request);
    }

    getMine(): Observable<CandidateApplication[]> {
        return this.http.get<CandidateApplication[]>('/api/demandes/me');
    }

    getMineById(id: string): Observable<CandidateApplication> {
        return this.http.get<CandidateApplication>(`/api/demandes/me/${id}`);
    }

    cancel(id: string): Observable<void> {
        return this.http.delete<void>(`/api/demandes/${id}`);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStatus, CandidateApplication } from '../../candidat/services/candidate-application.service';

@Injectable({ providedIn: 'root' })
export class RhApplicationService {
    private readonly http = inject(HttpClient);

    getAll(): Observable<CandidateApplication[]> {
        return this.http.get<CandidateApplication[]>('/api/demandes');
    }

    getById(id: string): Observable<CandidateApplication> {
        return this.http.get<CandidateApplication>(`/api/demandes/${id}`);
    }

    updateStatus(id: string, statut: ApplicationStatus): Observable<CandidateApplication> {
        return this.http.patch<CandidateApplication>(`/api/demandes/${id}/statut`, { statut });
    }

    updateComment(id: string, commentaireRh: string): Observable<CandidateApplication> {
        return this.http.patch<CandidateApplication>(`/api/demandes/${id}/commentaire`, { commentaireRh });
    }

    updateTestScore(id: string, noteTestTechnique: number): Observable<CandidateApplication> {
        return this.http.patch<CandidateApplication>(`/api/demandes/${id}/note-test`, { noteTestTechnique });
    }
}

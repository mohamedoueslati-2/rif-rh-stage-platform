import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface InternshipOffer {
    id: string;
    referenceOffre: string;
    titre: string;
    description: string;
    domaine: string;
    lieu: string;
    duree: string;
    dateDebut: string;
    dateExpiration: string;
    createdAt: string;
    rhCreateurId: string;
    rhCreateurNom: string;
    rhCreateurEmail: string;
}

@Injectable({ providedIn: 'root' })
export class PublicOfferService {
    private readonly http = inject(HttpClient);

    getAll(): Observable<InternshipOffer[]> {
        return this.http.get<InternshipOffer[]>('/api/offres');
    }

    getById(id: string): Observable<InternshipOffer> {
        return this.http.get<InternshipOffer>(`/api/offres/${id}`);
    }
}

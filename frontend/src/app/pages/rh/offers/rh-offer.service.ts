import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InternshipOffer } from '../../landing/services/public-offer.service';

export interface OfferPayload {
    referenceOffre: string;
    titre: string;
    description: string;
    domaine: string;
    lieu: string;
    duree: string;
    dateDebut: string;
    dateExpiration: string;
}

@Injectable({ providedIn: 'root' })
export class RhOfferService {
    private readonly http = inject(HttpClient);
    private readonly endpoint = '/api/offres';

    getAll(): Observable<InternshipOffer[]> {
        return this.http.get<InternshipOffer[]>(this.endpoint);
    }

    getById(id: string): Observable<InternshipOffer> {
        return this.http.get<InternshipOffer>(`${this.endpoint}/${id}`);
    }

    create(payload: OfferPayload): Observable<InternshipOffer> {
        return this.http.post<InternshipOffer>(this.endpoint, payload);
    }

    update(id: string, payload: OfferPayload): Observable<InternshipOffer> {
        return this.http.put<InternshipOffer>(`${this.endpoint}/${id}`, payload);
    }

    patch(id: string, payload: Partial<OfferPayload>): Observable<InternshipOffer> {
        return this.http.patch<InternshipOffer>(`${this.endpoint}/${id}`, payload);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export type UserRole = 'RH' | 'CANDIDAT';

export interface LoginRequest {
    email: string;
    motDePasse: string;
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    userId: string;
    email: string;
    role: UserRole;
}

export interface RegisterRequest {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone?: string;
    specialite?: string;
    niveauEtude?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly tokenKey = 'auth_token';
    private readonly roleKey = 'auth_role';
    private readonly userIdKey = 'auth_user_id';
    private readonly emailKey = 'auth_email';

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(tap((response) => this.saveSession(response)));
    }

    register(candidate: RegisterRequest): Observable<unknown> {
        return this.http.post('/api/candidats/register', candidate);
    }

    logout(): void {
        this.clearSession();
        void this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        if (this.isTokenExpired(token)) {
            this.clearSession();
            return false;
        }

        return true;
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRole(): UserRole | null {
        const role = localStorage.getItem(this.roleKey)?.replace(/^ROLE_/, '');
        return role === 'RH' || role === 'CANDIDAT' ? role : null;
    }

    getUserId(): string | null {
        return localStorage.getItem(this.userIdKey);
    }

    getEmail(): string | null {
        return localStorage.getItem(this.emailKey);
    }

    updateStoredEmail(email: string): void {
        localStorage.setItem(this.emailKey, email);
    }

    redirectByRole(): Promise<boolean> {
        const destination = this.getRole() === 'RH' ? '/dashboard' : '/candidat/dashboard';
        return this.router.navigate([destination]);
    }

    private saveSession(response: LoginResponse): void {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.roleKey, response.role.replace(/^ROLE_/, ''));
        localStorage.setItem(this.userIdKey, response.userId);
        localStorage.setItem(this.emailKey, response.email);
    }

    private clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.roleKey);
        localStorage.removeItem(this.userIdKey);
        localStorage.removeItem(this.emailKey);
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
            return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
        } catch {
            return false;
        }
    }
}

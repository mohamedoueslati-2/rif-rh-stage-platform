import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@/app/pages/auth/services/auth.service';

const PUBLIC_ENDPOINTS = ['/api/auth/login', '/api/candidats/register'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const isPublicRequest = PUBLIC_ENDPOINTS.some((endpoint) => request.url.includes(endpoint));
    const token = authService.getToken();

    if (!token || isPublicRequest) return next(request);

    return next(
        request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        })
    );
};

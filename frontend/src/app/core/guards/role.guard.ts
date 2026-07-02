import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '@/app/pages/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const allowedRoles = (route.data['roles'] ?? []) as UserRole[];

    return allowedRoles.includes(authService.getRole() as UserRole) ? true : router.createUrlTree(['/auth/access']);
};

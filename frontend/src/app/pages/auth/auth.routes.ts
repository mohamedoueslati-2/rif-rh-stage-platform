import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Register } from './register';

export default [
    { path: 'access', component: Access },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
] as Routes;

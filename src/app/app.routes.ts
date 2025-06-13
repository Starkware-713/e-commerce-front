import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { NotFound } from './pages/errors/not-found/not-found';
import { Forrbiden } from './pages/errors/forrbiden/forrbiden';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'products', component: Products},
    {path: 'cart', component: Cart},
    {path: 'register', component: Register},
    {path: 'login', component: Login},
    {path: 'privacy', component: Privacy},
    {path: 'terms', component: Terms},
    {path: '404', component: NotFound},
    {path: '403', component: Forrbiden},
    {path: '**', redirectTo: '/home'}
];

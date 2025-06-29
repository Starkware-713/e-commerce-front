import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';
import { NotFound } from './pages/errors/not-found/not-found';
import { Forrbiden } from './pages/errors/forrbiden/forrbiden';
import { Dashboard } from './pages/dashboard/dashboard';
import { Client } from './pages/dashboard/client/client';
import { Seller } from './pages/dashboard/seller/seller';
import { DashboardGuard } from './guards/dashboard.guard';
import { UserRole } from './services/auth.service';
import { Contact } from './pages/contact/contact';
import { AboutUs } from './pages/about-us/about-us';

export const routes: Routes = [    
    {path: '', redirectTo: '/home', pathMatch: 'full'},    
    {path: 'home', component: Home},
    {path: 'products', component: Products},
    {path: 'cart', component: Cart},
    {path: 'register', component: Register},
    {path: 'Products', component: Products},
    {path: 'login', component: Login},
    {path: 'contact', component: Contact},
    {path: 'about', component: AboutUs},
    {path: 'dashboard', component: Dashboard, canActivate: [DashboardGuard], children: [
    
        {
            path: 'client',
            component: Client,
            canActivate: [DashboardGuard],
            data: { role: UserRole.CLIENT }
        },
        {
            path: 'seller',
            component: Seller,
            canActivate: [DashboardGuard],
            data: { role: UserRole.SELLER }
        }
    ]},
    {path: '404', component: NotFound},
    {path: '403', component: Forrbiden},
    {path: 'product/:id', component: Products},
    {path: '**', redirectTo: '/404'}
];

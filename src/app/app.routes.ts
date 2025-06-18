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
import { Dashboard } from './pages/dashboard/dashboard';
import { Client } from './pages/dashboard/client/client';
import { Seller } from './pages/dashboard/seller/seller';
import { SellerBoss } from './pages/dashboard/seller-boss/seller-boss';
import { DashboardGuard } from './guards/dashboard.guard';
import { UserRole } from './services/auth.service';
import { SellerBossDashboard } from './pages/dashboard/seller-boss-dashboard/seller-boss-dashboard';
export const routes: Routes = [    {path: '', redirectTo: '/home', pathMatch: 'full'},    {path: 'home', component: Home},
    {path: 'products', component: Products},
    {path: 'cart', component: Cart},
    {path: 'register', component: Register},
    {path: 'login', component: Login},
    {path: 'seller-boss-dashboard', component: SellerBossDashboard, canActivate: [DashboardGuard], data: { role: UserRole.SELLER_BOSS }},
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
        },
        {
            path: 'seller-boss',
            component: SellerBoss,
            canActivate: [DashboardGuard],
            data: { role: UserRole.SELLER_BOSS }
        }
    ]},
    {path: 'privacy', component: Privacy},
    {path: 'terms', component: Terms},
    {path: '404', component: NotFound},
    {path: '403', component: Forrbiden},
    {path: '**', redirectTo: '/404'}
];

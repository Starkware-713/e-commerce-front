import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';


export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'products', component: Products},
    {path: 'cart', component: Cart},
    {path: 'register', component: Register},
    {path: 'login', component: Login},
    {path: '**', redirectTo: '/home'}
];

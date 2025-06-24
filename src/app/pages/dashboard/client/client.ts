import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { User } from '../../../services/auth.service';
import { Order } from '../../../services/client-dashboard.service';
import { FormsModule } from '@angular/forms';
import { CartService, Product, CartItemCreate } from '../../../services/cart.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  ordersError: string | null = null; // campo para errores de órdenes
  editingProfile = false;
  profileForm = {
    name: '',
    lastname: '',
    email: ''
  };
  profileMessage: string | null = null;
  profileError: string | null = null;

  // Carrito
  cart: any = null;
  cartItems: any[] = [];
  cartLoading = true;
  cartError: string | null = null;
  cartTotal: number = 0;

  constructor(
    private clientService: ClientDashboardService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadOrders();
    this.loadCart();
  }

  private loadUserData() {
    this.clientService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm = {
          name: user.name || '',
          lastname: user.lastname || '',
          email: user.email || ''
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los datos del usuario';
        this.loading = false;
        console.error('Error loading user data:', error);
      }
    });
  }

  private loadOrders() {
    this.clientService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersError = null;
      },
      error: (error) => {
        // Manejo específico para 404 con mensaje "No hay órdenes para el usuario"
        if (error.status === 404 && error.error?.detail === 'No hay órdenes para el usuario') {
          this.orders = [];
          this.ordersError = 'No hay órdenes para el usuario';
        } else {
          this.ordersError = 'Error al cargar el historial de pedidos';
        }
        console.error('Error loading orders:', error);
      }
    });
  }

  // --- CARRITO ---
  loadCart() {
    this.cartLoading = true;
    this.cartError = null;
    // Si no hay usuario aún, espera a que se cargue
    if (!this.user?.id) {
      setTimeout(() => this.loadCart(), 300);
      return;
    }
    this.cartService.listCarts().subscribe({
      next: (carts) => {
        const userId = this.user?.id;
        let cart = carts.find((c: any) => c.user_id === userId);
        if (!cart && userId) {
          this.createCartForUser(userId);
        } else {
          this.cart = cart;
          this.cartItems = cart?.items || [];
          this.cartTotal = this.cartItems.reduce((sum: number, item: any) => sum + (item.product?.price * item.quantity), 0);
          this.cartLoading = false;
        }
      },
      error: (err) => {
        // Si es 403 o 404, intenta crear el carrito igual
        if ((err.status === 403 || err.status === 404) && this.user?.id) {
          this.createCartForUser(this.user.id);
        } else {
          this.cartError = 'Error al cargar el carrito';
          this.cartLoading = false;
        }
      }
    });
  }

  private createCartForUser(userId: number) {
    this.cartService.createCart({ user_id: userId, items: [] }).subscribe({
      next: (newCart) => {
        this.cart = newCart;
        this.cartItems = [];
        this.cartTotal = 0;
        this.cartLoading = false;
      },
      error: (err) => {
        this.cartError = 'No se pudo crear el carrito';
        this.cartLoading = false;
      }
    });
  }

  addProductToCart(product: Product) {
    if (!this.cart) return;
    const item: CartItemCreate = { quantity: 1, product };
    this.cartLoading = true;
    this.cartService.addProductToCart(this.cart.id, item).subscribe({
      next: (updatedCart) => {
        this.cartItems = updatedCart.items || [];
        this.cartTotal = this.cartItems.reduce((sum: number, i: any) => sum + (i.product?.price * i.quantity), 0);
        this.cartLoading = false;
      },
      error: (err) => {
        this.cartError = 'No se pudo agregar el producto';
        this.cartLoading = false;
      }
    });
  }

  removeProductFromCart(productId: number) {
    if (!this.cart) return;
    this.cartLoading = true;
    this.cartService.deleteProductFromCart(this.cart.id, productId).subscribe({
      next: (updatedCart) => {
        // Recargar el carrito
        this.loadCart();
      },
      error: (err) => {
        this.cartError = 'No se pudo eliminar el producto';
        this.cartLoading = false;
      }
    });
  }

  startEditProfile() {
    if (!this.user) return;
    this.editingProfile = true;
    this.profileForm = {
      name: this.user.name || '',
      lastname: this.user.lastname || '',
      email: this.user.email || ''
    };
    this.profileMessage = null;
    this.profileError = null;
  }

  cancelEditProfile() {
    this.editingProfile = false;
    this.profileMessage = null;
    this.profileError = null;
  }

saveProfile() {
  this.profileMessage = null;
  this.profileError = null;
  this.clientService.updateUserProfile(this.profileForm).subscribe({
    next: (user: any) => {
      this.user = user;
      this.editingProfile = false;
      this.profileMessage = 'Perfil actualizado correctamente.';
    },
    error: (err: any) => { // <-- agrega ": any"
      console.error('Error al actualizar perfil:', err);
      this.profileError = err?.error?.detail || 'No se pudo actualizar el perfil.';
    }
  });
}
}
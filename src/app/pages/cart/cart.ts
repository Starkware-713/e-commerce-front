import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ClientDashboardService } from '../../services/client-dashboard.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  loading = true;
  error: string | null = null;
  cartId: number | null = null;
  couponCode: string = '';
  couponMessage: string = '';

  constructor(
    private cartService: CartService,
    private clientDashboard: ClientDashboardService,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (carts) => {
        // Se espera un array de carritos, tomamos el primero
        const cart = Array.isArray(carts) && carts.length > 0 ? carts[0] : null;
        if (cart) {
          this.cartId = cart.id;
          this.cartItems = cart.items || [];
          this.total = this.cartItems.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
        } else {
          this.cartItems = [];
          this.total = 0;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar el carrito';
        this.loading = false;
      }
    });
  }

  removeItem(item: any) {
    // Usar cartId y el id del item
    const cartId = this.cartId;
    const itemId = item.id;
    if (!cartId || !itemId) {
      this.error = 'No se pudo identificar el carrito o el item.';
      return;
    }
    this.loading = true;
    this.cartService.removeProductFromCart(cartId, itemId).subscribe({
      next: () => {
        // Elimina el item localmente y recalcula el total
        this.cartItems = this.cartItems.filter(i => i.id !== itemId);
        this.total = this.cartItems.reduce((sum, i) => sum + ((i.product?.price || 0) * i.quantity), 0);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al eliminar el producto';
        this.loading = false;
      }
    });
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity < 1) return;
    const cartId = this.cartId;
    const productId = item.product?.id;
    if (!cartId || !productId) {
      this.error = 'No se pudo identificar el carrito o el producto.';
      return;
    }
    this.loading = true;
    this.cartService.updateItemQuantity({ cartId, productId, quantity: newQuantity }).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.total = this.cartItems.reduce((sum, i) => sum + ((i.product?.price || 0) * i.quantity), 0);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al actualizar la cantidad';
        this.loading = false;
      }
    });
  }

  onQuantityInput(item: any, event: any) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      this.updateQuantity(item, value);
    } else {
      event.target.value = item.quantity;
    }
  }

  checkout() {
    this.loading = true;
    this.error = null;
    const cartId = this.cartId;
    if (!cartId) {
      this.error = 'No se pudo identificar el carrito.';
      this.loading = false;
      return;
    }
    this.cartService.checkoutCart(cartId).subscribe({
      next: (order) => {
        const orderId = order.id || order.order_id;
        if (!orderId) {
          this.error = 'No se pudo obtener el ID de la orden.';
          this.loading = false;
          return;
        }
        this.clientDashboard.createPaymentPreference(orderId).subscribe({
          next: (res) => {
            const mpUrl = res.init_point || res.sandbox_init_point;
            if (mpUrl) {
              window.location.href = mpUrl;
            } else {
              this.error = 'No se pudo obtener el enlace de pago.';
              this.loading = false;
            }
          },
          error: (err) => {
            this.error = err.message || 'Error al crear la preferencia de pago';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = err.message || 'Error al crear la orden';
        this.loading = false;
      }
    });
  }

  applyCoupon() {
    if (!this.couponCode || !this.cartId) {
      this.couponMessage = 'Ingresa un código de cupón válido.';
      return;
    }
    this.loading = true;
    this.paymentService.applyCoupon(this.cartId, this.couponCode).subscribe({
      next: (res) => {
        this.couponMessage = '¡Cupón aplicado correctamente!';
        this.loading = false;
        // Opcional: actualizar el total si el backend lo devuelve
        if (res.total) this.total = res.total;
      },
      error: (err) => {
        this.couponMessage = err.message || 'No se pudo aplicar el cupón.';
        this.loading = false;
      }
    });
  }
}
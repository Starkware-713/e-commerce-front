import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  loading = true;
  error: string | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        // Ajusta según la estructura real de la respuesta
        this.cartItems = cart.items || [];
        this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar el carrito';
        this.loading = false;
      }
    });
  }

  removeItem(item: any) {
    // Se asume que el objeto cart tiene un id y cada item tiene productId
    const cartId = item.cartId || (this.cartItems.length && this.cartItems[0].cartId) || item.cart_id || item.cart || (item.cart && item.cart.id);
    const productId = item.productId || (item.product && item.product.id);
    if (!cartId || !productId) {
      this.error = 'No se pudo identificar el carrito o producto.';
      return;
    }
    this.loading = true;
    this.cartService.removeProductFromCart(cartId, productId).subscribe({
      next: () => {
        // Elimina el producto localmente y recalcula el total
        this.cartItems = this.cartItems.filter(i => (i.productId || (i.product && i.product.id)) !== productId);
        this.total = this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
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
    const cartId = item.cartId || (this.cartItems.length && this.cartItems[0].cartId) || item.cart_id || item.cart || (item.cart && item.cart.id);
    const productId = item.productId || (item.product && item.product.id);
    if (!cartId || !productId) {
      this.error = 'No se pudo identificar el carrito o producto.';
      return;
    }
    this.loading = true;
    this.cartService.updateItemQuantity({ productId, quantity: newQuantity }).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.total = this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
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
}
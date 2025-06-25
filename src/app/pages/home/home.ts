import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  addToCartLoadingMap: { [id: string]: boolean } = {};
  addToCartMessageMap: { [id: string]: string } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (response: Product[]) => {
        this.products = response;
        this.loading = false;
        console.log('Productos cargados:', this.products);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        console.error('Error al cargar productos:', {
          status: error.status,
          message: error.message,
          details: error.error
        });
      }
    });
  }

  agregarAlCarrito(product: Product) {
    this.addToCartMessageMap[product.id] = '';
    this.addToCartLoadingMap[product.id] = true;
    if (!this.authService.isLoggedIn()) {
      this.addToCartMessageMap[product.id] = 'Debes iniciar sesión para agregar productos al carrito.';
      this.addToCartLoadingMap[product.id] = false;
      return;
    }
    this.cartService.getCart().subscribe({
      next: (carts: any) => {
        let cart = Array.isArray(carts) ? carts.find((c: any) => c.status === 'active' || c.status === 'pending') : null;
        if (!cart && Array.isArray(carts) && carts.length > 0) cart = carts[0];
        if (cart) {
          this.cartService.addProductToCart(cart.id, { quantity: 1, product }).subscribe({
            next: () => {
              this.addToCartMessageMap[product.id] = 'Producto agregado al carrito.';
              this.addToCartLoadingMap[product.id] = false;
            },
            error: (err) => {
              const msg = err?.error?.detail || 'No se pudo agregar al carrito.';
              this.addToCartMessageMap[product.id] = msg;
              this.addToCartLoadingMap[product.id] = false;
            }
          });
        } else {
          const user = this.authService.getCachedUser();
          if (!user || !user.id) {
            this.addToCartMessageMap[product.id] = 'No se pudo identificar el usuario.';
            this.addToCartLoadingMap[product.id] = false;
            return;
          }
          this.cartService.createCart({
            user_id: user.id,
            items: [{ quantity: 1, product }]
          }).subscribe({
            next: () => {
              this.addToCartMessageMap[product.id] = 'Carrito creado y producto agregado.';
              this.addToCartLoadingMap[product.id] = false;
            },
            error: (err) => {
              const msg = err?.error?.detail || 'No se pudo crear el carrito.';
              this.addToCartMessageMap[product.id] = msg;
              this.addToCartLoadingMap[product.id] = false;
            }
          });
        }
      },
      error: (err) => {
        const msg = err?.error?.detail || 'No se pudo obtener el carrito.';
        this.addToCartMessageMap[product.id] = msg;
        this.addToCartLoadingMap[product.id] = false;
      }
    });
  }
}
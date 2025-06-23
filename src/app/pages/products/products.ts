import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

// Adapted interface for API response
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'vuelos' | 'alquiler_autos' | 'hotel' | 'all_inclusive' | string;
  stock: number;
  image_url?: string | null;
  sku?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string | null;
  created_by?: number;
  updated_by?: number | null;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  addToCartMessage: string | null = null;
  addToCartLoading = false;
  addToCartMessageMap: { [id: number]: string } = {};
  addToCartLoadingMap: { [id: number]: boolean } = {};

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;
      if (id !== null && !isNaN(id)) {
        this.productService.getProduct(id).subscribe({
          next: (product: any) => {
            this.product = product;
            this.isLoading = false;
          },
          error: () => {
            this.error = 'No se pudo cargar el producto';
            this.isLoading = false;
          }
        });
      } else {
        this.productService.getProducts().subscribe({
          next: (products: any[]) => {
            this.products = products;
            this.isLoading = false;
          },
          error: () => {
            this.error = 'No se pudieron cargar los productos';
            this.isLoading = false;
          }
        });
      }
    });
  }

  addToCart(product: Product) {
    // Feedback global para detalle, por producto para lista
    if (this.product && this.product.id === product.id) {
      this.addToCartMessage = null;
      this.addToCartLoading = true;
    } else {
      this.addToCartMessageMap[product.id] = '';
      this.addToCartLoadingMap[product.id] = true;
    }
    if (!this.authService.isLoggedIn()) {
      const msg = 'Debes iniciar sesión para agregar productos al carrito.';
      if (this.product && this.product.id === product.id) {
        this.addToCartMessage = msg;
        this.addToCartLoading = false;
      } else {
        this.addToCartMessageMap[product.id] = msg;
        this.addToCartLoadingMap[product.id] = false;
      }
      return;
    }
    this.cartService.getCart().subscribe({
      next: (carts: any) => {
        let cart = Array.isArray(carts) ? carts.find((c: any) => c.status === 'active' || c.status === 'pending') : null;
        if (!cart && Array.isArray(carts) && carts.length > 0) cart = carts[0];
        if (cart) {
          this.cartService.addProductToCart(cart.id, { quantity: 1, product }).subscribe({
            next: () => {
              if (this.product && this.product.id === product.id) {
                this.addToCartMessage = 'Producto agregado al carrito.';
                this.addToCartLoading = false;
              } else {
                this.addToCartMessageMap[product.id] = 'Producto agregado al carrito.';
                this.addToCartLoadingMap[product.id] = false;
              }
            },
            error: (err) => {
              const msg = err?.error?.detail || 'No se pudo agregar al carrito.';
              if (this.product && this.product.id === product.id) {
                this.addToCartMessage = msg;
                this.addToCartLoading = false;
              } else {
                this.addToCartMessageMap[product.id] = msg;
                this.addToCartLoadingMap[product.id] = false;
              }
            }
          });
        } else {
          const user = this.authService.getCachedUser();
          if (!user || !user.id) {
            const msg = 'No se pudo identificar el usuario.';
            if (this.product && this.product.id === product.id) {
              this.addToCartMessage = msg;
              this.addToCartLoading = false;
            } else {
              this.addToCartMessageMap[product.id] = msg;
              this.addToCartLoadingMap[product.id] = false;
            }
            return;
          }
          this.cartService.createCart({
            user_id: user.id,
            items: [{ quantity: 1, product }]
          }).subscribe({
            next: () => {
              if (this.product && this.product.id === product.id) {
                this.addToCartMessage = 'Carrito creado y producto agregado.';
                this.addToCartLoading = false;
              } else {
                this.addToCartMessageMap[product.id] = 'Carrito creado y producto agregado.';
                this.addToCartLoadingMap[product.id] = false;
              }
            },
            error: (err) => {
              const msg = err?.error?.detail || 'No se pudo crear el carrito.';
              if (this.product && this.product.id === product.id) {
                this.addToCartMessage = msg;
                this.addToCartLoading = false;
              } else {
                this.addToCartMessageMap[product.id] = msg;
                this.addToCartLoadingMap[product.id] = false;
              }
            }
          });
        }
      },
      error: (err) => {
        const msg = err?.error?.detail || 'No se pudo obtener el carrito.';
        if (this.product && this.product.id === product.id) {
          this.addToCartMessage = msg;
          this.addToCartLoading = false;
        } else {
          this.addToCartMessageMap[product.id] = msg;
          this.addToCartLoadingMap[product.id] = false;
        }
      }
    });
  }

  // Carrusel scroll para productos
  carouselScroll(direction: 'left' | 'right') {
    const carousel = document.querySelector('.carousel-list') as HTMLElement;
    if (!carousel) return;
    const cardWidth = carousel.querySelector('.carousel-card')?.clientWidth || 300;
    const scrollAmount = cardWidth * 2; // Desliza 2 productos
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}

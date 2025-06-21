import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

// Adapted interface for API response
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
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
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
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
}

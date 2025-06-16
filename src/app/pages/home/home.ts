import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

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
  }}

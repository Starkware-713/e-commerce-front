import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;
  paisBusqueda: string = '';
  paquetes: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }
  paquetesFiltrados: any[] = [];

  buscarPaquetes() {
    const country = this.paisBusqueda.trim().toLowerCase();
    this.paquetesFiltrados = this.paquetes.filter(
      p => p.country.toLowerCase().includes(country)
    );
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


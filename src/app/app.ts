
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { ProductService, Product } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  products: Product[] = [];
  protected title = 'e-commerce-etp';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: Product[]) => {
        this.products = response;
        console.log('Productos cargados:', this.products);
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }
}

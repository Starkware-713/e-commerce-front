 import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';

interface Hospedaje {
  nombre: string;
  destino: string;
  descripcion: string;
  imagen: string;
  fecha: string;
  estrellas: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;
  tabSeleccionado = 0;

  // Formulario de vuelos
  origen = '';
  destino = '';
  partida = '';
  regreso = '';
  pasajeros = 1;
  clase = 'Economy';
  flexible = true;

  // Estado de búsqueda
  hospedajesDisponibles: Hospedaje[] = [];
  mostrarHospedajes = false;
  reservaRealizada: any = null;
  mensajeCheckin = '';
  estadoVuelo = '';

  // Hospedajes de ejemplo
  hospedajes: Hospedaje[] = [
    {
      nombre: 'Hotel Central',
      destino: 'Buenos Aires',
      descripcion: 'Ubicado en el corazón de la ciudad, cerca de los principales atractivos turísticos.',
      imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      fecha: '12/06/2025',
      estrellas: 4
    },
    {
      nombre: 'Bariloche Suites',
      destino: 'Bariloche',
      descripcion: 'Disfruta de la vista al lago y la comodidad de nuestras habitaciones modernas.',
      imagen: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
      fecha: '20/07/2025',
      estrellas: 5
    },
    {
      nombre: 'Hostel Patagonia',
      destino: 'El Calafate',
      descripcion: 'Ideal para aventureros, con excursiones y ambiente juvenil.',
      imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      fecha: '05/08/2025',
      estrellas: 3
    },
    {
      nombre: 'Mar del Plata Resort',
      destino: 'Mar del Plata',
      descripcion: 'Resort familiar con pileta, spa y acceso directo a la playa.',
      imagen: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      fecha: '18/09/2025',
      estrellas: 4
    }
  ];

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
  }

  seleccionarTab(idx: number) {
    this.tabSeleccionado = idx;
    this.mensajeCheckin = '';
    this.estadoVuelo = '';
    this.error = null;
  }

  buscarVuelos() {
    if (!this.origen || !this.destino || !this.partida) {
      this.error = 'Por favor, completa Origen, Destino y Fecha de partida.';
      return;
    }
    this.error = null;
    this.hospedajesDisponibles = this.hospedajes.filter(h =>
      h.destino.toLowerCase().includes(this.destino.trim().toLowerCase())
    );
    this.mostrarHospedajes = true;
    this.reservaRealizada = {
      origen: this.origen,
      destino: this.destino,
      partida: this.partida,
      regreso: this.regreso,
      pasajeros: this.pasajeros,
      clase: this.clase
    };
  }

  hacerCheckin() {
    if (!this.reservaRealizada) {
      this.mensajeCheckin = 'Primero realiza una reserva de vuelo.';
    } else {
      this.mensajeCheckin = '¡Check-in realizado con éxito para tu vuelo a ' + this.reservaRealizada.destino + '!';
    }
  }

  consultarEstadoVuelo() {
    if (!this.reservaRealizada) {
      this.estadoVuelo = 'Primero realiza una reserva de vuelo.';
    } else {
      this.estadoVuelo = 'Tu vuelo a ' + this.reservaRealizada.destino + ' está programado y a horario.';
    }
  }
}
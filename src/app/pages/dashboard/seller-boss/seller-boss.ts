import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pedido {
  codigo: string;
  descripcion: string;
  precio: number;
  estado: 'Entregado' | 'Pendiente';
  cliente: string;
  fecha: string;
}

@Component({
  selector: 'app-seller-boss',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-boss.html',
  styleUrls: ['./seller-boss.css']
})
export class SellerBoss {
  totalVentas = 1200000;
  totalClientes = 320;
  pedidosPendientes = 8;

  pedidos: Pedido[] = [
    {
      codigo: 'PKG001',
      descripcion: 'Paquete turístico a Iguazú',
      precio: 150000,
      estado: 'Entregado',
      cliente: 'Juan Pérez',
      fecha: '10/06/2025'
    },
    {
      codigo: 'PKG002',
      descripcion: 'Vuelo a Bariloche',
      precio: 120000,
      estado: 'Pendiente',
      cliente: 'María López',
      fecha: '12/06/2025'
    }
  ];
}

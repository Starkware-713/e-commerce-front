import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Compra {
  producto: string;
  fecha: string;
  estado: 'Entregado' | 'Pendiente';
  monto: number;
}

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {
  user = {
    name: 'Juan Pérez',
    email: 'juan.perez@gmail.com',
    memberSince: '2023',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  compras: Compra[] = [
    { producto: 'Vuelo a Córdoba', fecha: '10/06/2025', estado: 'Entregado', monto: 80000 },
    { producto: 'Paquete a Bariloche', fecha: '05/05/2025', estado: 'Pendiente', monto: 120000 }
  ];

  get comprasPendientes(): number {
    return this.compras.filter(c => c.estado === 'Pendiente').length;
  }

  get totalGastado(): number {
    return this.compras.filter(c => c.estado === 'Entregado').reduce((acc, c) => acc + c.monto, 0);
  }

  editProfile() {
    // Lógica para editar perfil
    alert('Funcionalidad de edición de perfil próximamente.');
  }
}

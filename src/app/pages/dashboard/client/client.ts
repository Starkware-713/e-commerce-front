import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDashboardService } from '../../../services/client-dashboard.service';
import { User } from '../../../services/auth.service';
import { Order } from '../../../services/client-dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  ordersError: string | null = null; // campo para errores de órdenes
  editingProfile = false;
  profileForm = {
    name: '',
    lastname: '',
    email: ''
  };
  profileMessage: string | null = null;
  profileError: string | null = null;

  constructor(private clientService: ClientDashboardService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadOrders();
  }

  private loadUserData() {
    this.clientService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm = {
          name: user.name || '',
          lastname: user.lastname || '',
          email: user.email || ''
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los datos del usuario';
        this.loading = false;
        console.error('Error loading user data:', error);
      }
    });
  }

  private loadOrders() {
    this.clientService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersError = null;
      },
      error: (error) => {
        // Manejo específico para 404 con mensaje "No hay órdenes para el usuario"
        if (error.status === 404 && error.error?.detail === 'No hay órdenes para el usuario') {
          this.orders = [];
          this.ordersError = 'No hay órdenes para el usuario';
        } else {
          this.ordersError = 'Error al cargar el historial de pedidos';
        }
        console.error('Error loading orders:', error);
      }
    });
  }

  startEditProfile() {
    if (!this.user) return;
    this.editingProfile = true;
    this.profileForm = {
      name: this.user.name || '',
      lastname: this.user.lastname || '',
      email: this.user.email || ''
    };
    this.profileMessage = null;
    this.profileError = null;
  }

  cancelEditProfile() {
    this.editingProfile = false;
    this.profileMessage = null;
    this.profileError = null;
  }

saveProfile() {
  this.profileMessage = null;
  this.profileError = null;
  this.clientService.updateUserProfile(this.profileForm).subscribe({
    next: (user: any) => {
      this.user = user;
      this.editingProfile = false;
      this.profileMessage = 'Perfil actualizado correctamente.';
    },
    error: (err: any) => { // <-- agrega ": any"
      console.error('Error al actualizar perfil:', err);
      this.profileError = err?.error?.detail || 'No se pudo actualizar el perfil.';
    }
  });
}
}
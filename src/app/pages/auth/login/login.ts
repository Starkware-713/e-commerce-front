import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Inicializar la API al cargar el componente
    this.authService.initializeAPI().subscribe({
      error: (error) => console.error('Error al inicializar la API:', error)
    });

    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      const dashboardUrl = this.authService.getDashboardUrl();
      this.router.navigate([dashboardUrl]);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Intentando iniciar sesión con:', credentials);

      this.authService.loginAndFetchProfile(credentials).subscribe({
        next: (user) => {
          console.log('Login y perfil exitosos:', user);
          const dashboardUrl = this.authService.getDashboardUrl();
          console.log('Redirigiendo a:', dashboardUrl);
          this.router.navigate([dashboardUrl]);
        },
        error: (error) => {
          console.error('Error en el login:', error);
          if (error.status === 401) {
            this.errorMessage = error.error?.detail || 'Email o contraseña incorrectos';
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar con el servidor';
          } else {
            this.errorMessage = error.message || 'Error desconocido al iniciar sesión';
          }
          this.submitted = false;
        }
      });
    }
  }

  // Getters para acceder fácilmente a los campos del formulario
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
      ]],
      password: ['', [
        Validators.required, 
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Inicializar la API al cargar el componente
    this.authService.initializeAPI().subscribe({
      error: (error) => console.error('Error al inicializar la API:', error)
    });
  }

  // Validador personalizado para confirmar contraseña
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    console.log('Iniciando envío del formulario');
    this.submitted = true;

    const userData = {
      name: this.registerForm.value.name || '',
      lastname: this.registerForm.value.lastname || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
      confirm_password: this.registerForm.value.confirmPassword || '',
      rol: "comprador" // Por defecto, todos los registros son como compradores
    };

    console.log('Datos a enviar:', userData);

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso', response);
        
        // Iniciar sesión automáticamente después del registro
        this.authService.login({
          email: userData.email,
          password: userData.password
        }).subscribe({
          next: () => {
            // Redirigir al dashboard correspondiente según el rol
            const dashboardUrl = this.authService.getDashboardUrl();
            this.router.navigate([dashboardUrl]);
          },
          error: (error) => {            console.error('Error al iniciar sesión después del registro:', error);
            alert('Registro exitoso. Por favor, inicia sesión.');
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error: any) => {
        console.error('Error detallado en el registro:', error);
        alert('Error en el registro: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for error messages
  getPasswordErrorMessage(): string {
    const password = this.registerForm.get('password');
    if (password?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (password?.hasError('pattern')) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const confirmPassword = this.registerForm.get('confirmPassword');
    if (confirmPassword?.hasError('required')) {
      return 'Debe confirmar la contraseña';
    }
    if (confirmPassword?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  // Método para mostrar el estado de validación del formulario
  getFormValidationStatus(): string {
    const controls = this.registerForm.controls;
    let status = '';

    if (controls['name'].errors) {
      status += 'Nombre: ' + JSON.stringify(controls['name'].errors) + '\n';
    }
    if (controls['lastname'].errors) {
      status += 'Apellido: ' + JSON.stringify(controls['lastname'].errors) + '\n';
    }
    if (controls['email'].errors) {
      status += 'Email: ' + JSON.stringify(controls['email'].errors) + '\n';
    }
    if (controls['password'].errors) {
      status += 'Contraseña: ' + JSON.stringify(controls['password'].errors) + '\n';
    }
    if (controls['confirmPassword'].errors) {
      status += 'Confirmar Contraseña: ' + JSON.stringify(controls['confirmPassword'].errors) + '\n';
    }

    return status || 'Todos los campos son válidos';
  }

  // Helper method to access form controls in the template
  get name() { return this.registerForm.get('name'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
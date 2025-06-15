
import { Component } from '@angular/core';
import { AuthService } from '../../../services';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    this.submitted = true;

    if (this.registerForm.valid) {
      const userData = {
        name: this.registerForm.value.name,
        lastname: this.registerForm.value.lastname,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error en el registro', error);
          // Aquí puedes manejar diferentes tipos de errores
          if (error.status === 409) {
            this.registerForm.get('email')?.setErrors({ alreadyExists: true });
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
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

  // Getter methods for form controls
  get name() { return this.registerForm.get('name'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Helper methods for error messages
  getPasswordErrorMessage(): string {
    const control = this.password;
    if (control?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (control?.hasError('pattern')) {
      return 'La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.confirmPassword;
    if (control?.hasError('required')) {
      return 'La confirmación de contraseña es requerida';
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}

import { Component } from '@angular/core';
import { Services } from '../../../services/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private Services: Services) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.Services.postData(this.registerForm.value).subscribe(
        response => {
          console.log('Registro exitoso', response);
        },
        error => {
          console.error('Error en el registro', error);
        }
      );
    }
  }
}
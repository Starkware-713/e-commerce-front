import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    const mailto = `mailto:ecommerce.etp.713@gmail.com?subject=Contacto%20de%20${encodeURIComponent(name)}&body=Email:%20${encodeURIComponent(email)}%0A%0AMensaje:%0A${encodeURIComponent(message)}`;
    window.location.href = mailto;
  }
}

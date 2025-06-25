import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobrenosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobrenosotros.html',
  styleUrls: ['./sobrenosotros.css']
})
export class SobreNosotros {
  empresa = {
    nombre: 'Nuestra Empresa',
    descripcion1: 'Somos una empresa dedicada a ofrecer vuelos, hospedajes y experiencias únicas de paseos por diferentes países, brindando a nuestros usuarios una forma cómoda, sencilla y segura de planificar sus viajes. Nuestra misión es facilitar el acceso a destinos soñados, con atención personalizada y tecnología de vanguardia, para que cada cliente viva una experiencia inolvidable desde el primer clic.',
    descripcion2: 'Nos destacamos por la transparencia, la innovación y el compromiso con la satisfacción de nuestros clientes. Trabajamos día a día para ofrecer las mejores ofertas y un servicio integral, acompañando a cada viajero en todo el proceso, desde la búsqueda hasta la reserva y el soporte post-venta.'
  };

  equipo = [
    {
      nombre: 'Walter Carrasco',
      rol: 'Desarrollador Full Stack',
      descripcion: 'Responsable del desarrollo tanto del frontend como del backend, Walter aporta su experiencia en arquitectura de software y soluciones escalables, asegurando la calidad y el rendimiento de la plataforma.'
    },
    {
      nombre: 'Bruno Almonacid',
      rol: 'Desarrollador Frontend',
      descripcion: 'Especialista en interfaces modernas y usabilidad, Bruno se encarga de que la experiencia de usuario sea intuitiva, atractiva y eficiente en todos los dispositivos.'
    },
    {
      nombre: 'Juana Monzón',
      rol: 'Encargada de Documentación',
      descripcion: 'Juana es la responsable de la documentación técnica y funcional del proyecto, garantizando que cada proceso y funcionalidad esté correctamente detallado y accesible para el equipo y los usuarios.'
    },
    {
      nombre: 'Joaquín Narvay',
      rol: 'Desarrollador Frontend',
      descripcion: 'Joaquín contribuye al desarrollo de la interfaz de usuario, enfocándose en la optimización, el diseño responsivo y la integración de nuevas funcionalidades.'
    }
  ];
}

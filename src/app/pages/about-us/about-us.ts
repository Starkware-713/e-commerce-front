import { Component } from '@angular/core';

interface Estudiante {
  id: number;
  nombre: string;
  edad: number;
  descripcion: string;
  especialidad: string;
  foto: string;
  linkedin?: string;
  github?: string;
}

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {

  estudiantes: Estudiante[] = [
    {
      id: 1,
      nombre: 'Walter Carrasco',
      edad: 18,
      descripcion: 'Apasionado por el desarrollo web con un enfoque integral en backend y experiencia de usuario. Disfruto transformar ideas en soluciones funcionales, combinando lógica, rendimiento y diseño intuitivo. Siempre busco crear productos que no solo funcionen bien, sino que también se sientan bien al usarlos.',
      especialidad: 'Desarrollo Full Stack',
      foto: 'https://images.unsplash.com/photo-1494790108755-2616c95780c2?w=300&h=300&fit=crop&crop=face',
      github: 'https://github.com/someone1a'
    },
    {
      id: 2,
      nombre: 'Bruno Almonacid',
      edad: 18,
      descripcion: 'Interesado en el desarrollo backend y bases de datos. Me gusta resolver problemas complejos y optimizar sistemas.',
      especialidad: 'Desarrollo FrontEnd',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      linkedin: 'https://www.linkedin.com/in/bruno-santiago-almonacid-795408362/',
      github: 'https://github.com/brunoalmonacid'
    },
    {
      id: 3,
      nombre: 'Juanita Monzón',
      edad: 17,
      descripcion: 'Enfocada en diseño UX/UI y experiencia de usuario. Me encanta crear diseños que sean tanto hermosos como funcionales.',
      especialidad: 'Analista Funcional',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      linkedin: 'https://linkedin.com/in/marialopez'
    },
    {
      id: 4,
      nombre: 'Joaquin Narvay',
      edad: 18,
      descripcion: 'Apasionado por la tecnología móvil y las aplicaciones multiplataforma. Siempre buscando las últimas tendencias en desarrollo.',
      especialidad: 'Desarrollo Frontend',
      foto: 'img/joaquin.jpg',
      github: 'https://github.com/diegoramirez'
    }
  ];
  constructor() {

  }
}

import { Component } from '@angular/core';

interface Estudiante {
  id: number;
  nombre: string;
  edad: number;
  descripcion: string;
  especialidad: string;
  foto: string;
  linkedin?: string;
  instagram?: string;
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
      github: 'https://github.com/someone1a',
      linkedin: 'https://www.linkedin.com/in/walter-carrasco-255a97367/'
    },
    {
      id: 2,
      nombre: 'Bruno Almonacid',
      edad: 18,
      descripcion: 'interesado en el la electronica y la programación, me gusta el desarrollo de software pero me gusta mucho mas el hardware, el trabajar con placas, circuitos, armar y desarmar, me gusta dejar todo funcionando',
      especialidad: 'Desarrollo FrontEnd',
      foto: '/img/bruno.jpg',
      linkedin: 'https://www.linkedin.com/in/bruno-santiago-almonacid-795408362/',
      github: 'https://github.com/brunoalmonacid',
      instagram: 'http://instagram.com/santi_almonacid/'
    },
    {
      id: 3,
      nombre: 'Juanita Monzón',
      edad: 18,
      descripcion: 'Apasionada por el análisis funcional y el diseño UX/UI. Me motiva comprender las necesidades de los usuarios y traducirlas en soluciones digitales intuitivas, funcionales y atractivas. Disfruto colaborar con equipos multidisciplinarios para lograr productos que realmente marquen la diferencia.',
      especialidad: 'Analista Funcional',
      foto: '/img/juanita.jpg',
      instagram: 'https://www.instagram.com/juaniariel.m/',
    },
    {
      id: 4,
      nombre: 'Joaquin Narvay',
      edad: 18,
      descripcion: 'Apasionado por la tecnología móvil y las aplicaciones multiplataforma. Siempre buscando las últimas tendencias en desarrollo.',
      especialidad: 'Desarrollo Frontend',
      foto: '/img/joaquin.jpg',
      github: 'https://github.com/jotelson77',
      instagram: 'https://www.instagram.com/joaconarvay/'
    }
  ];
  constructor() {

  }
}

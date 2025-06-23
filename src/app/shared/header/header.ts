import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Navbar],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {}

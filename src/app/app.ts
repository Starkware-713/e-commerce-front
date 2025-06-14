import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Services } from './services/services';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  datos: any;
  protected title = 'e-commerce-etp';
  constructor(private Services: Services) {}

  ngOnInit() {
    this.Services.getData().subscribe(response => {
      this.datos = response;
      console.log(this.datos);
    });
}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HomeComponent } from '../app/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent ],
  template: `
  <app-home></app-home>
  <router-outlet></router-outlet>`,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'pokedex';

  ngOnInit(): void {
    initFlowbite();
  }
}

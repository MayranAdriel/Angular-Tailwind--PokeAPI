import { Component } from '@angular/core';
import {HomeTitleComponent} from './home-title/home-title.component'
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeTitleComponent, PokemonCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

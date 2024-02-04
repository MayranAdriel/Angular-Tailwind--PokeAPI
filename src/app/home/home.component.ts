import { Component } from '@angular/core';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PokemonCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

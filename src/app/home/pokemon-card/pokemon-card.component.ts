import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css',
})
export class PokemonCardComponent implements OnInit {

constructor(private service: PokemonService) { }

  name: string = 'Pikachu';
  imageUrl: string = '';
  attributes: string[] = ['Electric', 'Fire', 'Aqua'];

  ngOnInit(): void {
    this.service.getPokemonDetails('1').subscribe((data) => {
      console.log(data);
    });
  }
}

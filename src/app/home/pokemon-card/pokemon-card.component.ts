import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css',
})
export class PokemonCardComponent implements OnInit {
  constructor(private service: PokemonService) {}

  pokemons: any[] = [];

  numberId:number = 0;

  getPokemon: string = '';

  pokemon = {
    name: '',
    imageUrl: '',
    types: [],
  };

  ngOnInit(): void {}

  getPokemonChosen() {
    this.service.getPokemonDetails(this.getPokemon).subscribe((data) => {
      this.pokemon = {
        name: data.name,
        imageUrl: data.sprites.front_default,
        types: data.types.map(
          (type: { type: { name: any } }) => type.type.name
        ),
      };
      this.pokemons.push(this.pokemon);
    });
    this.numberId += 1;
  }
}

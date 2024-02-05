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


  getPokemon: string = '';


  pokemon = {
    name: '',
    imageUrl: '',
    types: [],
    numberId: 0,
  };

  ngOnInit(): void {
    const storedPokemons = localStorage.getItem('pokemons');
    if (storedPokemons) {
      this.pokemons = JSON.parse(storedPokemons);
    }
  }

  getPokemonChosen() {
    this.service.getPokemonDetails(this.getPokemon).subscribe((data) => {
      this.pokemon = {
        name: data.name,
        imageUrl: data.sprites.front_default,
        types: data.types.map(
          (type: { type: { name: any } }) => type.type.name
        ),
        numberId: data.id
      };
      console.log(data)
      this.pokemons.push(this.pokemon);

      localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
    });
  }

  deletePokemons(){
    localStorage.removeItem('pokemons');
    this.pokemons = []
  }
}

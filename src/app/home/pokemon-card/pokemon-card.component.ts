import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';



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
    statsName: '',
    statsNumber: 0,
  };

  ngOnInit(): void {
    const storedPokemons = localStorage.getItem('pokemons');
    if (storedPokemons) {
      this.pokemons = JSON.parse(storedPokemons);
    }
  }

  getPokemonChosen() {
    if (this.getPokemon !== '') {
      this.service
        .getPokemonDetails(this.getPokemon.toLowerCase())
        .subscribe((data) => {
          if (this.alreadyAdded(data.name) === false) {
            this.pokemon = {
              name: data.name,
              imageUrl: data.sprites.front_default,
              types: data.types.map(
                (type: { type: { name: string } }) => type.type.name
              ),
              numberId: data.id,
              statsName: data.stats.map(
                (stat: { stat: { name: string } }) => stat.stat.name
              ),
              statsNumber: data.stats.map((stat: { base_stat: number }) =>
                stat.base_stat.toString()
              ),
            };
            this.pokemons.push(this.pokemon);

            localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
          } else {
            Swal.fire(`Esse Pokémon (${data.name}) já foi adicionado!`)
          }
        });
    } else {
      Swal.fire('Digite um Pokémon para adicionar!')
    }
  }

  alreadyAdded(name: string) {
    let toCheckName = false;
    this.pokemons.forEach((toCheck) => {
      if (toCheck.name === name) {
        toCheckName = true;
      }
    });
    return toCheckName;
  }

  deletePokemons() {
    localStorage.removeItem('pokemons');
    this.pokemons = [];
  }
}

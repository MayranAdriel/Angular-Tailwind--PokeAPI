import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements OnInit{


name: string = 'Pikachu';
imageUrl:string = '';
attributes: string[] = ['Electric','Fire'];

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseURL:string = ''

  constructor(private Http: HttpClient) {
    this.baseURL = environment.pokeAPI
  }

  getPokemonDetails(pokemon:string): Observable<any> {
    const url = `${this.baseURL}/${pokemon}`
    return this.Http.get(url)
  }
}

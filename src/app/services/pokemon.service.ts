import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {PokemonCardComponent} from '../home/pokemon-card/pokemon-card.component'

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseURL: string = '';

  constructor(private Http: HttpClient) {
    this.baseURL = environment.pokeAPI;
  }


  getPokemonDetails(pokemon: string): Observable<any> {
    const url = `${this.baseURL}/${pokemon}`;
    return this.Http.get(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      alert(`Aconteceu um erro por parte do cliente ${error.status}`)
    } else {
      alert(`Pokemon não encontrado ${error.status}`)
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2'

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
      Swal.fire({
        icon: 'warning',
        title: 'Erro de conexão',
        text: 'Verifique sua conexão com a internet e tente novamente',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: `Pokemon não encontrado! ${error.status}`,
        text: 'Tente com outro nome',

      })
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { Hero } from '../interfaces/hero';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl+'/heroes');
  }

  getHeroById( id: string): Observable<Hero | undefined> {
    return this.http.get<Hero | undefined>(this.baseUrl+'/heroes/'+id)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  // http://localhost:3000/heroes?q=a&_limit=6
  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl+'/heroes?q='+query+'&_limit=6');

  }

}

import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs/observable';
import { MessageService } from './message.service';

@Injectable()
export class HeroService {
  // Method that returns all Heroes
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes wow')),
        catchError(this.handleError('getHeroes', []))
      )
  }
  // Methd that get a particular hero by id
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  // Method that updates hero by id
  updateHero(hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updatedHero'))
    );
  }
  // Method that  adds hero to heroes list
  addHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id =typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deletedHero'))
    );
  }
 
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  /** Log a HeroService message with the MessageService */
private log(message: string) {
  this.messageService.add('HeroService: ' + message);
}
private heroesUrl = 'api/heroes';

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

}

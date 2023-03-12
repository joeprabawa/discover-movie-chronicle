import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development'

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor(private _http: HttpClient) { }

  private DISCOVER_BASE_URL = 'https://api.themoviedb.org/3/discover/movie';

  private MOVIE_DETAIL_URL = 'https://api.themoviedb.org/3/movie/';

  private GENRES_BASE_URL = 'https://api.themoviedb.org/3/genre/movie/list'

  getGenreMovies(): Observable<any> {
    return this._http.get(this.GENRES_BASE_URL, {
      params: new HttpParams({
        fromObject: {
          api_key: environment.API_KEY
        }
      })
    }).pipe(
      catchError(error => of(error)),
      map(response => response)
    )
  }

  getDiscoverMovies(filterAndSort: { [T: string]: string }): Observable<any> {
    const params = filterAndSort && Object.keys(filterAndSort).reduce((accumulator, key) => {
      const lookup: any = {
        'sortBy': { ['sort_by']: filterAndSort[key] },
        'startDate': { ['primary_release_date.gte']: filterAndSort[key] },
        'endDate': { ['primary_release_date.lte']: filterAndSort[key] },
      }

      if (filterAndSort[key]) {
        accumulator = { ...accumulator, ...lookup[key] }
      }

      return accumulator
    }, {} as { [T: string]: string })
    return this._http.get(this.DISCOVER_BASE_URL, {
      params: new HttpParams({
        fromObject: {
          api_key: environment.API_KEY,
          include_adult: false,
          page: 1,
          ...params
        }
      })
    }).pipe(
      catchError(error => of(error)),
      map(response => response)
    )
  }

  getMovieDetail(movieId: number): Observable<any> {
    return this._http.get(`${this.MOVIE_DETAIL_URL}${movieId}`, {
      params: new HttpParams({
        fromObject: {
          api_key: environment.API_KEY,
        }
      })
    }).pipe(
      catchError(error => of(error)),
      map(response => response)
    )
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development'
import { MovieDetail } from '../models/MovieDetail';
import { FavouriteMovie } from '../models/FavouriteMovie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  constructor(private _http: HttpClient, private _snackbar: MatSnackBar) { }

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

  markMovieAsFavourite(movie: MovieDetail, movieId:number): void {
    const storage: FavouriteMovie[] = JSON.parse(localStorage.getItem('myFavouriteMovies') as string);

      if (!storage?.length) {
        const parseMovie = JSON.stringify([{ ...movie, date_added: new Date() }])
        localStorage.setItem('myFavouriteMovies', parseMovie);
        this._snackbar.open('Success! Movie listed as favourite', undefined, {
          panelClass: ['snackbar-success'],
          duration: 2000
        })
        return;
      }

      const findItem: FavouriteMovie = storage.find(movie => movie.id === movieId) as FavouriteMovie
      if (findItem) {
        this._snackbar.open('Movie already listed as favourite', undefined, {
          panelClass: ['snackbar-warning'],
          duration: 2000
        })
        return;
      }

      storage.push({ ...movie, date_added: new Date() })
      localStorage.setItem('myFavouriteMovies', JSON.stringify(storage));

      this._snackbar.open('Success! Movie listed as favourite', undefined, {
        panelClass: ['snackbar-success'],
        duration: 2000
      })
    }
    
}

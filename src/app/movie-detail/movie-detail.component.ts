import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map, of, Subject, switchMap, tap, zip } from 'rxjs';
import { AppService } from '../services/app.service';
import { MovieDetail } from '../models/MovieDetail';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DurationRuntimePipe } from '../pipes/duration.pipe';
import { FavouriteMovie } from '../models/FavouriteMovie';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    DurationRuntimePipe
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent {
  private _movieId$: Subject<number> = new Subject();

  constructor(private _route: ActivatedRoute, private _appService: AppService, private _snackbar: MatSnackBar) { }

  movieDetail$ = this._route.params.pipe(
    switchMap(params => this._appService.getMovieDetail(params['movieId'])),
    tap(console.log),
    map(response => MovieDetail.parse(response)),
  )

  saveToFavouriteAction$ = this._movieId$.asObservable().pipe(
    filter(movieId => !!movieId),
    switchMap((movieId) => zip(
      this._appService.getMovieDetail(movieId),
      of(movieId)
    )),
    map(([response, movieId]) => ({ movie: FavouriteMovie.parse(response), movieId })),
    tap(({ movie, movieId }) => {
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
    })
  )

  markAsFavourite(movieId: number): void {
    this._movieId$.next(movieId)
  }

}

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

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    DurationRuntimePipe
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent {
  private _movieId$: Subject<number> = new Subject();

  constructor(private _route: ActivatedRoute, private _appService: AppService) { }

  movieDetail$ = this._route.params.pipe(
    switchMap(params => this._appService.getMovieDetail(params['movieId'])),
    map(response => MovieDetail.parse(response)),
  )

  saveToFavouriteAction$ = this._movieId$.asObservable().pipe(
    filter(movieId => !!movieId),
    switchMap((movieId) => zip(
      this._appService.getMovieDetail(movieId),
      of(movieId)
    )),
    map(([response, movieId]) => ({ movie: FavouriteMovie.parse(response), movieId })),
    tap(({ movie, movieId }) => this._appService.markMovieAsFavourite(movie, movieId))
  )

  markAsFavourite(movieId: number): void {
    this._movieId$.next(movieId)
  }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { combineLatest, filter, map, Observable, of, startWith, Subject, switchMap, tap, zip } from 'rxjs';
import { AppService } from '../services/app.service';
import { Discover } from '../models/Discover';
import { RouterModule } from '@angular/router';
import { FavouriteMovie } from '../models/FavouriteMovie';
import * as moment from 'moment';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {

  constructor(private _fb: FormBuilder, private _appService: AppService) { }

  primaryReleaseDate: FormGroup = this._fb.group({
    startDate: ['', { disabled: true }],
    endDate: ['', { disabled: true }]
  })

  sorting: FormGroup = this._fb.group({
    popularity: ['desc'],
    release_date: ['desc'],
    vote_count: ['desc']
  })

  get primaryReleaseDateControls() {
    return this.primaryReleaseDate.controls;
  }

  get sortingControls() {
    return this.sorting.controls;
  }

  private _sorting: Subject<{ key: string, value: string }> = new Subject();

  private _movieId$: Subject<number> = new Subject();

  filterAndSort$ = combineLatest([
    this.primaryReleaseDate.valueChanges.pipe(startWith(null)),
    this._sorting.asObservable().pipe(startWith({ key: 'popularity', value: 'desc' }))
  ]).pipe(
    map(([primaryReleaseDate, sorting]) => {
      return {
        sortBy: `${[sorting?.key]}.${sorting?.value}`,
        startDate: primaryReleaseDate?.startDate && moment(primaryReleaseDate.startDate).format('YYYY-MM-DD').valueOf(),
        endDate: primaryReleaseDate?.endDate && moment(primaryReleaseDate.endDate).format('YYYY-MM-DD').valueOf()
      }
    })
  )

  discoverMovies$: Observable<Discover[]> = this.filterAndSort$.pipe(
    switchMap(filterAndSort => zip(
      this._appService.getGenreMovies(),
      this._appService.getDiscoverMovies(filterAndSort)
    )),
    map(([genres, movies]) => {
      const result = movies.results.map((result: any) => Discover.parse(result, genres))
      return result;
    })
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

  sortIconDict(value: 'asc' | 'desc'): string {
    const lookup = {
      'asc': 'arrow_upward',
      'desc': 'arrow_downward'
    }
    return lookup[value];
  }

  onToggle(event: any, fbKey: string): void {
    const value = event.value === 'asc' ? 'desc' : 'asc';
    this.sortingControls[fbKey].setValue(value);
    this._sorting.next({ key: fbKey, value })
  }

  onResetDate(): void {
    this.primaryReleaseDate.reset();
  }

  markAsFavourite(movieId: number): void {
    this._movieId$.next(movieId)
  }

}

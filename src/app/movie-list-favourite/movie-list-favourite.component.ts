import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FavouriteMovie } from '../models/FavouriteMovie';
import { MatCardModule } from '@angular/material/card';
import { DurationRuntimePipe } from '../pipes/duration.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-list-favourite',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule,
    DurationRuntimePipe
  ],
  templateUrl: './movie-list-favourite.component.html',
  styleUrls: ['./movie-list-favourite.component.css']
})
export class MovieListFavouriteComponent {

  constructor(private _snackbar: MatSnackBar) { }
  private _reorderFavouriteMovies$: Subject<CdkDragDrop<FavouriteMovie[]>> = new Subject();

  private _saveOrder$: Subject<boolean> = new Subject();

  private _refreshOrder$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  favouriteMovies$ = this._refreshOrder$.pipe(
    filter(refreshed => !!refreshed),
    switchMap(() => of(JSON.parse(localStorage.getItem('myFavouriteMovies') as string) || [])),
    filter((itemStorage: FavouriteMovie[]) => !!itemStorage.length),
    map(itemStorage => {
      return itemStorage.map(item => FavouriteMovie.parseFavouriteMovie(item)).sort((a, b) => {
        if (a.date_added > b.date_added) {
          return 1
        }

        if (a.date_added < b.date_added) {
          return -1
        }

        return 0;
      })
    }),
    shareReplay(),
    startWith(JSON.parse(localStorage.getItem('myFavouriteMovies') as string) || [])
  )

  private _reorderFavouriteMoviesStream$: Observable<FavouriteMovie[]> = this._reorderFavouriteMovies$.asObservable().pipe(
    withLatestFrom(this.favouriteMovies$),
    map(([event, movies]) => {
      moveItemInArray(movies, event.previousIndex, event.currentIndex);
      return movies;
    })
  )

  saveOrder$ = this._saveOrder$.asObservable().pipe(
    withLatestFrom(this._reorderFavouriteMoviesStream$),
    tap(([, movies]) => {
      localStorage.setItem('myFavouriteMovies', JSON.stringify(movies));
      this._snackbar.open('Success! Movie has been re-ordered', undefined, {
        panelClass: ['snackbar-success'],
        duration: 2000
      })
    })
  )

  drop(event: CdkDragDrop<FavouriteMovie[]>): void {
    this._reorderFavouriteMovies$.next(event)
  }

  saveOrder(): void {
    this._saveOrder$.next(true);
  }

  refreshOrder(): void {
    this._refreshOrder$.next(true);
  }

}

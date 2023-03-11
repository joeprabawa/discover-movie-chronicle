import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/discover' },
  { path: 'discover', title: 'Discover Movie', loadComponent: () => import('./movie-list/movie-list.component').then(component => component.MovieListComponent) },
  { path: 'detail/:movieId', title: 'Movie Detail', loadComponent: () => import('./movie-detail/movie-detail.component').then(component => component.MovieDetailComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

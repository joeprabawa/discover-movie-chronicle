import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieListFavouriteComponent } from './movie-list-favourite.component';

describe('MovieListFavouriteComponent', () => {
  let component: MovieListFavouriteComponent;
  let fixture: ComponentFixture<MovieListFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MovieListFavouriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieListFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

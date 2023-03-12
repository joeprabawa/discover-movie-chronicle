import { MovieDetail } from "./MovieDetail";

export class FavouriteMovie extends MovieDetail {
  date_added!: Date;

  static parseFavouriteMovie(data: any): FavouriteMovie {
    const parsed = new FavouriteMovie();
    const parsedMovieDetail = MovieDetail.parse(data)
    parsed.date_added = data.date_added;
    return { ...parsed, ...parsedMovieDetail };
  }
}

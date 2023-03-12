export class MovieDetail {
  id!: number;
  title!: string;
  overview!: string;
  backdrop_path!: string;
  poster_path!: string;
  popularity!: number;
  production_companies!: any[];
  release_date!: string;
  genres!: any[];
  runtime!: number;
  revenue!: number;
  vote_average!: number;
  vote_count!: number;
  spoken_language!: any[];

  static parse(data: any): MovieDetail {
    const parsed = new MovieDetail();
    parsed.id = data.id;
    parsed.title = data.title;
    parsed.backdrop_path = `http://image.tmdb.org/t/p/original${data.backdrop_path}`;
    parsed.overview = data.overview;
    parsed.poster_path = `http://image.tmdb.org/t/p/w342${data.poster_path}`;
    parsed.popularity = data.popularity;
    parsed.production_companies = data.production_companies;
    parsed.release_date = data.release_date;
    parsed.genres = data.genres;
    parsed.runtime = data.runtime;
    parsed.revenue = data.revenue;
    parsed.vote_average = data.vote_average;
    parsed.vote_count = data.vote_count;
    parsed.spoken_language = data.spoken_languages;
    return parsed
  }
}

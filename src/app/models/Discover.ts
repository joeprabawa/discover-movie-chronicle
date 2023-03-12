export class Discover {
  id!: number;
  title!: string;
  overview!: string;
  poster_path?: string | null;
  popularity!: number;
  genres!: string[];

  static parse(data: any, genres: any[]): Discover {
    const parsed = new Discover();
    parsed.title = data.title;
    parsed.id = data.id;
    parsed.overview = data.overview;
    parsed.popularity = data.popularity;
    parsed.genres = this.getGenre(data.genre_ids, genres);
    parsed.poster_path = data.poster_path ? `http://image.tmdb.org/t/p/w342${data.poster_path}` : null
    return parsed;
  }

  static getGenre(genreIds: number[], genreData: any) {
    return genreIds.map(id => {
      const findGenre = genreData.genres.find((data: { id: number, name: string }) => data.id === id);
      return findGenre.name;
    })
  }
}

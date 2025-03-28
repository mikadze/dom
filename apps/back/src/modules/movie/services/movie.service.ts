import { Movie } from "@/db/entities";
import { Token } from "typedi";
import { Logger } from "winston";
import { MovieRepository } from "../repos/movie.repo";

export const DITOKEN = new Token<
  new (movieRepository: any, logger: Logger) => MovieService
>("MOVIE_SERVICE_TOKEN");

export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger
  ) {}

  async createMovie(data: Partial<Movie>): Promise<Movie> {
    return this.movieRepository.createMovie(data);
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.findAllMovies();
  }

  async getMovieById(id: number): Promise<Movie | null> {
    return this.movieRepository.findMovieById(id);
  }

  async updateMovie(id: number, data: Partial<Movie>): Promise<Movie | null> {
    return this.movieRepository.updateMovie(id, data);
  }

  async deleteMovie(id: number): Promise<boolean> {
    return await this.movieRepository.deleteMovie(id);
  }
}

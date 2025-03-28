import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "@/config/db";
import { Movie } from "@/db/entities";
import { Token } from "typedi";

export const DITOKEN = new Token<new () => MovieRepository>("MOVIE_REPO_TOKEN");

export class MovieRepository {
  private movieRepository: Repository<Movie>;

  constructor() {
    this.movieRepository = AppDataSource.getRepository(Movie);
  }

  async createMovie(
    data: Partial<Movie>,
    entityManager?: EntityManager
  ): Promise<Movie> {
    let repo = this.movieRepository;
    if (entityManager) {
      repo = entityManager.getRepository(Movie);
    }

    const movie = repo.create(data);
    return repo.save(movie);
  }

  async findAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findMovieById(id: number): Promise<Movie | null> {
    return this.movieRepository.findOneBy({ id });
  }

  async updateMovie(
    id: number,
    data: Partial<Movie>,
    entityManager?: EntityManager
  ): Promise<Movie | null> {
    let repo = this.movieRepository;
    if (entityManager) {
      repo = entityManager.getRepository(Movie);
    }

    const movie = await this.findMovieById(id);
    if (!movie) return null;
    Object.assign(movie, data);
    return repo.save(movie);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const result = await this.movieRepository.delete(id);
    return result.affected === 1;
  }
}

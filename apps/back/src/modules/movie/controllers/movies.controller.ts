import { Request, Response } from "express";
import { Logger } from "winston";
import {
  MovieService,
  DITOKEN as MOVIE_SERVICE_TOKEN,
} from "../services/movie.service";
import { DITOKEN as MOVIE_REPO_TOKEN } from "../repos/movie.repo";
import Container from "typedi";

export class MovieController {
  private movieService: MovieService;
  private logger: Logger;

  constructor() {
    const loggerInstance: Logger = Container.get("logger");
    const MovieServiceClass = Container.get(MOVIE_SERVICE_TOKEN);
    const MovieRepoClass = Container.get(MOVIE_REPO_TOKEN);
    const MovieRepoInstance = new MovieRepoClass();

    this.movieService = new MovieServiceClass(
      MovieRepoInstance,
      loggerInstance
    );

    this.logger = loggerInstance;

     // bind
     this.create = this.create.bind(this);
     this.getAll = this.getAll.bind(this);
     this.getById = this.getById.bind(this);
     this.update = this.update.bind(this);
     this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, duration } = req.body;
      if (!title || !duration) {
        return res.status(400).json({
          error: "Title and duration are required",
        }) as unknown as void;
      }
      const movie = await this.movieService.createMovie({
        title,
        description,
        duration,
      });
      return res.status(201).json(movie) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create movie" }) as unknown as void;
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const movies =
        (await this.movieService.getAllMovies()) as unknown as void;
      return res.json(movies) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch movies" }) as unknown as void;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const movie = await this.movieService.getMovieById(id);
      if (!movie)
        return res
          .status(404)
          .json({ error: "Movie not found" }) as unknown as void;
      return res.json(movie) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch movie" }) as unknown as void;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const movie = await this.movieService.updateMovie(id, req.body);
      if (!movie)
        return res
          .status(404)
          .json({ error: "Movie not found" }) as unknown as void;
      return res.json(movie) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to update movie" }) as unknown as void;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await this.movieService.deleteMovie(id);
      if (!success)
        return res
          .status(404)
          .json({ error: "Movie not found" }) as unknown as void;
      return res.status(204).send() as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete movie" }) as unknown as void;
    }
  }
}

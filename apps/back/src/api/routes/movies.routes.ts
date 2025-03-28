import { Router } from "express";
import { isAuth } from "../middlewares";
import { MovieController } from "@/modules/movie/controllers/movies.controller";

const route = Router();

export default (app: Router) => {
  app.use("/movies", route);
  const moviesController = new MovieController();

  route.post("/create", isAuth, moviesController.create);
  route.get("/", moviesController.getAll);
  route.get("/:id", moviesController.getById);
  route.put("/:id", isAuth, moviesController.update);
  route.delete("/:id", isAuth, moviesController.delete);
};

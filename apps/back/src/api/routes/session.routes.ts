import { Router } from "express";
import { isAuth } from "../middlewares";
import { SessionController } from "@/modules/session/controllers/session.controller";

const route = Router();

export default (app: Router) => {
  app.use("/session", route);
  const sessionController = new SessionController();

  route.post("/create", isAuth, sessionController.create);
  route.get("/", sessionController.getAll);
  route.get("/:id", sessionController.getById);
  route.put("/:id", isAuth, sessionController.update);
  route.delete("/:id", isAuth, sessionController.delete);
};

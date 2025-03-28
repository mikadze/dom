import { Router } from "express";
import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { validateBody } from "../middlewares";
import { signUpRequestSchema } from "../dto/auth/signup.dto";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  const authController = new AuthController();

  route.post(
    "/signup",
    validateBody(signUpRequestSchema),
    authController.signup
  );
};

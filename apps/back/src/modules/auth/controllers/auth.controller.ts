import { Logger } from "winston";
import AuthService, { DITOKEN as AUTH_SERVICE_TOKEN } from "../services/auth";
import { DITOKEN as USER_REPO_TOKEN } from "../repos/user.repo";
import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { SignUpRequestDto } from "@/api/dto/auth/signup.dto";

export class AuthController {
  private authService: AuthService;
  private logger: Logger;

  constructor() {
    const loggerInstance: Logger = Container.get("logger");
    const AuthServiceClass = Container.get(AUTH_SERVICE_TOKEN);
    const UserRepoClass = Container.get(USER_REPO_TOKEN);
    const UserRepoInstance = new UserRepoClass();

    this.authService = new AuthServiceClass(UserRepoInstance, loggerInstance);

    this.logger = loggerInstance;

    // bind
    this.signup = this.signup.bind(this);
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const userDTO: SignUpRequestDto = req.body;

    this.logger.debug(`Calling Sign-Up endpoint with body: ${userDTO}`);

    try {
      const { user, token } = await this.authService.SignUp(userDTO);

      return res.status(201).json({ user, token }) as unknown as Promise<void>;
    } catch (e) {
      this.logger.error("🔥 error: %o", e);
      return next(e);
    }
  }
}

import { SignUpRequestDto } from "@/api/dto/auth/signup.dto";
import { randomBytes } from "crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import config from "@/config";
import { Logger } from "winston";
import { Token } from "typedi";
import { UserRepository } from "../repos/user.repo";
import { userMapper } from "../user.mapper";

export const DITOKEN = new Token<
  new (userModel: any, logger: Logger) => AuthService
>("AUTH_SERVICE_TOKEN");

export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  public async SignUp(dto: SignUpRequestDto) {
    try {
      this.logger.silly("AuthService >> signup ", dto);

      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(dto.password, { salt });

      const userRecord = await this.userRepository.createUser({
        ...dto,
        salt: salt.toString("hex"),
        password: hashedPassword,
      });

      if (!userRecord) {
        throw new Error("User cannot be created");
      }

      const token = this.generateToken(userRecord);

      const user = userMapper.toDomain(userRecord);

      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private generateToken(user: any) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user.id}`);
    return jwt.sign(
      {
        _id: user.id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
      { algorithm: "HS512" }
    );
  }
}

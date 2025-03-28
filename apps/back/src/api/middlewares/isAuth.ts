import { expressjwt as jwt } from "express-jwt";
import { type Algorithm } from "jsonwebtoken";
import config from "@/config";
import { Request } from "express";

const getTokenFromHeader = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    (req as any).token = req.headers.authorization.split(" ")[1];
    return req.headers.authorization.split(" ")[1];
  }
};

export const isAuth = jwt({
  secret: config.jwtSecret,
  algorithms: [config.jwtAlgorithm as Algorithm],
  getToken: getTokenFromHeader,
});

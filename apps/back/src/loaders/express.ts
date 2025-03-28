import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "@/api";
import config from "@/config";

export default async ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((_, __, next) => {
    const err = new Error("Not Found");
    next(err);
  });

  /// error handlers
  app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res
        .status(401)
        .send({ message: err.message })
        .end() as unknown as void;
    }
    return next(err);
  });

  app.use((err: Error, _: Request, res: Response) => {
    res.status(500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};

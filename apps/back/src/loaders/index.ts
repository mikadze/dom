import expressLoader from "./express";
import dependencyInjectorLoader from "./di";
import Logger from "./logger";
import dbLoader from "./db";
import jobsLoader from "./jobs";
import wsLoader from "./ws";
import { type Express } from "express";
import LoggerInstance from "./logger";
import Container from "typedi";
import { Server } from "http";

export default async ({
  expressApp,
  httpServer,
}: {
  expressApp: Express;
  httpServer: Server;
}) => {
  Container.set("logger", LoggerInstance);

  await wsLoader({ httpServer });
  Logger.info("✌️ WSS loaded");

  await dependencyInjectorLoader();
  Logger.info("✌️ Dependency Injector loaded");

  await jobsLoader();
  Logger.info("✌️ Cron Jobs Strated");

  await dbLoader();
  Logger.info("✌️ Db Connected");

  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

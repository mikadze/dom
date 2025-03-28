import "reflect-metadata";
import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import { createServer } from "http";

async function startServer() {
  const app = express();

  const httpServer = createServer(app);

  httpServer
    .listen(config.port, () => {
      Logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });

  await require("./loaders").default({ expressApp: app, httpServer });
}

startServer();

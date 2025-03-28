import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error(".env not found");
}

const requiredEnvVars = [
  "PORT",
  "JWT_SECRET",
  "JWT_ALGO",
] as const;
type RequiredEnvVar = (typeof requiredEnvVars)[number];

function getValidatedEnv(): Record<RequiredEnvVar, string> {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return process.env as Record<RequiredEnvVar, string>;
}

const env = getValidatedEnv();

export default {
  port: parseInt(env.PORT, 10),
  database: {
    host: process.env.DB_HOS || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    dbName: process.env.DB_NAME || "dom",
    sync: process.env.SYNC_DB || false,
  },
  jwtSecret: env.JWT_SECRET,
  jwtAlgorithm: env.JWT_ALGO,
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  api: {
    prefix: "/api",
  },
};

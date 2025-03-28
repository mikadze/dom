import { entities } from "@/db/entities";
import { DataSource } from "typeorm";
import config from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.dbName,
  synchronize: true,
  logging: true,
  entities: entities,
  migrations: ["src/migration/**/*.ts"],
});

// Initialize the data source (call this in your app startup)
export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    const ds = await AppDataSource.initialize();
    console.log("Database connection established");

    return ds;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

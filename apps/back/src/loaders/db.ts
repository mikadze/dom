import { initializeDatabase } from "@/config/db";
import { DataSource } from "typeorm";

export default async (): Promise<DataSource> => {
  return await initializeDatabase();
};

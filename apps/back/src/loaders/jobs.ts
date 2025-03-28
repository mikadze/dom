import { CronService } from "@/jobs/booking-cleanup.cron";
import LoggerInstance from "./logger";

export default () => {
  try {
    const cronService = new CronService();
    cronService.startCleanupJob();
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};

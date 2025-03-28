import {
  BookingRepository,
  DITOKEN as BOOKING_REPO_TOKEN,
} from "@/modules/booking/repos/booking.repo";
import cron from "node-cron";
import { Container } from "typedi";

export class CronService {
  private bookingRepository: BookingRepository;
  private isRunning: boolean = false;

  constructor() {
    const BookingRepositoryClass = Container.get(BOOKING_REPO_TOKEN);
    this.bookingRepository = new BookingRepositoryClass();
  }

  startCleanupJob() {
    cron.schedule("*/5 * * * * *", async () => {
    // cron.schedule("*/1 * * * *", async () => {
      if (this.isRunning) return;
      this.isRunning = true;

      try {
        console.log("Running cleanup job for expired bookings...");
        await this.bookingRepository.softDeleteExpiredBookings();
        console.log("Cleanup job completed.");
      } catch (error) {
        console.error("Error in cleanup job:", error);
      } finally {
        this.isRunning = false;
      }
    });

    console.log(
      "Cron job for expired bookings cleanup scheduled (every 5 seconds)."
    );
  }
}

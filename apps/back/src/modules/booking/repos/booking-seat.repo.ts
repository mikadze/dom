import { EntityManager, Repository } from "typeorm";
import { Token } from "typedi";
import { AppDataSource } from "@/config/db";
import { BookingSeat } from "@/db/entities";

export const DITOKEN = new Token<new () => BookingSeatRepository>(
  "BOOKING_SEAT_REPO_TOKEN"
);

export class BookingSeatRepository {
  private bookingSeatRepository: Repository<BookingSeat>;

  constructor() {
    this.bookingSeatRepository = AppDataSource.getRepository(BookingSeat);
  }

  async createBookingSeats(
    bookingSeats: Partial<BookingSeat>[],
    entityManager?: EntityManager
  ): Promise<BookingSeat[]> {
    let repo = this.bookingSeatRepository;
    
    if (entityManager) {
      repo = entityManager.getRepository(BookingSeat);
    }
    const entities = bookingSeats.map((seat) => repo.create(seat));

    try {
      return await repo.save(entities);
    } catch (error: any) {
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        throw new Error("One or more seats are already reserved or booked");
      }
      throw error;
    }
  }

  async findBookedSeats(sessionId: number): Promise<BookingSeat[]> {
    return this.bookingSeatRepository
      .createQueryBuilder("bs")
      .innerJoin("bs.booking", "b")
      .where("bs.session_id = :sessionId", { sessionId })
      .andWhere("bs.deleted_at IS NULL") // Only active seats
      .andWhere(
        "(b.status = :confirmed OR (b.status = :reserved AND b.expires_at > NOW()))",
        {
          confirmed: "confirmed",
          reserved: "reserved",
        }
      )
      .getMany();
  }

  async softDeleteBookingSeats(
    bookingId: number,
    entityManager?: EntityManager
  ): Promise<void> {
    let repo = this.bookingSeatRepository;
    if (entityManager) {
      repo = entityManager.getRepository(BookingSeat);
    }
    await repo.update({ bookingId }, { deletedAt: new Date() });
  }
}

import { EntityManager, In, LessThan, MoreThan, Repository } from "typeorm";
import Container, { Token } from "typedi";
import { AppDataSource } from "@/config/db";
import { Booking } from "@/db/entities";
import { BookingSeat } from "@/db/entities";
import { CommunicationService } from "@/modules/comm/services/comm.service";
import { EXPIRED_BOOKINGS, ExpiredMessageInternal } from "@/modules/comm/types";
import { SeatsUpdatedMessage } from "@repo/shared";

export const DITOKEN = new Token<new () => BookingRepository>(
  "BOOKING_REPO_TOKEN"
);

export class BookingRepository {
  private bookingRepository: Repository<Booking>;
  private readonly communicationService: CommunicationService;

  constructor() {
    this.bookingRepository = AppDataSource.getRepository(Booking);
    this.communicationService = Container.get("communicationService");
  }

  async createBooking(
    data: Partial<Booking>,
    entityManager?: EntityManager
  ): Promise<Booking> {
    let repo = this.bookingRepository;

    if (entityManager) {
      repo = entityManager.getRepository(Booking);
    }

    const booking = repo.create(data);

    return repo.save(booking);
  }

  async findBookingByToken(reservationToken: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: { reservationToken },
      relations: ["bookingSeats"],
    });
  }

  async updateBooking(
    id: number,
    data: Partial<Booking>,
    entityManager?: EntityManager
  ): Promise<Booking | null> {
    let repo = this.bookingRepository;
    if (entityManager) {
      repo = entityManager.getRepository(Booking);
    }
    const booking = await repo.findOneBy({ id });
    if (!booking) return null;
    Object.assign(booking, data);
    return repo.save(booking);
  }

  async getActiveBookingsForSession(sessionId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: [
        { sessionId, status: "confirmed" },
        { sessionId, status: "reserved", expiresAt: MoreThan(new Date()) },
      ],
      relations: ["bookingSeats"],
    });
  }

  async softDeleteExpiredBookings(): Promise<void> {
    const expiredBookings = await this.bookingRepository.find({
      where: { status: "reserved", expiresAt: LessThan(new Date()) },
      relations: ["bookingSeats"],
    });

    if (expiredBookings.length > 0) {
      await AppDataSource.transaction(async (entityManager: EntityManager) => {
        const bookingRepo = entityManager.getRepository(Booking);
        const bookingSeatRepo = entityManager.getRepository(BookingSeat);

        const bookingIds = expiredBookings.map((booking) => booking.id);

        const bookingSeatsUpdatePromise = bookingSeatRepo.update(
          {
            bookingId: In(bookingIds),
          },
          { deletedAt: new Date() }
        );

        const bookingUpdatePromise = bookingRepo.update(
          {
            id: In(bookingIds),
          },
          { status: "expired" }
        );

        await Promise.all([bookingSeatsUpdatePromise, bookingUpdatePromise]);

        const event: ExpiredMessageInternal = {
          type: EXPIRED_BOOKINGS,
          payload: {
            bookings: expiredBookings,
          },
        };

        this.communicationService.emitToAll(event);
      });
    }
  }
}

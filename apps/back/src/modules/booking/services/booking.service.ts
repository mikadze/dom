import { v4 as uuidv4 } from "uuid";
import { Token } from "typedi";
import { Logger } from "winston";
import { EntityManager } from "typeorm";
import { SessionRepository } from "@/modules/session/repos/session.repo";
import { BookingRepository } from "../repos/booking.repo";
import { BookingSeatRepository } from "../repos/booking-seat.repo";
import { AppDataSource } from "@/config/db";
import { BookingSeat, Session, User } from "@/db/entities";
import { Booking } from "@/db/entities";
import { userMapper } from "@/modules/auth/user.mapper";

export const DITOKEN = new Token<
  new (
    bookingRepository: BookingRepository,
    bookingSeatRepository: BookingSeatRepository,
    sessionRepository: SessionRepository,
    logger: Logger
  ) => BookingService
>("BOOKING_SERVICE_TOKEN");

interface Seat {
  rowNumber: number;
  seatNumber: number;
}

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingSeatRepository: BookingSeatRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly logger: Logger
  ) {}

  async reserveSeats(
    sessionId: number,
    seats: Seat[],
    user: User
  ): Promise<{
    booking: Partial<Booking>;
    reservationToken: string;
    expiresAt: Date;
  }> {
    this.logger.silly(`reserveSeats for ${sessionId}`);

    const session = await this.sessionRepository.findSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    const hall = session.hall;
    const maxRows = hall.rows;
    const maxSeatsPerRow = hall.seatsPerRow;

    // Validate seats
    for (const seat of seats) {
      if (seat.rowNumber > maxRows || seat.seatNumber > maxSeatsPerRow) {
        throw new Error(`Invalid seat: ${seat.rowNumber}-${seat.seatNumber}`);
      }
    }

    return AppDataSource.transaction(async (entityManager: EntityManager) => {
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
      const reservationToken = uuidv4();

      const booking = await this.bookingRepository.createBooking(
        {
          sessionId,
          status: "reserved",
          reservationToken,
          expiresAt,
          reservedBy: user,
        },
        entityManager
      );

      const bookingSeats = seats.map((seat) => {
        return {
          bookingId: booking.id,
          sessionId,
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
        };
      });

      const reservedSeats = await this.bookingSeatRepository.createBookingSeats(
        bookingSeats,
        entityManager
      );

      const reservedBy = userMapper.toDomain(booking.reservedBy);

      return {
        booking: {
          ...booking,
          reservedBy,
          bookingSeats: reservedSeats,
        } as Booking,
        reservationToken,
        expiresAt,
      };
    });
  }

  async confirmBooking(reservationToken: string): Promise<Booking> {
    return AppDataSource.transaction(async (entityManager) => {
      const booking =
        await this.bookingRepository.findBookingByToken(reservationToken);

      if (!booking) throw new Error("Booking not found");

      if (booking.status !== "reserved")
        throw new Error("Booking cannot be confirmed");
     
      if (booking.expiresAt && booking.expiresAt < new Date()) {
        await this.bookingSeatRepository.softDeleteBookingSeats(
          booking.id,
          entityManager
        );
        throw new Error("Reservation has expired");
      }

      const updatedBooking = await this.bookingRepository.updateBooking(
        booking.id,
        {
          status: "confirmed",
          confirmedAt: new Date(),
        },
        entityManager
      );

      if (!updatedBooking) throw new Error("Failed to confirm booking");
      
      return updatedBooking;
    });
  }

  async getSessionSeatMap(sessionId: number): Promise<{
    seatMap: { rowNumber: number; seatNumber: number; status: string }[];
    session: Session;
  }> {
    const session = await this.sessionRepository.findSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    // Clean up expired bookings
    await this.bookingRepository.softDeleteExpiredBookings();

    const bookings =
      await this.bookingRepository.getActiveBookingsForSession(sessionId);
    const bookedSeats = bookings.flatMap((b) =>
      b.bookingSeats
        .filter((bs: BookingSeat) => bs.deletedAt === null) // Only active seats
        .map((bs: BookingSeat) => ({
          row: bs.rowNumber,
          seat: bs.seatNumber,
          status: b.status,
        }))
    );

    const seatMap: { rowNumber: number; seatNumber: number; status: string }[] =
      [];
    for (let row = 1; row <= session.hall.rows; row++) {
      for (let seat = 1; seat <= session.hall.seatsPerRow; seat++) {
        const bookedSeat = bookedSeats.find(
          (bs) => bs.row === row && bs.seat === seat
        );
        seatMap.push({
          rowNumber: row,
          seatNumber: seat,
          status: bookedSeat ? bookedSeat.status : "available",
        });
      }
    }
    return { seatMap, session };
  }
}

import { Request, Response } from "express";
import {
  BookingService,
  DITOKEN as BOOKING_SERVICE_TOKEN,
} from "../services/booking.service";
import { DITOKEN as BOOKING_REPO_TOKEN } from "../repos/booking.repo";
import { DITOKEN as BOOKING_SEAT_REPO_TOKEN } from "../repos/booking-seat.repo";
import { DITOKEN as SESSION_REPO_TOKEN } from "@/modules/session/repos/session.repo";
import { Logger } from "winston";
import Container from "typedi";

export class BookingController {
  private bookingService: BookingService;
  private logger: Logger;

  constructor() {
    const loggerInstance: Logger = Container.get("logger");
    const BookingServiceClass = Container.get(BOOKING_SERVICE_TOKEN);
    const BookingRepoClass = Container.get(BOOKING_REPO_TOKEN);
    const BookingSeatRepoClass = Container.get(BOOKING_SEAT_REPO_TOKEN);
    const SessionRepoClass = Container.get(SESSION_REPO_TOKEN);
    const bookingRepoInstance = new BookingRepoClass();
    const bookingSeatRepoInstance = new BookingSeatRepoClass();
    const sessionRepoInstance = new SessionRepoClass();

    this.bookingService = new BookingServiceClass(
      bookingRepoInstance,
      bookingSeatRepoInstance,
      sessionRepoInstance,
      loggerInstance
    );

    this.logger = loggerInstance;

    // bind
    this.reserve = this.reserve.bind(this);
    this.confirm = this.confirm.bind(this);
    this.getSeatMap = this.getSeatMap.bind(this);
  }

  async reserve(req: Request, res: Response) {
    try {
      const sessionId = parseInt(req.params.id, 10);
      const { seats } = req.body; // { seats: [{ rowNumber: number, seatNumber: number }] }

      if (!seats || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
          error: "Seats array is required and must not be empty",
        }) as unknown as void;
      }

      const result = await this.bookingService.reserveSeats(
        sessionId,
        seats,
        (req as any).currentUser
      );

      return res.status(201).json(result) as unknown as void;
    } catch (error: any) {
      return res.status(400).json({ error: error.message }) as unknown as void;
    }
  }

  async confirm(req: Request, res: Response) {
    console.log('--------------')
    try {
      const { reservationToken } = req.body;
      if (!reservationToken) {
        return res
          .status(400)
          .json({ error: "Reservation token is required" }) as unknown as void;
      }
      const booking =
        await this.bookingService.confirmBooking(reservationToken);
      return res.status(200).json(booking) as unknown as void;
    } catch (error: any) {
      return res.status(400).json({ error: error.message }) as unknown as void;
    }
  }

  async getSeatMap(req: Request, res: Response) {
    try {
      const sessionId = parseInt(req.params.id, 10);
      if (isNaN(sessionId)) {
        return res
          .status(400)
          .json({ error: "Invalid session ID" }) as unknown as void;
      }
      const seatMap = await this.bookingService.getSessionSeatMap(sessionId);
      return res.status(200).json(seatMap) as unknown as void;
    } catch (error: any) {
      return res.status(400).json({ error: error.message }) as unknown as void;
    }
  }
}

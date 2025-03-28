import { BookingSeat } from "@/db/entities";
import { MessageTransformer } from ".";
import { EXPIRED_BOOKINGS, OutgoingEventMessage } from "../types";

export class ExpireTransformer implements MessageTransformer {
  transform(message: { type: string; payload: any }): OutgoingEventMessage {
    const { payload } = message;
    const bookings = payload.bookings;

    const seatsBySession: {
      [sessionId: number]: {
        rowNumber: number;
        seatNumber: number;
        status: string;
      }[];
    } = {};

    for (const booking of bookings) {
      const sessionId = booking.sessionId;
      const seats = booking.bookingSeats.map((bs: BookingSeat) => ({
        rowNumber: bs.rowNumber,
        seatNumber: bs.seatNumber,
        status: booking.status,
      }));

      if (seatsBySession[sessionId]) {
        seatsBySession[sessionId].push(...seats);
      } else {
        seatsBySession[sessionId] = seats;
      }
    }

    return { type: EXPIRED_BOOKINGS, payload: seatsBySession };
  }
}

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Booking } from ".";
import { Session } from ".";

@Entity("booking_seats")
@Index(["sessionId", "rowNumber", "seatNumber"], {
  unique: true,
  where: '"deleted_at" IS NULL', // Only active rows enforce uniqueness
})
export class BookingSeat {
  @PrimaryColumn({ type: "integer", name: "booking_id" })
  bookingId!: number;

  @PrimaryColumn({ type: "integer", name: "session_id" })
  sessionId!: number;

  @PrimaryColumn({ type: "integer", name: "row_number" })
  rowNumber!: number;

  @PrimaryColumn({ type: "integer", name: "seat_number" })
  seatNumber!: number;

  @Column({ type: "timestamp", name: "deleted_at", nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => Booking, (booking) => booking.bookingSeats)
  @JoinColumn({ name: "booking_id" })
  booking!: Booking;

  @ManyToOne(() => Session)
  @JoinColumn({ name: "session_id" })
  session!: Session;
}

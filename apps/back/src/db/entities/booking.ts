import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Session, User } from ".";
import { BookingSeat } from ".";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Session)
  @JoinColumn({ name: "session_id" })
  session!: Session;

  @Column({ type: "integer", name: "session_id", nullable: false })
  sessionId!: number;

  @Column({
    type: "enum",
    enum: ["reserved", "confirmed", "expired"],
    nullable: false,
  })
  status!: "reserved" | "confirmed" | "expired";

  @Column({
    type: "timestamp",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({ type: "timestamp", name: "expires_at", nullable: true })
  expiresAt!: Date;

  @Column({ type: "timestamp", name: "confirmed_at", nullable: true })
  confirmedAt!: Date;

  @Column({
    type: "varchar",
    length: 36,
    name: "reservation_token",
    unique: true,
    nullable: false,
  })
  reservationToken!: string;

  @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.booking)
  bookingSeats!: BookingSeat[];

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "user_id" })
  reservedBy!: User;

  @Column({ type: "integer", name: "user_id" })
  userId!: number;
}

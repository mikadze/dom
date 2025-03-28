import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Booking } from "./";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  salt!: string;

  @Column()
  password!: string;

  @OneToMany(() => Booking, (booking) => booking.reservedBy)
  bookings!: Booking[];
}

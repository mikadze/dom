import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Movie } from ".";
import { Hall } from ".";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: "movie_id" })
  movie!: Movie;

  @Column({ type: "integer", name: "movie_id", nullable: false })
  movieId!: number;

  @ManyToOne(() => Hall)
  @JoinColumn({ name: "hall_id" })
  hall!: Hall;

  @Column({ type: "integer", name: "hall_id", nullable: false })
  hallId!: number;

  @Column({ type: "timestamp", name: "start_time", nullable: false })
  startTime!: Date;

  @Column({ type: "timestamp", name: "end_time", nullable: true })
  endTime!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "integer", nullable: false })
  duration!: number;
}

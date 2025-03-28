import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("halls")
export class Hall {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  @Column({ type: "integer", nullable: false })
  rows!: number;

  @Column({ type: "integer", nullable: false, name: "seats_per_row" })
  seatsPerRow!: number;
}

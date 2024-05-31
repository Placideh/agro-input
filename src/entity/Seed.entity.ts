import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Fertilizer } from "./Fertilizer.entity";

@Entity({ name: "seeds" })
export class Seed {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  name?: string;

  @Column()
  description?: string;

  @Column()
  price?: number;

  @ManyToOne(() => Fertilizer, (fertilizer) => fertilizer.seeds, {
    eager: true,
  })
  fertilizer?: Fertilizer;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

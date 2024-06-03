import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Seed } from "./Seed.entity";

@Entity({ name: "fertilizer" })
export class Fertilizer {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  name?: string;

  @Column()
  description?: string;

  @Column("decimal", { nullable: false, precision: 10, scale: 2, default: 0.0 })
  price?: number;

  @OneToMany(() => Seed, (seed) => seed.fertilizer)
  seeds?: Seed[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

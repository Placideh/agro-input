import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Seed } from "./Seed.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false })
  status?: string;

  @ManyToOne(() => Seed, { eager: true })
  @JoinColumn()
  seed?: Seed;

  @Column("decimal", {
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  amount?: number;

  @Column("decimal", {
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  landSize?: number;

  @Column("decimal", {
    nullable: false,
    name: "fertilizer_quantity",
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  fertilizerQuantity?: number;

  @Column("decimal", {
    nullable: false,
    name: "seed_quantity",
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  seedQuantity?: number;

  @Column({ nullable: false, name: "payment_method" })
  paymentMethod?: string;

  @Column({ nullable: false, name: "farmer_email" })
  farmerEmail?: string;

  @Column({ nullable: false, name: "farmer_name" })
  farmerName?: string;
  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

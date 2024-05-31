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

  @Column({ nullable: false })
  amount?: number;

  @Column({ nullable: false })
  landSize?: number;

  @Column({ nullable: false, name: "fertilizer_quantity" })
  fertilizerQuantity?: number;

  @Column({ nullable: false, name: "seed_quantity" })
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

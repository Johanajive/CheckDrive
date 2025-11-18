// src/modules/appointments/entity/appointments.entity.ts
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Appointment Entity
@Entity()
export class Appointments {
  @PrimaryGeneratedColumn()
  id_appointment: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  time: string;

  // Status: Active | Cancelled | Completed
  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;
}

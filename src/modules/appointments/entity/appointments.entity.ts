import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

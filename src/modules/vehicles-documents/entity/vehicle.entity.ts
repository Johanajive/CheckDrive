
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DocumentEntity } from './document.entity';
import { Appointments } from '../../appointments/entity/appointments.entity';

@Entity()
@Index(['plate'], { unique: true })
export class VehicleEntity {
  @PrimaryGeneratedColumn()
  id_vehicle: number;

  @Column({ nullable: false })
  plate: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  engine_displacement : number;

  @Column({ nullable: false, default: true })
  @Exclude()
  status: boolean;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @OneToMany(() => DocumentEntity, (document) => document.vehicle, { cascade: true })
  documents: DocumentEntity[];

  // 1 -> N Citas
  @OneToMany(() => Appointments, (appointment) => appointment.vehicle)
  appointments: Appointments[];
}

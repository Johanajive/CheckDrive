
import { InspectionCenterEntity } from '../../inspectionCenter/entity/inspectionCenter.entity';
import { Users } from '../../users/entity/user.entity';
import { VehicleEntity } from '../../vehicles-documents/entity/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity('appointments')
export class Appointments {
  @ApiProperty({
    description: 'ID único y autogenerado de la cita.',
    example: 789,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id_appointment: number;

  @ApiProperty({
    description: 'Fecha programada de la cita.',
    example: '2025-12-10',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({
    description: 'Hora programada de la cita en formato HH:MM.',
    example: '14:30',
    type: String,
  })
  @Column({ type: 'time', nullable: false })
  time: string;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;

  // ============================================================
  //COLUMNAS FK 
  // ============================================================

  @Column({ nullable: false })
  id_user: number;

  @Column({ nullable: false })
  id_vehicle: number;

  @Column({ nullable: false })
  id_center: number;

  // ============================================================
  // RELACIONES
  // ============================================================

  @ManyToOne(() => Users, (user) => user.appointments, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_user' })
  user: Users;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.appointments, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_vehicle' })
  vehicle: VehicleEntity;

  @ManyToOne(() => InspectionCenterEntity, (center) => center.appointments, { nullable: false })
  @JoinColumn({ name: 'id_center' })
  center: InspectionCenterEntity;
}

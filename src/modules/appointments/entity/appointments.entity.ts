
import { InspectionCenterEntity } from '../../inspectionCenter/entity/inspectionCenter.entity';
import { Users } from '../../users/entity/user.entity';
import { VehicleEntity } from '../../vehicles-documents/entity/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('appointments')
export class Appointments {
  @PrimaryGeneratedColumn()
  id_appointment: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

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

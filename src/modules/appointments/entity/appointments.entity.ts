
import { InspectionCenterEntity } from 'src/modules/inspectionCenter/entity/inspectionCenter.entity';
import { Users } from 'src/modules/users/entity/user.entity';
import { VehicleEntity } from 'src/modules/vehicles-documents/entity/vehicle.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Appointments {
  @PrimaryGeneratedColumn()
  id_appointment: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  time: string;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;

  @ManyToOne(() => Users, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @ManyToOne(() => InspectionCenterEntity, (center) => center.appointments)
  @JoinColumn({ name: 'centerId' })
  center: InspectionCenterEntity;
}


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceTypeEnum } from '../../../common/enum/service.type.enum';
import { EstatusPaynmentEnum } from '../../../common/enum/status.payment.enum';
import { PaymentMethodEnum } from '../../../common/enum/payment.method.enum';
import { Appointments } from '../../appointments/entity/appointments.entity';
import { Users } from '../../users/entity/user.entity';
import { VehicleEntity } from '../../vehicles-documents/entity/vehicle.entity';

@Entity('payments')
export class Payments {
  @PrimaryGeneratedColumn()
  id_payment: number;

  @Column({ nullable: false })
  serviceType: ServiceTypeEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ nullable: false, default: EstatusPaynmentEnum.PENDIENTE })
  status: EstatusPaynmentEnum;

  @Column({ nullable: false })
  paymentMethod: PaymentMethodEnum;

  @Column({ type: 'datetime', nullable: false })
  date_payment: Date;

  // ✅ AGREGAR ESTAS COLUMNAS FK
  @Column({ nullable: false })
  id_appointment: number;

  @Column({ nullable: false })
  id_user: number;

  @Column({ nullable: false })
  id_vehicle: number;

  // Las relaciones
  @ManyToOne(() => Appointments, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_appointment' })
  appointments: Appointments;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_user' })
  user: Users;

  @ManyToOne(() => VehicleEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_vehicle' })
  vehicleEntity: VehicleEntity;
}

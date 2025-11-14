// payment.entity.ts
import { join } from 'path';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id_payment: number;

  @Column()
  serviceType: string; // 'soat' o 'revision'

  @Column('decimal')
  amount: number;

  @Column()
  status: string; // 'pending', 'approved', 'rejected'

  @Column()
  paymentMethod: string; // 'tarjeta', 'pse', 'efectivo'

  @Column()
  date_payment: Date;


//   @OneToOne(() => Appointment, appointment => appointment.payments { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
//   @joinColumn({ name: 'id_appointment' }) // nombre de la columna FK en la tabla payments
//   appointment: Appointment; // Descomentar cuando se tenga la entidad Appointment

//   @ManyToOne(() => User, user => user.payments { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
//   @joinColumn({ name: 'id_user' }) // nombre de la columna FK en la tabla payments
//   User: user; // Descomentar cuando se tenga la entidad users

}



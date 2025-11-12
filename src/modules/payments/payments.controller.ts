// payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string; // ID del SOAT o Revisión

  @Column()
  serviceType: string; // 'soat' o 'revision'

  @Column('decimal')
  amount: number;

  @Column()
  status: string; // 'pending', 'approved', 'rejected'

  @Column()
  paymentMethod: string; // 'tarjeta', 'pse', 'efectivo'

  @CreateDateColumn()
  createdAt: Date;
}
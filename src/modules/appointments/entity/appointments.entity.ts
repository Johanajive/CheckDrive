// src/modules/appointments/entity/appointments.entity.ts

import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importación necesaria

// Appointment Entity
@Entity()
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

  @ApiProperty({
    description: 'Estado actual de la cita.',
    example: 'Active',
    enum: ['Active', 'Cancelled', 'Completed'],
    default: 'Active',
    type: String,
  })
  // Status: Active | Cancelled | Completed
  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;

  // NOTA: Asumo que en un sistema real, necesitarías las claves foráneas (user_id, vehicle_id, center_id)
  // aunque no estén en el entity de ejemplo. Si las añades, deberías documentarlas aquí también.
}
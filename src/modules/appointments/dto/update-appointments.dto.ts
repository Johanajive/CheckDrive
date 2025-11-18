// src/appointments/dto/update-appointment.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointments.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importación necesaria

/**
 * Extiende CreateAppointmentDto haciendo todos sus campos opcionales (PartialType).
 * Esto permite actualizar solo un subconjunto de propiedades de la cita.
 */
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({
    description: 'Permite actualizar el estado de la cita.',
    example: 'Cancelled',
    enum: ['Active', 'Pending', 'Cancelled', 'Completed'],
    required: false, // Ya es opcional gracias a '?' y IsOptional()
  })
  @IsOptional()
  @IsString()
  status?: string;
  
  // Nota: Todas las demás propiedades (user_id, vehicle_id, date, time, etc.)
  // se heredan automáticamente de CreateAppointmentDto y se marcan como opcionales
  // gracias a PartialType.
}
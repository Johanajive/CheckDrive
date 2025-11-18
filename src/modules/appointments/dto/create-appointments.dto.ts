// src/appointment/dto/create-appointment.dto.ts

import { IsInt, IsDateString, IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importación necesaria

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID del usuario (propietario) que solicita la cita.',
    example: 15,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: 'ID del vehículo para el cual se programa la cita.',
    example: 42,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  vehicle_id: number;
   
  @ApiProperty({
    description: 'ID del centro o sucursal donde se realizará la cita.',
    example: 3,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  center_id: number;

  @ApiProperty({
    description: 'Fecha de la cita. Se recomienda el formato YYYY-MM-DD.',
    example: '2025-12-10',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Hora de la cita en formato HH:MM (24 horas).',
    example: '14:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', // Añadido para mostrar el formato en Swagger
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'The time must be in HH:MM format',
  })
  time: string;

  @ApiProperty({
    description: 'Estado inicial de la cita (e.g., "Active", "Pending").',
    example: 'Active',
    enum: ['Active', 'Pending', 'Cancelled', 'Completed'], // Opcional: sugiere posibles valores
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  status: string; // "Active", "Cancelled", etc.
}
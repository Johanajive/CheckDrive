// src/appointments/dto/create-appointment.dto.ts
import { IsInt, IsDateString, IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  // ID of the user (customer)
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  // ID of the vehicle
  vehicle_id: number;

  @IsInt()
  @IsNotEmpty()
  // ID of the service center
  center_id: number;

  // Format YYYY-MM-DD
  @IsDateString()
  @IsNotEmpty()
  date: string;

  // Format HH:MM:SS (e.g., 10:30:00)
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'The time must be in HH:MM:SS format',
  })
  time: string;

  // Initial status 'Active'
  @IsString()
  @IsNotEmpty()
  status: string;
}
// src/appointments/dto/update-appointment.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointments.dto';
import { IsOptional, IsString } from 'class-validator';

// PartialType makes all properties of CreateAppointmentDto optional
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsString()
  status?: boolean; // To change status (Rescheduled, Cancelled)
}
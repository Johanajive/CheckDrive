// src/appointments/dto/update-appointment.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from '../src/entities/user.entity';
import { IsOptional, IsString } from 'class-validator';

// PartialType makes all properties of CreateAppointmentDto optional
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsString()
  status?: string; // To change status (Rescheduled, Cancelled)
}
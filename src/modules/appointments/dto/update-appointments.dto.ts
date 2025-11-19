import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointments.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsString()
  status?: string;
}

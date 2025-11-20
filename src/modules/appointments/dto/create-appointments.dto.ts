import { IsInt, IsDateString, IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  id_user: number;

  @IsInt()
  @IsNotEmpty()
  id_vehicle: number;  // ← Cambiado de vehicle_id

  @IsInt()
  @IsNotEmpty()
  id_center: number;   // ← Cambiado de center_id

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'The time must be in HH:MM format',
  })
  time: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
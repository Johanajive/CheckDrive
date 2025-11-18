import { IsInt, IsDateString, IsString, IsNotEmpty, Matches } from 'class-validator';
//
export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;
//
  @IsInt()
  @IsNotEmpty()
  vehicle_id: number;
  
  @IsInt()
  @IsNotEmpty()
  center_id: number;

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
  status: string; // "Active", "Cancelled", etc.
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2025-01-15', description: 'Fecha de la cita' })
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '10:30', description: 'Hora de la cita' })
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 1, description: 'ID del usuario asociado a la cita' })
  @IsInt()
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo asociado a la cita' })
  @IsInt()
  @IsNotEmpty()
  id_vehicle: number;

  @ApiProperty({ example: 3, description: 'ID del centro de inspección donde se realizará la cita' })
  @IsInt()
  @IsNotEmpty()
  id_center: number;
}
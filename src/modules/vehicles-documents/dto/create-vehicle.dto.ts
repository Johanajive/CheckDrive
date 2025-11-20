import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'License plate of the vehicle (uppercase, alphanumeric)',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Plate must be alphanumeric uppercase without special characters',
  })
  @MinLength(3)
  @MaxLength(8)
  plate: string;

  @ApiProperty({
    example: 'Toyota',
    description: 'Brand of the vehicle',
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    example: 'Corolla',
    description: 'Model of the vehicle',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    example: 'Sedan',
    description: 'Type of vehicle',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  engine_displacement: number;
}

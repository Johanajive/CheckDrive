import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    example: 'Mazda',
    description: 'New vehicle brand',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    example: 'CX-30',
    description: 'New vehicle model',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    example: 'SUV',
    description: 'New vehicle type',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

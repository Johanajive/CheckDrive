import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Plate must be alphanumeric uppercase without special characters',
  })
  @MinLength(3)
  @MaxLength(8)
  plate: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateLogDto {
  @ApiProperty({ type: String, format: 'date-time', example: new Date().toISOString() })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: 'localhost' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  host: string;

  @ApiProperty({ example: 'UsersService' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  service: string;

  @ApiProperty({ example: 'Usuario creado' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

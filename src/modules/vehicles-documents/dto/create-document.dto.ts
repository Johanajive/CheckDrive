import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    example: '2025-01-01',
    description: 'Start date of the document',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({
    example: '2026-01-01',
    description: 'End date of the document',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the document type',
  })
  @IsNotEmpty()
  @IsNumber()
  document_type_id: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the vehicle',
  })
  @IsNotEmpty()
  @IsNumber()
  vehicle_id: number;
}

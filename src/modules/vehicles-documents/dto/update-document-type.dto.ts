import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentTypeDto {
  @ApiPropertyOptional({
    example: 'Revisión Técnico-Mecánica',
    description: 'Updated name of the document type',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

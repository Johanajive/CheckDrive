import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentTypeDto {
  @ApiProperty({
    example: 'SOAT',
    description: 'Name of the document type',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

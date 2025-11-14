import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentTypeDto {
  @IsOptional()
  @IsString()
  name?: string;
}

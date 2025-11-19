import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

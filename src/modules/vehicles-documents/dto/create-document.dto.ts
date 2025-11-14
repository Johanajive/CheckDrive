import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsNotEmpty()
  @IsNumber()
  document_type_id: number;

  @IsNotEmpty()
  @IsNumber()
  vehicle_id: number;
}

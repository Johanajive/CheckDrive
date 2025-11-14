import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  host: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  service: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

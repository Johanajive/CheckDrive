import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean} from "class-validator";
export class UpdateScheduleDTO{
    @ApiProperty({example:"Martes", description:"Día de la semana del horario", required:false})
    @IsOptional({message: "El día del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El día del horario del centro de revisión debe ser un string (cadena de caracteres"})
    day?:string;

    @ApiProperty({example:"08:00", description:"Hora de apertura o inicio del horario", required:false})
    @IsOptional({message: "La hora de apertura del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La hora de apertura del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    opening_time?:string;

    @ApiProperty({example:"16:00", description:"Hora de cierre o fin del horario", required:false})
    @IsOptional({message: "La hora de cierre del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La hora de cierre del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    closing_time?:string;

    @ApiProperty({example:false, description:"Estado del horario", required:false})
    @IsOptional({message: "El estado del horario del centro de revisión es opcional al actualizarse"})
    @IsBoolean({message:"El estado del horario del centro de revisión debe ser un boolean (true o false)"})
    status?:boolean;
}
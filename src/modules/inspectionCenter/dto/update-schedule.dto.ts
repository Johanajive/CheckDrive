import { Type } from "class-transformer";
import { IsOptional, IsString, IsBoolean} from "class-validator";
export class UpdateScheduleDTO{
    @IsOptional({message: "El día del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El día del horario del centro de revisión debe ser un string (cadena de caracteres"})
    day?:string;

    @IsOptional({message: "La hora de apertura del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La hora de apertura del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    opening_time?:string;

    @IsOptional({message: "La hora de cierre del horario del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La hora de cierre del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    closing_time?:string;

    @IsOptional({message: "El estado del horario del centro de revisión es opcional al actualizarse"})
    @IsBoolean({message:"El estado del horario del centro de revisión debe ser un boolean (true o false)"})
    status?:boolean;
}
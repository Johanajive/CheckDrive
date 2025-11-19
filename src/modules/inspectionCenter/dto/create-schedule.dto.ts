import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateScheduleDTO{
    @IsNotEmpty({message:"El día del horario del centro de revisión es obligatorio"})
    @IsString({message:"El día del horario del centro de revisión debe ser un string (cadena de caracteres"})
    day:string;

    @IsNotEmpty({message:"La hora de apertura del horario del centro de revisión es obligatorio"})
    @IsString({message:"La hora de apertura del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    opening_time:string;

    @IsNotEmpty({message:"La hora de cierre del horario del centro de revisión es obligatorio"})
    @IsString({message:"La hora de cierre del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    closing_time:string;
}
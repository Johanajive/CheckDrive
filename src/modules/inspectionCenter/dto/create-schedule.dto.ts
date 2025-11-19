import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateScheduleDTO{
    @ApiProperty({example:"Lunes", description:"Día de la semana del horario", required:true})
    @IsNotEmpty({message:"El día del horario del centro de revisión es obligatorio"})
    @IsString({message:"El día del horario del centro de revisión debe ser un string (cadena de caracteres"})
    day:string;

    @ApiProperty({example:"07:00", description:"Hora de apertura o inicio del horario", required:true})
    @IsNotEmpty({message:"La hora de apertura del horario del centro de revisión es obligatorio"})
    @IsString({message:"La hora de apertura del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    opening_time:string;

    @ApiProperty({example:"15:00", description:"Hora de cierre o fin del horario", required:true})
    @IsNotEmpty({message:"La hora de cierre del horario del centro de revisión es obligatorio"})
    @IsString({message:"La hora de cierre del horario del centro de revisión debe ser un string (cadena de caracteres)"})
    closing_time:string;
}
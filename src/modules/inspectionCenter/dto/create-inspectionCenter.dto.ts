import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateInspectionCenterDto {
    @ApiProperty({example:"Centro Zona Sur", description:"Nombre del centro de revisión", required:true})
    @IsNotEmpty({message:"El nombre del centro de revisión es obligatorio"})
    @IsString({message:"El nombre del centro de revisión debe ser un string (cadena de caracteres)"})
    name:string;

    @ApiProperty({example:"Bogotá", description:"Ciudad donde se ubica el centro de revisión", required:true})
    @IsNotEmpty({message:"La ciudad del centro de revisión es obligatorio"})
    @IsString({message:"La ciudad del centro de revisión debe ser un string (cadena de caracteres)"})
    city:string;

    @ApiProperty({example:"Calle 54 #89-59 Sur", description:"Dirección del centro de revisión", required:true})
    @IsNotEmpty({message:"La dirección del centro de revisión es obligatorio"})
    @IsString({message:"La dirección del centro de revisión debe ser un string (cadena de caracteres)"})
    address:string;

    @ApiProperty({example:"3058956321", description:"Teléfono de contacto del centro de revisión", required:true})
    @IsNotEmpty({message:"El teléfono del centro de revisión es obligatorio"})
    @IsString({message:"El teléfono del centro de revisión debe ser un string (cadena de caracteres)"})
    phone:string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class CreateInspectionCenterDto {

    @IsNotEmpty({message:"El nombre del centro de revisión es obligatorio"})
    @IsString({message:"El nombre del centro de revisión debe ser un string (cadena de caracteres)"})
    name:string;

    @IsNotEmpty({message:"La ciudad del centro de revisión es obligatorio"})
    @IsString({message:"La ciudad del centro de revisión debe ser un string (cadena de caracteres)"})
    city:string;

    @IsNotEmpty({message:"La dirección del centro de revisión es obligatorio"})
    @IsString({message:"La dirección del centro de revisión debe ser un string (cadena de caracteres)"})
    address:string;

    @IsNotEmpty({message:"El teléfono del centro de revisión es obligatorio"})
    @IsString({message:"El teléfono del centro de revisión debe ser un string (cadena de caracteres)"})
    phone:string;
}
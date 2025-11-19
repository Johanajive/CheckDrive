import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateInspectionCenterDto {
    @IsOptional({message: "El nombre del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El nombre del centro de revisión debe ser un string (cadena de caracteres)"})
    name?:string;

    @IsOptional({message: "La ciudad del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La ciudad del centro de revisión debe ser un string (cadena de caracteres)"})
    city?:string;

    @IsOptional({message: "La dirección del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La dirección del centro de revisión debe ser un string (cadena de caracteres)"})
    address?:string;

    @IsOptional({message: "El teléfono del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El teléfono del centro de revisión debe ser un string (cadena de caracteres)"})
    phone?:string;

    @IsOptional({message: "El estado del centro de revisión es opcional al actualizarse"})
    @IsBoolean({message:"El estado del centro de revisión debe ser un boolean(true o false)"})
    status?:boolean;
}
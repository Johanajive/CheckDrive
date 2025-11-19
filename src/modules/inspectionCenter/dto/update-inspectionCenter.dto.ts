import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateInspectionCenterDto {
    @ApiProperty({example:"Centro Zona Norte", description:"Nombre del centro de revisión", required:false})
    @IsOptional({message: "El nombre del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El nombre del centro de revisión debe ser un string (cadena de caracteres)"})
    name?:string;

    @ApiProperty({example:"Cali", description:"Ciudad donde se ubica el centro de revisión", required:false})
    @IsOptional({message: "La ciudad del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La ciudad del centro de revisión debe ser un string (cadena de caracteres)"})
    city?:string;

    @ApiProperty({example:"Calle 78 #85-54 Norte", description:"Dirección del centro de revisión", required:false})
    @IsOptional({message: "La dirección del centro de revisión es opcional al actualizarse"})
    @IsString({message:"La dirección del centro de revisión debe ser un string (cadena de caracteres)"})
    address?:string;

    @ApiProperty({example:"12345699", description:"Teléfono de contacto del centro de revisión", required:false})
    @IsOptional({message: "El teléfono del centro de revisión es opcional al actualizarse"})
    @IsString({message:"El teléfono del centro de revisión debe ser un string (cadena de caracteres)"})
    phone?:string;

    @ApiProperty({example:true, description:"Estado del centro de revisión", required:false})
    @IsOptional({message: "El estado del centro de revisión es opcional al actualizarse"})
    @IsBoolean({message:"El estado del centro de revisión debe ser un boolean(true o false)"})
    status?:boolean;
}
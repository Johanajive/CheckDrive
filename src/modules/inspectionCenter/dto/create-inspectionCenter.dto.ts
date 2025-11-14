import { IsNotEmpty, IsString } from "class-validator";

export class CreateInspectionCenterDto {

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsString()
    address:string;

    @IsNotEmpty()
    @IsString()
    phone:string;
}
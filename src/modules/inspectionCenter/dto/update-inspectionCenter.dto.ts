import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateInspectionCenterDto {
    @IsOptional()
    @IsString()
    name?:string;

    @IsOptional()
    @IsString()
    city?:string;

    @IsOptional()
    @IsString()
    address?:string;

    @IsOptional()
    @IsString()
    phone?:string;

    @IsOptional()
    @IsBoolean()
    status?:boolean;
}
import { Type } from "class-transformer";
import { IsOptional, IsString, IsBoolean} from "class-validator";
export class UpdateScheduleDTO{
    @IsOptional()
    @IsString()
    day?:string;

    @IsOptional()
    @IsString()
    opening_time?:string;

    @IsOptional()
    @IsString()
    closing_time?:string;

    @IsOptional()
    @IsBoolean()
    status?:boolean;

    @IsOptional()
    @Type(()=>Number)
    inspectionCenter?:number;
}
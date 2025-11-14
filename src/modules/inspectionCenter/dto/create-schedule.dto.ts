import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateScheduleDTO{
    @IsNotEmpty()
    @IsString()
    day:string;

    @IsNotEmpty()
    @IsString()
    opening_time:string;

    @IsNotEmpty()
    @IsString()
    closing_time:string;

    @IsNotEmpty()
    @Type(()=>Number)
    inspectionCenter:number;
}
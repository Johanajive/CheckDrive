import { IsBoolean, IsNotEmpty } from "class-validator";
import { CreateUserDTO } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDTO extends CreateUserDTO {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}

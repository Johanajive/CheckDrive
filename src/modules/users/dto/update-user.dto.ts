import { IsBoolean, IsNotEmpty } from "class-validator";
import { CreateUserDTO } from "./create-user.dto";

export class UpdateUserDTO extends CreateUserDTO {
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}

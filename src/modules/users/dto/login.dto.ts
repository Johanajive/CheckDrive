import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Length, Matches } from "class-validator";

export class LoginDTO {
    @ApiProperty({ example: 'johana@gmail.com' })
    @IsEmail({}, { message: 'El correo electrónico no es válido, debe seguir el formato' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
    @Length(5, 320, { message: 'El correo debe tener entre 5 y 320 caracteres' })
    email: string;

    @ApiProperty({ example: 'Abcd1234$' })
    @Length(8, 15, { message: 'La contraseña debe tener entre 8 a 15 caracteres' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
        { message: 'La contraseña debe tener entre 8 y 15 caracteres, e incluir al menos una mayúscula, una minúscula, un número y un carácter especial' })
    password: string;
}

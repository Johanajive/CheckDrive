
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches, IsEmail } from "class-validator";
import { RolesEnum } from "src/common/enum/roles.enum";

export class CreateUserDTO {
    @ApiProperty({ example: 'Johana', description: 'Nombre del usuario' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @Length(3, 20, { message: 'El nombre debe tener entre 3 y 20 caracteres' })
    @Matches(/^[A-Za-z]+$/, { message: 'En el nombre solo se permiten letras' })
    name: string;

    @ApiProperty({ example: 'Jimenez', description: 'Apellido' })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
    @Length(3, 20, { message: 'El apellido debe tener entre 3 y 20 caracteres' })
    lastName: string;

    @ApiProperty({ example: 'johana@gmail.com', description: 'Correo electrónico' })
    @IsEmail({}, { message: 'El correo electrónico no es válido, debe seguir el formato' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
    @Length(5, 320, { message: 'El correo debe tener entre 5 y 320 caracteres' })
    email: string;

    @ApiProperty({ example: 123456789, description: 'Documento de identificación' })
    @IsNotEmpty({ message: 'La cédula es obligatoria' })
    @IsInt({message:"La cédula solo permite números enteros"})
    @Min(1000000, {message:"La cédula debe tener mínimo 7 dígitos"})
    @Max(999999999999, {message:"La cédula debe tener máximo 12 dígitos"})
    identificationDocument: number;

    @ApiProperty({ example: '3001234567', description: 'Teléfono celular (10 dígitos)' })
    @IsString({ message: 'El número de celular debe ser una cadena de caracteres' })
    @IsNotEmpty({ message: 'El número de celular no puede estar vacío' })
    @Length(10, 10, { message: 'El número de celular debe tener 10 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'En el numero de celular solo se permiten números' })
    @Matches(/^3\d{9}$/, { message: 'El número de celular debe iniciar con 3 y tener 10 dígitos (Colombia)' })
    phone: string;

    @ApiProperty({ example: 'Abcd1234$', description: 'Contraseña' })
    @Length(8, 15, { message: 'La contraseña debe tener entre 8 a 15 caracteres' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
        { message: 'La contraseña debe tener entre 8 y 15 caracteres, e incluir al menos una mayúscula, una minúscula, un número y un carácter especial' })
    password: string;

    @ApiProperty({ enum: RolesEnum, example: RolesEnum.USER, description: 'Rol del usuario' })
    @IsNotEmpty()
    role: RolesEnum;

}

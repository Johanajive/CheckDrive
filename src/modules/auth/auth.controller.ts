import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/register
     * register: Registra un nuevo usuario en el sistema.
     * @param data { CreateUserDTO } - Datos de registro.
     */
    @Post('register')
    register(@Body() data: CreateUserDTO) {
        return this.authService.register(data);
    }

    /**
     * POST /auth/login
     * login: Autentica un usuario y retorna un token JWT.
     * @param data { LoginDTO } - Credenciales del usuario.
     */
    @Post('login')
    login(@Body() data: LoginDTO) {
        return this.authService.login(data);
    }

    /**
     * GET /auth/profile
     * getProfile: Retorna el usuario autenticado basado en el token.
     */
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}

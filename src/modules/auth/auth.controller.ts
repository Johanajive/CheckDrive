
import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from '../users/dto/login.dto';

// Agrupa este controlador dentro de la categoría "Auth" en Swagger.
@ApiTags('Auth')

// Ruta base: /auth
@Controller('auth')
export class AuthController {

  // Inyección del AuthService para manejar autenticación y registro.
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario en el sistema.
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: CreateUserDTO }) // Especifica la estructura del body en Swagger.
  register(@Body() data: CreateUserDTO) {
    // Delegación al servicio para crear al usuario.
    return this.authService.register(data);
  }

  /**
   * POST /auth/login
   * Realiza el login del usuario y devuelve un token JWT.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login y obtención de token' })
  @ApiBody({ type: LoginDTO }) // Define el modelo del body para Swagger.
  @ApiResponse({ status: 201, description: 'Token JWT' })
  login(@Body() data: LoginDTO) {
    // Delegación al servicio para validar credenciales y generar el token.
    return this.authService.login(data);
  }

  /**
   * GET /auth/profile
   * Obtiene información del usuario autenticado usando el token JWT.
   */
  @Get('profile')
  @ApiBearerAuth('bearerAuth') // Indica que este endpoint requiere token.
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Request() req) {
    // req.user viene del JwtStrategy y contiene los datos del usuario autenticado.
    return req.user;
  }
}


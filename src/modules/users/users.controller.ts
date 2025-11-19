
import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';

// Agrupa todos los endpoints dentro de la categoría "Users" en Swagger.
@ApiTags('Users')

// Indica que este controlador requiere autenticación por token Bearer.
@ApiBearerAuth('bearerAuth')

// Se aplican los guardias de seguridad a todos los endpoints del controlador:
// - JwtAuthGuard valida el token JWT.
// - RolesGuard valida el rol del usuario.
@UseGuards(JwtAuthGuard, RolesGuard)

// Define la ruta base del controlador: /users
@Controller('users')
export class UsersController {

  // Inyección del servicio UsersService para acceder a la lógica de negocio.
  constructor(private readonly usersService: UsersService) { }

  /**
   * GET /users
   * Obtiene todos los usuarios activos.
   */
  @Get()
  @Roles(RolesEnum.ADMIN) // Solo accesible por administradores.
  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Obtiene un usuario específico por ID.
   */
  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe asegura que el parámetro ID sea un número.
    return this.usersService.findOne(id);
  }

  /**
   * GET /users/name/:name
   * Busca usuarios cuyo nombre coincida parcial o completamente.
   */
  @Get('name/:name')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Buscar usuarios por nombre' })
  findName(@Param('name') name: string) {
    return this.usersService.findName(name);
  }

  /**
   * GET /users/document/:document
   * Busca usuarios por documento de identificación.
   */
  @Get('document/:document')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Buscar usuario por documento' })
  findDocument(@Param('document') document: number) {
    return this.usersService.findDocument(document);
  }

  /**
   * POST /users
   * Crea un nuevo usuario en el sistema.
   */
  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDTO }) // Define el modelo esperado en Swagger.
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  /**
   * PUT /users/:id
   * Actualiza la información de un usuario existente.
   */
  @Put(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBody({ type: UpdateUserDTO })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return this.usersService.update(id, body);
  }

  /**
   * DELETE /users/:id
   * Desactiva (soft delete) un usuario sin eliminarlo físicamente.
   */
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Desactivar usuario' })
  disabled(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.disabled(id);
  }
}


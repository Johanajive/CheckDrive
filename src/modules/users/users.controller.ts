import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * GET /users
     * findAll: Obtiene todos los usuarios activos del sistema.
     * Requiere rol ADMIN.
     */
    @Get()
    @Roles(RolesEnum.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    /**
     * GET /users/:id
     * findOne: Consulta un usuario por su ID.
     * @param id { number } - ID del usuario.
     * Requiere rol ADMIN.
     */
    @Get(':id')
    @Roles(RolesEnum.ADMIN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    /**
     * GET /users/name/:name
     * findName: Busca usuarios por nombre o coincidencia parcial.
     * @param name { string } - Nombre a buscar.
     * Requiere rol ADMIN.
     */
    @Get('name/:name')
    @Roles(RolesEnum.ADMIN)
    findName(@Param('name') name: string) {
        return this.usersService.findName(name);
    }

    /**
     * GET /users/document/:document
     * findDocument: Busca un usuario por su documento.
     * @param document { number } - Documento de identificación.
     * Requiere rol ADMIN.
     */
    @Get('document/:document')
    @Roles(RolesEnum.ADMIN)
    findDocument(@Param('document') document: number){
        return this.usersService.findDocument(document)
    }

    /**
     * POST /users
     * create: Registra un nuevo usuario en el sistema.
     * @param body { CreateUserDTO } - Datos del usuario a crear.
     * Requiere rol ADMIN.
     */
    @Post()
    @Roles(RolesEnum.ADMIN)
    create(@Body() body: CreateUserDTO) {
        return this.usersService.create(body);
    }

    /**
     * PUT /users/:id
     * update: Actualiza los datos de un usuario.
     * @param id { number } - ID del usuario.
     * @param body { UpdateUserDTO } - Datos actualizados.
     * Requiere rol ADMIN.
     */
    @Put(':id')
    @Roles(RolesEnum.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
        return this.usersService.update(id, body)
    }

    /**
     * DELETE /users/:id
     * disabled: Desactiva un usuario (soft delete).
     * @param id { number } - ID del usuario.
     * Requiere rol ADMIN.
     */
    @Delete(':id')
    @Roles(RolesEnum.ADMIN)
    disabled(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.disabled(id);
    }
}

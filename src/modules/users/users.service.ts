
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateUserDTO } from './dto/create-user.dto';
import { Users } from './entity/user.entity';
import { Like, Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepo: Repository<Users>,
        private readonly logsService: LogsService,
    ) {}

    /**
     * @description Obtener todos los usuarios activos del sistema.
     * @returns Lista de usuarios activos en formato plano.
     * @throws NotFoundException Cuando no existen usuarios activos.
     */
    async findAll() {
        const users = await this.usersRepo.find({ where: { status: true } });
        if (!users || users.length === 0) {
            throw new NotFoundException('No hay usuarios disponibles');
        }

        // Registrar log de consulta
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: 'Consulta general de usuarios activos.',
        });

        return users.map((user) => instanceToPlain(user));
    }

    /**
     * @description Buscar un usuario por ID.
     * @param id ID del usuario.
     * @returns Usuario encontrado.
     * @throws NotFoundException Si el usuario no existe.
     */
    async findOne(id: number) {
        const userFind = await this.usersRepo.findOne({ where: { id_user: id } });
        if (!userFind)
            throw new NotFoundException(`Usuario con el id ${id} no existe`);

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Consulta del usuario con ID: ${id}`,
        });

        return userFind;
    }

    /**
     * @description Buscar usuarios cuyo nombre coincida parcial o totalmente.
     * @param name Nombre o parte del nombre.
     * @returns Lista de usuarios encontrados.
     * @throws NotFoundException Si no se encontraron usuarios.
     */
    async findName(name: string) {
        const userFindName = await this.usersRepo.find({
            where: { name: Like(`%${name}%`) },
        });
        if (userFindName.length === 0)
            throw new NotFoundException('No se encontraron usuarios con ese nombre');

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Búsqueda de usuario por nombre: ${name}`,
        });

        return userFindName;
    }

    /**
     * @description Buscar usuario por documento de identificación.
     * @param document Número del documento.
     * @returns Lista de usuarios encontrados.
     * @throws NotFoundException Si no existe un usuario con ese documento.
     */
    async findDocument(document: number) {
        const userFindDocument = await this.usersRepo.find({
            where: { identificationDocument: document },
        });
        if (!userFindDocument || userFindDocument.length === 0)
            throw new NotFoundException(
                `El usuario con este documento ${document} no existe`,
            );

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Consulta de usuario con documento: ${document}`,
        });

        return userFindDocument;
    }

    /**
     * @description Crear un nuevo usuario.
     * @param newUser Datos necesarios para crear el usuario.
     * @returns Usuario creado.
     */
    async create(newUser: CreateUserDTO) {
        const userCreated = this.usersRepo.create(newUser);
        const savedUser = await this.usersRepo.save(userCreated);

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Usuario creado con ID: ${savedUser.id_user}`,
        });

        return savedUser;
    }

    /**
     * @description Actualiza un usuario existente.
     * @param id ID del usuario.
     * @param updateUser Datos actualizados.
     * @returns Usuario actualizado.
     * @throws NotFoundException Si el usuario no existe.
     */
    async update(id: number, updateUser: UpdateUserDTO) {
        const hashedPassword = await bcrypt.hash(updateUser.password, 10);
        await this.usersRepo.update(id, { ...updateUser, password: hashedPassword });
        const updatedUser = await this.findOne(id);

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Usuario actualizado con ID: ${id}`,
        });

        return updatedUser;
    }

    /**
     * @description Desactivar un usuario (soft delete).
     * @param id ID del usuario.
     * @returns Mensaje de confirmación y datos del usuario.
     * @throws NotFoundException Si el usuario no existe.
     */
    async disabled(id: number) {
        const userFind = await this.usersRepo.findOne({ where: { id_user: id } });
        if (!userFind) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        userFind.status = false;
        await this.usersRepo.save(userFind);

        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: `Usuario desactivado con ID: ${id}`,
        });

        return {
            message: `Usuario con el ID ${id} ha sido desactivado correctamente`,
            userFind,
        };
    }
}


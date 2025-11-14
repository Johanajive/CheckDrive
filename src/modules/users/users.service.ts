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
    ) { }

    /**
     * findAll: Obtiene todos los usuarios activos del sistema.
     * @returns Lista de usuarios activos transformados a objetos planos.
     */
    async findAll() {
        const users = await this.usersRepo.find({ where: { status: true } });
        if (!users || users.length === 0) {
            throw new NotFoundException('No hay usuarios disponibles');
        }

        //  Registrar log de consulta
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'UsersService',
            content: 'Consulta general de usuarios activos.',
        });

        return users.map((user) => instanceToPlain(user));
    }

    /**
     * findOne: Busca un usuario por su ID.
     * @param id { number } - ID del usuario.
     * @returns { Users } Usuario encontrado.
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
     * findName: Busca usuarios cuyo nombre coincida parcialmente.
     * @param name { string } - Nombre o fragmento de nombre.
     * @returns { Users[] } Lista de usuarios encontrados.
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
     * findDocument: Obtiene usuarios por documento de identificación.
     * @param document { number } - Número del documento.
     * @returns { Users[] } Lista de usuarios encontrados.
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
     * create: Crea un nuevo usuario.
     * @param newUser { CreateUserDTO } - Datos del usuario a registrar.
     * @returns { Users } Usuario creado.
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
     * update: Actualiza un usuario existente.
     * @param id { number } - ID del usuario.
     * @param updateUser { UpdateUserDTO } - Datos actualizados.
     * @returns { Users } Usuario actualizado.
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
     * disabled: Desactiva un usuario (soft delete).
     * @param id { number } - ID del usuario.
     * @returns Mensaje de confirmación y datos del usuario.
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

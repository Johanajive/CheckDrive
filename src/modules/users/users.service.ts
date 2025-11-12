import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateUserDTO } from './dto/create-user.dto';
import { Users } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepo: Repository<Users>
    ) { }

    async findAll() {
        const users = await this.usersRepo.find({ where: { status: true } });
        if (!users || users.length === 0) {
            throw new NotFoundException('No hay usuarios disponibles')
        }
        return users.map((user) => instanceToPlain(user));
    }

    async findOne(id: number) {
        const userFind = await this.usersRepo.findOne({ where: { id_user: id } });
        if (!userFind) throw new NotFoundException(`Usuario con el id ${id} no existe`)
        return userFind
    }

    async findName(name: string) {
        const userFindName = await this.usersRepo.find({ where: { name: Like(`%${name}%`) } });
        if (userFindName.length === 0)
            throw new NotFoundException('No se encontraron usuarios con ese nombre');
        return userFindName
    }

    create(newUser: CreateUserDTO) {
        const userCreated = this.usersRepo.create(newUser)
        return this.usersRepo.save(userCreated)
    }

    async update(id: number, updateUser: UpdateUserDTO) {
        const hashedPassword = await bcrypt.hash(updateUser.password, 10)
        await this.usersRepo.update(id, { ...updateUser, password: hashedPassword })
        return this.findOne(id)
    }

    async disabled(id: number) {
        const userFind = await this.usersRepo.findOne({ where: { id_user: id } });
        if (!userFind) { throw new NotFoundException(`Usuario con ID ${id} no encontrado`) }

        userFind.status = false;
        await this.usersRepo.save(userFind);
        return { message: `Usuario con el ID ${id} ha sido desactivado correctamente`, userFind }
    }

}
